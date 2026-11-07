/* eslint-disable @typescript-eslint/no-require-imports -- CommonJS helpers are shared by Jest and ESM command entry points. */
const fs = require('node:fs');
const path = require('node:path');
const ts = require('typescript');
const SITE_URL = 'https://www.findyouridealmattress.com';

function sourceLoader(root) {
  const cache = new Map();
  function load(relativePath) {
    const filename = path.resolve(root, relativePath);
    if (cache.has(filename)) return cache.get(filename).exports;
    const compiledModule = { exports: {} };
    cache.set(filename, compiledModule);
    const output = ts.transpileModule(fs.readFileSync(filename, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText;
    const localRequire = specifier => {
      if (!specifier.startsWith('.')) return require(specifier);
      const candidate = path.resolve(path.dirname(filename), specifier);
      const resolved = ['', '.ts', '.tsx', '.js'].map(ext => candidate + ext).find(file => fs.existsSync(file) && fs.statSync(file).isFile());
      if (!resolved) throw new Error(`Cannot resolve inventory source ${specifier}`);
      return load(resolved);
    };
    // Trusted repository data/sitemap modules, with an explicit public canonical.
    new Function('exports', 'module', 'require', 'process', output)(compiledModule.exports, compiledModule, localRequire, { env: { ...process.env, NEXT_PUBLIC_SITE_URL: SITE_URL } });
    return compiledModule.exports;
  }
  return load;
}

function sourceFacts(root = process.cwd()) {
  const load = sourceLoader(root);
  const { mattressSeoPages: guides } = load('config/mattress/seo-pages.ts');
  const { mattressComparisonPages: comparisons } = load('config/mattress/comparison-pages.ts');
  const pages = [
    { url: `${SITE_URL}/mattress/best-mattress`, pageType: 'commercial-hub', internalLinksOut: [...guides.map(page => `${SITE_URL}/mattress/${page.slug}`), ...comparisons.map(page => `${SITE_URL}/mattress/compare/${page.slug}`)] },
    ...guides.map(page => ({ url: `${SITE_URL}/mattress/${page.slug}`, pageType: 'buying-guide', lastUpdated: page.lastReviewed, internalLinksOut: page.relatedSlugs.map(slug => `${SITE_URL}/mattress/${slug}`) })),
    ...comparisons.map(page => ({ url: `${SITE_URL}/mattress/compare/${page.slug}`, pageType: 'comparison', internalLinksOut: [`${SITE_URL}/mattress/best-mattress`] })),
  ];
  const routeFiles = [];
  const visit = directory => {
    for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
      const file = path.join(directory, entry.name);
      if (entry.isDirectory()) visit(file);
      else if (entry.name === 'page.tsx' || entry.name === 'page.ts') routeFiles.push(path.relative(path.join(root, 'app'), path.dirname(file)).split(path.sep).join('/'));
    }
  };
  visit(path.join(root, 'app/mattress'));
  const mapped = ['mattress/[slug]', 'mattress/compare/[slug]', 'mattress/best-mattress'];
  for (const route of mapped) if (!routeFiles.includes(route)) throw new Error(`Configured commercial route template missing: ${route}`);
  const exclusions = ['mattress/questionnaire', 'mattress/results'];
  for (const route of routeFiles.filter(route => !mapped.includes(route) && !exclusions.includes(route))) {
    if (route.includes('[')) throw new Error(`Unmapped dynamic commercial route: ${route}`);
    pages.push({ url: `${SITE_URL}/${route}`, pageType: 'commercial-route', internalLinksOut: null });
  }
  const sitemap = load('app/sitemap.ts').default();
  if (!Array.isArray(sitemap)) throw new Error('Sitemap did not return entries');
  return { pages, sitemap, exclusions, routeFiles };
}

function buildInventory(root = process.cwd()) {
  const facts = sourceFacts(root);
  const urls = facts.sitemap.map(entry => entry.url);
  if (new Set(urls).size !== urls.length) throw new Error('Duplicate source sitemap URLs');
  return {
    schemaVersion: 2, siteId: 'mattress', siteUrl: SITE_URL, generatedAt: new Date().toISOString(),
    sitemapSource: 'evaluated-app/sitemap.ts', sourceRoutes: facts.routeFiles, excludedRoutes: facts.exclusions,
    limitations: ['Source-derived commercial inventory and rendered-link-map model; not a live crawl or browser verification.', 'Indexing status, actual product references and unmodelled links are not assessed.'],
    pages: facts.pages.map(page => {
      const entry = facts.sitemap.find(item => item.url === page.url);
      return { ...page, indexable: true, sitemapPresent: Boolean(entry), sitemapLastModified: entry?.lastModified ? new Date(entry.lastModified).toISOString() : null };
    }),
  };
}

function validateInventory(snapshot, root = process.cwd()) {
  if (snapshot?.schemaVersion !== 2 || snapshot.siteUrl !== SITE_URL || !Array.isArray(snapshot.pages)) throw new Error('Invalid inventory identity');
  const expected = buildInventory(root);
  const urls = snapshot.pages.map(page => page.url);
  if (new Set(urls).size !== urls.length) throw new Error('Duplicate inventory URLs');
  if (JSON.stringify([...urls].sort()) !== JSON.stringify(expected.pages.map(page => page.url).sort())) throw new Error('Inventory does not cover current configured and static commercial routes');
  for (const page of expected.pages) {
    const actual = snapshot.pages.find(item => item.url === page.url);
    if (actual.sitemapPresent !== page.sitemapPresent || actual.sitemapLastModified !== page.sitemapLastModified || actual.indexable !== true) throw new Error(`Stale sitemap facts for ${page.url}`);
  }
  const missing = expected.pages.filter(page => !page.sitemapPresent).map(page => page.url);
  if (missing.length) throw new Error(`Commercial URLs missing from actual sitemap: ${missing.join(', ')}`);
  return { status: 'pass', qualifyingPages: urls.length, missingFromSitemap: [], sitemapSource: expected.sitemapSource };
}
module.exports = { buildInventory, validateInventory, sourceFacts };
