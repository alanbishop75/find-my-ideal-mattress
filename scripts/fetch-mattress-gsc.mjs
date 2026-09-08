import fs from "node:fs/promises";
import path from "node:path";
import { createRequire } from "node:module";
import { google } from "googleapis";

const require = createRequire(import.meta.url);
const { MATTRESS_PROPERTY, assertMattressProperty } = require("./mattress-seo-policy.cjs");
const { calculateGscWindows } = require("./mattress-seo-windows.cjs");
const root = process.cwd();
const args = process.argv.slice(2);
const option = (name) => args.includes(name) ? args[args.indexOf(name) + 1] : undefined;
const windowName = option("--window") ?? "discovery";
const windows = calculateGscWindows();
const selectedWindow = windows[windowName];
const startDate = option("--start-date") ?? selectedWindow?.startDate;
const endDate = option("--end-date") ?? selectedWindow?.endDate;

if (!selectedWindow && (!option("--start-date") || !option("--end-date"))) throw new Error("Use --window latest|previous|discovery or both --start-date and --end-date.");
if (!/^\d{4}-\d{2}-\d{2}$/.test(startDate) || !/^\d{4}-\d{2}-\d{2}$/.test(endDate) || startDate > endDate) throw new Error("Use valid YYYY-MM-DD start and end dates.");
assertMattressProperty(MATTRESS_PROPERTY);
if (args.includes("--dry-run")) {
  console.log(JSON.stringify({ mode: "dry-run", siteUrl: MATTRESS_PROPERTY, startDate, endDate, dimensions: ["date", "page", "query", "country", "device"], excludedNewestDays: windows.excludedNewestDays }, null, 2));
  process.exit(0);
}

const inline = process.env.GSC_MATTRESS_SERVICE_ACCOUNT_JSON ?? process.env.GSC_SERVICE_ACCOUNT_JSON;
const keyFile = process.env.GSC_MATTRESS_SERVICE_ACCOUNT_KEY_FILE ?? process.env.GSC_SERVICE_ACCOUNT_KEY_FILE;
const configuredEmail = process.env.GSC_MATTRESS_SERVICE_ACCOUNT_EMAIL;
if (!inline && !keyFile) throw new Error(`Missing Mattress GSC credentials. Service account: ${configuredEmail ?? "not available because no credential input is configured"}. Add that service account to ${MATTRESS_PROPERTY} in Search Console Settings > Users and permissions as Full user, then set GSC_MATTRESS_SERVICE_ACCOUNT_JSON or GSC_MATTRESS_SERVICE_ACCOUNT_KEY_FILE and rerun npm run seo:mattress:gsc-fetch.`);
const credentials = inline ? JSON.parse(inline) : JSON.parse(await fs.readFile(path.resolve(root, keyFile), "utf8"));
const serviceAccountEmail = credentials.client_email ?? configuredEmail ?? "unknown";
const auth = new google.auth.GoogleAuth({ credentials, scopes: ["https://www.googleapis.com/auth/webmasters.readonly"] });
const client = google.searchconsole({ version: "v1", auth });
try {
  await client.sites.get({ siteUrl: MATTRESS_PROPERTY });
} catch (error) {
  throw new Error(`Mattress Search Console access check failed for ${serviceAccountEmail} on ${MATTRESS_PROPERTY}. Add this exact account in Search Console Settings > Users and permissions as Full user, then rerun npm run seo:mattress:gsc-fetch. API detail: ${error.message}`);
}
const rows = [];
for (let date = new Date(`${startDate}T00:00:00Z`); date <= new Date(`${endDate}T00:00:00Z`); date.setUTCDate(date.getUTCDate() + 1)) {
  const day = date.toISOString().slice(0, 10);
  const response = await client.searchanalytics.query({ siteUrl: MATTRESS_PROPERTY, requestBody: { startDate: day, endDate: day, dimensions: ["page", "query", "country", "device"], type: "web", rowLimit: 25000 } });
  rows.push(...(response.data.rows ?? []).map((row) => ({ date: day, page: row.keys?.[0] ?? "", query: row.keys?.[1] ?? "", country: row.keys?.[2] ?? "", device: row.keys?.[3] ?? "", clicks: row.clicks ?? 0, impressions: row.impressions ?? 0, ctr: row.ctr ?? 0, averagePosition: row.position ?? 0 })));
}
const snapshot = { schemaVersion: 1, source: "direct-google-search-console", siteUrl: MATTRESS_PROPERTY, fetchedAt: new Date().toISOString(), dateRange: { startDate, endDate, excludedNewestDays: windows.excludedNewestDays }, dimensions: ["date", "page", "query", "country", "device"], rowCount: rows.length, limitations: ["API output is subject to Search Console row limits.", "This raw evidence makes no SEO recommendation."], rows };
const outputDirectory = path.join(root, "seo-results", "gsc", "direct");
await fs.mkdir(outputDirectory, { recursive: true });
const output = path.join(outputDirectory, `mattress-gsc-${startDate}-to-${endDate}.json`);
await fs.writeFile(output, `${JSON.stringify(snapshot, null, 2)}\n`);
await fs.writeFile(path.join(outputDirectory, "latest.json"), `${JSON.stringify(snapshot, null, 2)}\n`);
console.log(JSON.stringify({ mode: "write", siteUrl: MATTRESS_PROPERTY, serviceAccountEmail, rows: snapshot.rowCount, snapshotFile: path.relative(root, output) }, null, 2));