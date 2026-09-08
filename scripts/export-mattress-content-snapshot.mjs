import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import ts from "typescript";

const require = createRequire(import.meta.url);
const root = process.cwd();
const siteUrl = "https://www.findyouridealmattress.com";

function loadTsData(relativePath) {
  const source = fs.readFileSync(path.join(root, relativePath), "utf8").replace(/^[ \t]*import\s[^\n]*\n/gm, "");
  const output = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText;
  const compiledModule = { exports: {} };
  new Function("exports", "module", "require", output)(compiledModule.exports, compiledModule, require);
  return compiledModule.exports;
}

const { mattressSeoPages } = loadTsData("config/mattress/seo-pages.ts");
const { mattressComparisonPages } = loadTsData("config/mattress/comparison-pages.ts");
const { products } = loadTsData("config/mattress/products.ts");
const productName = new Map(products.map((product) => [product.id, `${product.brand} ${product.name}`]));
const guideLink = (slug) => ({ url: `${siteUrl}/mattress/${slug}`, anchor: mattressSeoPages.find((page) => page.slug === slug)?.h1 ?? slug, category: "contextual" });
const comparisonLink = (page) => ({ url: `${siteUrl}/mattress/compare/${page.slug}`, anchor: page.h1, category: "contextual" });

const pages = [
  {
    siteId: "mattress", url: `${siteUrl}/mattress/best-mattress`, slug: "best-mattress", pageType: "commercial-hub",
    title: "Best Mattress (2026): Find the Right Mattress for How You Sleep | FindYourIdeal", h1: "Best Mattress: Find the Right Mattress for How You Sleep",
    canonical: `${siteUrl}/mattress/best-mattress`, indexable: true, sitemapPresent: true, lastUpdated: null, productsReferenced: [], extractionMethod: "source-and-rendered-link-map",
    internalLinksOut: [...mattressSeoPages.map((page) => guideLink(page.slug)), ...mattressComparisonPages.map(comparisonLink), { url: `${siteUrl}/mattress/questionnaire`, anchor: "personalised mattress quiz", category: "cta" }],
  },
  ...mattressSeoPages.map((page) => ({
    siteId: "mattress", url: `${siteUrl}/mattress/${page.slug}`, slug: page.slug, pageType: "buying-guide", title: page.metaTitle, metaDescription: page.metaDescription, h1: page.h1,
    canonical: `${siteUrl}/mattress/${page.slug}`, indexable: true, sitemapPresent: true, lastUpdated: page.lastReviewed, productsReferenced: [], extractionMethod: "config-and-rendered-link-map",
    internalLinksOut: [{ url: `${siteUrl}/mattress/best-mattress`, anchor: "Best Mattress", category: "navigation" }, ...page.relatedSlugs.map(guideLink), { url: `${siteUrl}/mattress/questionnaire`, anchor: "personalised mattress quiz", category: "cta" }],
  })),
  ...mattressComparisonPages.map((page) => ({
    siteId: "mattress", url: `${siteUrl}/mattress/compare/${page.slug}`, slug: page.slug, pageType: "comparison", title: page.metaTitle, metaDescription: page.metaDescription, h1: page.h1,
    canonical: `${siteUrl}/mattress/compare/${page.slug}`, indexable: true, sitemapPresent: true, lastUpdated: null,
    productsReferenced: [productName.get(page.leftProductId), productName.get(page.rightProductId)].filter(Boolean), extractionMethod: "config-and-rendered-link-map",
    internalLinksOut: [{ url: `${siteUrl}/`, anchor: "Home", category: "navigation" }, { url: `${siteUrl}/mattress/best-mattress`, anchor: "Best Mattress", category: "navigation" }, { url: `${siteUrl}/mattress/questionnaire`, anchor: "personalised mattress quiz", category: "cta" }],
  })),
];

const snapshot = { schemaVersion: 1, siteId: "mattress", siteUrl, generatedAt: new Date().toISOString(), limitations: ["Inventory derives from Mattress-owned routes, configuration, and rendered link mappings.", "Product review routes were not found in current Mattress route/configuration sources."], pages };
snapshot.contentHash = crypto.createHash("sha256").update(JSON.stringify({ siteId: snapshot.siteId, siteUrl, pages })).digest("hex");
const outputDirectory = path.join(root, "seo-results", "content-snapshot");
fs.mkdirSync(outputDirectory, { recursive: true });
fs.writeFileSync(path.join(outputDirectory, "mattress.snapshot.json"), `${JSON.stringify(snapshot, null, 2)}\n`);
console.log(JSON.stringify({ snapshotFile: "seo-results/content-snapshot/mattress.snapshot.json", pages: pages.length, hubs: 1, guides: mattressSeoPages.length, comparisons: mattressComparisonPages.length, productReviews: 0 }, null, 2));