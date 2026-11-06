/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');
const { buildInventory, validateInventory } = require('./mattress-seo-inventory.cjs');
let root;
const put = (file, content) => { const target = path.join(root, file); fs.mkdirSync(path.dirname(target), { recursive: true }); fs.writeFileSync(target, content); };
const sitemapSource = `import { mattressSeoPages } from '../config/mattress/seo-pages';
export default function sitemap() { return [{url:'https://www.findyouridealmattress.com/mattress/best-mattress'}, ...mattressSeoPages.map(p => ({url:'https://www.findyouridealmattress.com/mattress/'+p.slug}))]; }`;
beforeEach(() => {
  root = fs.mkdtempSync(path.join(os.tmpdir(), 'mattress-inventory-'));
  put('config/mattress/seo-pages.ts', "export const mattressSeoPages = [{slug:'test-guide',relatedSlugs:[],lastReviewed:'2026-06-18'}];");
  put('config/mattress/comparison-pages.ts', 'export const mattressComparisonPages = [];');
  ['app/mattress/[slug]/page.tsx', 'app/mattress/compare/[slug]/page.tsx', 'app/mattress/best-mattress/page.tsx'].forEach(file => put(file, 'export default function Page() { return null; }'));
  put('app/sitemap.ts', sitemapSource);
});
afterEach(() => fs.rmSync(root, { recursive: true, force: true }));
it('evaluates the sitemap instead of trusting configured inclusion flags', () => {
  put('app/sitemap.ts', "export default function sitemap() { return [{url:'https://www.findyouridealmattress.com/mattress/best-mattress'}]; }");
  const inventory = buildInventory(root);
  expect(inventory.pages.find(page => page.url.endsWith('test-guide')).sitemapPresent).toBe(false);
  expect(() => validateInventory(inventory, root)).toThrow('missing from actual sitemap');
});
it('adapts to new configured pages instead of requiring thirteen', () => {
  const before = buildInventory(root);
  expect(validateInventory(before, root).qualifyingPages).toBe(2);
  put('config/mattress/seo-pages.ts', "export const mattressSeoPages = [{slug:'test-guide',relatedSlugs:[]},{slug:'new-guide',relatedSlugs:[]}];");
  expect(() => validateInventory(before, root)).toThrow('cover current');
  expect(validateInventory(buildInventory(root), root).qualifyingPages).toBe(3);
});
it('discovers new static commercial routes and rejects unmapped dynamic routes', () => {
  put('app/mattress/new-hub/page.tsx', 'export default function Page() { return null; }');
  expect(buildInventory(root).pages.some(page => page.url.endsWith('new-hub'))).toBe(true);
  expect(() => validateInventory(buildInventory(root), root)).toThrow('missing from actual sitemap');
  put('app/mattress/brands/[brand]/page.tsx', 'export default function Page() { return null; }');
  expect(() => buildInventory(root)).toThrow('Unmapped dynamic');
});
it('rejects stale sitemap dates and duplicate page records', () => {
  const stale = buildInventory(root); stale.pages[0].sitemapLastModified = '2026-10-01';
  expect(() => validateInventory(stale, root)).toThrow('Stale sitemap');
  const duplicate = buildInventory(root); duplicate.pages.push(duplicate.pages[0]);
  expect(() => validateInventory(duplicate, root)).toThrow('Duplicate inventory');
});
