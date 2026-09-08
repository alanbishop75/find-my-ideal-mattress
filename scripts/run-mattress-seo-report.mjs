import fs from "node:fs";
import path from "node:path";
import { calculateGscWindows } from "./mattress-seo-windows.cjs";

const root = process.cwd();
const snapshotPath = path.join(root, "seo-results", "content-snapshot", "mattress.snapshot.json");
if (!fs.existsSync(snapshotPath)) throw new Error("Missing Mattress inventory. Run npm run seo:mattress:inventory first.");
const inventory = JSON.parse(fs.readFileSync(snapshotPath, "utf8"));
const windows = calculateGscWindows();
const missingSitemap = inventory.pages.filter((page) => page.indexable && !page.sitemapPresent);
const pageTypes = Object.groupBy(inventory.pages, (page) => page.pageType);
const directDirectory = path.join(root, "seo-results", "gsc", "direct");
const readSnapshot = (window) => {
  const filePath = path.join(directDirectory, `mattress-gsc-${window.startDate}-to-${window.endDate}.json`);
  return fs.existsSync(filePath) ? JSON.parse(fs.readFileSync(filePath, "utf8")) : null;
};
const latest = readSnapshot(windows.latest);
const previous = readSnapshot(windows.previous);
const discovery = readSnapshot(windows.discovery);
const total = (rows, field) => rows.reduce((sum, row) => sum + (row[field] ?? 0), 0);
const countrySummary = (snapshot, country) => {
  const rows = snapshot?.rows.filter((row) => row.country === country) ?? [];
  const impressions = total(rows, "impressions");
  const clicks = total(rows, "clicks");
  return { clicks, impressions, ctr: impressions ? clicks / impressions : 0, position: impressions ? total(rows.map((row) => ({ value: row.averagePosition * row.impressions })), "value") / impressions : 0 };
};
const pageTotals = (snapshot, country) => Object.entries(Object.groupBy(snapshot?.rows.filter((row) => row.country === country) ?? [], (row) => row.page)).map(([url, rows]) => ({ url, clicks: total(rows, "clicks"), impressions: total(rows, "impressions") }));
const latestUk = countrySummary(latest, "gbr");
const previousUk = countrySummary(previous, "gbr");
const latestUs = countrySummary(latest, "usa");
const previousUs = countrySummary(previous, "usa");
const latestUkPages = pageTotals(latest, "gbr");
const previousUkPages = new Map(pageTotals(previous, "gbr").map((page) => [page.url, page]));
const zeroDataPages = inventory.pages.filter((page) => page.indexable && !latestUkPages.some((total) => total.url === page.url));
const queryOwners = Object.entries(Object.groupBy(latest?.rows.filter((row) => row.country === "gbr") ?? [], (row) => row.query)).map(([query, rows]) => {
  const pages = Object.entries(Object.groupBy(rows, (row) => row.page)).map(([url, pageRows]) => ({ url, impressions: total(pageRows, "impressions") })).sort((first, second) => second.impressions - first.impressions);
  return { query, impressions: total(rows, "impressions"), owner: pages[0]?.url, pages };
}).sort((first, second) => second.impressions - first.impressions);
const overlaps = queryOwners.filter((entry) => entry.pages.length > 1 && entry.impressions >= 10);
const evidenceAvailable = latest && previous && discovery;
const evidenceSummary = evidenceAvailable
  ? `Direct GSC property sc-domain:findyouridealmattress.com; latest ${latest.dateRange.startDate} to ${latest.dateRange.endDate} (${latest.rowCount} rows), previous ${previous.dateRange.startDate} to ${previous.dateRange.endDate} (${previous.rowCount} rows), discovery ${discovery.dateRange.startDate} to ${discovery.dateRange.endDate} (${discovery.rowCount} rows).`
  : `Direct GSC evidence incomplete. Expected dated windows: latest ${windows.latest.startDate} to ${windows.latest.endDate}, previous ${windows.previous.startDate} to ${windows.previous.endDate}, discovery ${windows.discovery.startDate} to ${windows.discovery.endDate}.`;
const report = [
  "# Mattress SEO Agent Report",
  "",
  `Generated: ${new Date().toISOString()}`,
  "",
  "## 1. Inventory Coverage",
  `- ${inventory.pages.length} qualifying pages: ${pageTypes["commercial-hub"]?.length ?? 0} commercial hub, ${pageTypes["buying-guide"]?.length ?? 0} buying guides, ${pageTypes.comparison?.length ?? 0} comparisons, and 0 product reviews.`,
  "- Every configured indexable page is included, including pages without products or observed traffic.",
  "",
  "## 2. Evidence Identity And Freshness",
  `- ${evidenceSummary}`,
  "- Historical Hub exports, if added later, remain an explicitly labelled baseline and do not replace direct property evidence.",
  "",
  "## 3. UK And US Performance",
  evidenceAvailable ? `- UK: ${latestUk.clicks} clicks / ${latestUk.impressions} impressions / ${(latestUk.ctr * 100).toFixed(2)}% CTR / ${latestUk.position.toFixed(1)} position, versus ${previousUk.impressions} impressions and ${previousUk.position.toFixed(1)} in the previous 28 days.` : "- Missing evidence: no direct Mattress property snapshot is present, so UK and US performance cannot be claimed.",
  evidenceAvailable ? `- US: ${latestUs.clicks} clicks / ${latestUs.impressions} impressions / ${(latestUs.ctr * 100).toFixed(2)}% CTR / ${latestUs.position.toFixed(1)} position, versus ${previousUs.impressions} impressions and ${previousUs.position.toFixed(1)}. US evidence is too small for a content action.` : "",
  "",
  "## 4. Page-By-Page Audit",
  ...inventory.pages.map((page) => { const latestPage = latestUkPages.find((entry) => entry.url === page.url); const prior = previousUkPages.get(page.url); return `- ${page.pageType}: ${page.url}; UK impressions ${latestPage?.impressions ?? 0} versus ${prior?.impressions ?? 0}; indexable ${page.indexable}; sitemap ${page.sitemapPresent}; products ${page.productsReferenced.length}; internal links ${page.internalLinksOut.length}; reviewed ${page.lastUpdated ?? "not evidenced"}.`; }),
  "",
  "## 5. Comparison And Product-Review Assessment",
  `- ${pageTypes.comparison?.length ?? 0} configured comparison pages are present; 0 product-review routes are evidenced. Product-review expansion needs direct query/SERP evidence before approval.`,
  "",
  "## 6. SERP And Competitor Findings",
  "- UK side-sleeper SERP sample: retailer/category and editorial-list formats appear alongside Shopping and AI surfaces; visible competitors include Mattressman, Dreams, Expert Reviews, and direct brand ads.",
  "- UK Simba/Emma comparison SERP sample: comparison/review formats appear from Expert Reviews, Sleep Hero, and The Telegraph, with questions about value and product choice. The exact configured Lite model has weaker direct SERP alignment than the broader Simba-versus-Emma query.",
  "",
  "## 7. Technical And Sitemap Findings",
  `- ${missingSitemap.length} qualifying comparison URLs are absent from the current sitemap source: ${missingSitemap.map((page) => page.url).join(", ")}.`,
  "- The sitemap uses a deployment-time timestamp for static and configured pages; this is not a credible page-level modification date and should not be corrected without approval.",
  "",
  "## 8. Internal-Link Findings",
  "- The inventory records rendered link mappings: hub-to-guides, hub-to-comparisons, related-guide clusters, hub navigation, and questionnaire CTAs. This prevents comparison links being omitted from evidence merely because a shared component renders them.",
  "",
  "## 9. Query, Content, And Product Gaps",
  ...queryOwners.slice(0, 12).map((entry) => `- UK query owner: ${entry.query} (${entry.impressions} impressions) -> ${entry.owner}.`),
  ...overlaps.map((entry) => `- Credible overlap: ${entry.query} (${entry.impressions} impressions) is shared by ${entry.pages.map((page) => page.url).join(" and ")}.`),
  `- Zero-data pages in latest UK evidence: ${zeroDataPages.length ? zeroDataPages.map((page) => page.url).join(", ") : "none"}.`,
  "- Product catalogue evidence is UK-led; do not claim US availability, pricing, trials, or delivery terms without verified regional product and affiliate evidence.",
  "",
  "## 10. Five Strongest Opportunities",
  "1. Prepare for approval: add the four existing indexable comparison URLs to the sitemap and use page-level dates only when credible. This removes a concrete discovery gap without changing commercial content.",
  `2. Prepare for approval: separate the “best value mattress” and “best budget mattress” intent between the existing budget and under-500 guides. Both queries are the only material observed overlap (${overlaps.map((entry) => entry.impressions).reduce((sum, value) => sum + value, 0)} impressions); define distinct ownership before editing either page.`,
  `3. Prepare for approval: refresh the UK hybrid guide's above-the-fold decision support for the exact generic hybrid cluster, which delivered ${queryOwners.find((entry) => entry.query === "hybrid mattress")?.impressions ?? 0} impressions and no clicks. Use construction, firmness, heat, and partner-sharing decisions; retain verified claims only.`,
  `4. Prepare for approval: refresh the side-sleeper guide's UK decision support for the ${queryOwners.find((entry) => entry.query === "best mattress for side sleepers")?.impressions ?? 0}-impression query cluster, using clear firmness/body-build and foam/spring/hybrid trade-offs without medical promises.`,
  "5. Prepare for approval: align the existing Simba/Emma comparison's title and opening decision criteria with the broader comparison SERP, but verify model availability and every product claim before wording changes. Do not create a new product-review URL yet.",
  "",
  "## 11. Strongest Eligible Action",
  "- Prepare for approval: correct sitemap discovery for the four already-indexable comparison routes, with credible lastmod handling. This is the strongest action because it affects four commercially focused pages, has direct local and live evidence, and does not rely on low-confidence content inference.",
  "",
  "## 12. Protected And Rejected Actions",
  "- Protect: recommendations, product order, affiliate destinations, and all recently reviewed guide content pending measurement.",
  "- Reject: medical claims about back, hip, or shoulder symptoms; unsupported trial, guarantee, or regional availability claims; cosmetic rewriting without a query or SERP rationale.",
  "",
  "## 13. Exact Approval-Ready Proposal",
  "- In app/sitemap.ts, include each configured mattressComparisonPages route. Remove build-time lastModified values; emit a lastModified value only where a trustworthy page-level date exists. Do not alter visible dates, content, products, recommendation logic, affiliate links, canonicals, redirects, or URLs.",
  "",
  "## 14. Measurement Plan",
  "- Record the implementation date and direct-property baseline before an approved change. Check discovery/indexing preliminarily after 14 days and evaluate performance with complete 28-day windows after 28 and 56 days. Record overlapping releases and do not attribute changes without a comparison.",
].join("\n") + "\n";
const output = path.join(root, "seo-results", "mattress-seo-agent-report-latest.md");
fs.writeFileSync(output, report);
console.log(JSON.stringify({ reportFile: "seo-results/mattress-seo-agent-report-latest.md", inventoryPages: inventory.pages.length, directEvidence: Boolean(evidenceAvailable), strongestAction: "Prepare for approval" }, null, 2));