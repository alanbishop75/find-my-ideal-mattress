import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const snapshotPath = path.join(root, "seo-results", "content-snapshot", "mattress.snapshot.json");
if (!fs.existsSync(snapshotPath)) throw new Error("Missing Mattress inventory. Run npm run seo:mattress:inventory first.");
const snapshot = JSON.parse(fs.readFileSync(snapshotPath, "utf8"));
const qualifying = snapshot.pages.filter((page) => page.indexable);
const duplicateUrls = qualifying.filter((page, index) => qualifying.findIndex((other) => other.url === page.url) !== index).map((page) => page.url);
const missingFromSitemap = qualifying.filter((page) => !page.sitemapPresent).map((page) => page.url);
const linksCaptured = qualifying.every((page) => Array.isArray(page.internalLinksOut));
if (qualifying.length !== 13) throw new Error(`Expected 13 qualifying Mattress pages, found ${qualifying.length}.`);
if (duplicateUrls.length) throw new Error(`Duplicate qualifying URLs: ${duplicateUrls.join(", ")}`);
if (!linksCaptured) throw new Error("Rendered internal-link mapping is missing from one or more qualifying pages.");
console.log(JSON.stringify({ status: "pass-with-findings", qualifyingPages: qualifying.length, pageTypes: Object.groupBy(qualifying, (page) => page.pageType), missingFromSitemap, findings: missingFromSitemap.length ? ["Configured comparison routes are indexable but absent from the current sitemap source."] : [] }, null, 2));