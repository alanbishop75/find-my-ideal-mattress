import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";

const ROOT = process.cwd();
const SEO_RESULTS_DIR = path.join(ROOT, "seo-results");
const EXTRACT_ROOT = path.join(SEO_RESULTS_DIR, ".gsc-extract");

function writeWaitingReport(message) {
  fs.mkdirSync(SEO_RESULTS_DIR, { recursive: true });
  const today = new Date().toISOString().slice(0, 10);
  const reportPath = path.join(SEO_RESULTS_DIR, `seo-priority-report-${today}.md`);
  const latestPath = path.join(SEO_RESULTS_DIR, "seo-priority-report-latest.md");
  const output = [
    "# SEO Priority Report",
    "",
    `Generated: ${new Date().toISOString()}`,
    "",
    "## Status",
    "",
    `- ${message}`,
    "- Waiting for first Google Search Console Performance-on-Search zip in seo-results/.",
    "- Once a zip is added, rerun `npm run seo:gsc-report` and the report will populate automatically.",
    "",
    "## Immediate Next Step",
    "",
    "1. Export Performance report from Google Search Console as a zip and place it in seo-results/.",
  ].join("\n") + "\n";

  fs.writeFileSync(reportPath, output, "utf8");
  fs.writeFileSync(latestPath, output, "utf8");
  console.log(`Generated ${reportPath}`);
  console.log(`Updated ${latestPath}`);
}

function readDirSafe(dirPath) {
  try {
    return fs.readdirSync(dirPath, { withFileTypes: true });
  } catch {
    return [];
  }
}

function parseCsvLine(line) {
  const out = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i += 1) {
    const ch = line[i];
    if (ch === '"') {
      const next = line[i + 1];
      if (inQuotes && next === '"') {
        current += '"';
        i += 1;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }

    if (ch === "," && !inQuotes) {
      out.push(current);
      current = "";
      continue;
    }

    current += ch;
  }

  out.push(current);
  return out;
}

function parseCsv(filePath) {
  const raw = fs.readFileSync(filePath, "utf8").replace(/^\uFEFF/, "");
  const lines = raw
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);

  if (lines.length < 2) return [];
  const headers = parseCsvLine(lines[0]);

  return lines.slice(1).map((line) => {
    const cells = parseCsvLine(line);
    const row = {};
    headers.forEach((h, idx) => {
      row[h] = cells[idx] ?? "";
    });
    return row;
  });
}

function toNum(value) {
  const n = Number(String(value).replace(/,/g, "").trim());
  return Number.isFinite(n) ? n : 0;
}

function toCtr(value) {
  const s = String(value || "").trim();
  if (!s) return 0;
  return s.endsWith("%") ? toNum(s.slice(0, -1)) / 100 : toNum(s);
}

function targetCtr(position) {
  if (position <= 3) return 0.18;
  if (position <= 5) return 0.1;
  if (position <= 10) return 0.05;
  if (position <= 20) return 0.03;
  if (position <= 40) return 0.015;
  return 0.008;
}

function ensureExtracted(zipPath) {
  const base = path.basename(zipPath, path.extname(zipPath));
  const dest = path.join(EXTRACT_ROOT, base);
  fs.mkdirSync(dest, { recursive: true });

  const outputProbe = path.join(dest, "Pages.csv");
  if (fs.existsSync(outputProbe)) return dest;

  const tar = spawnSync("tar", ["-xf", zipPath, "-C", dest], {
    cwd: ROOT,
    stdio: "pipe",
    encoding: "utf8",
  });

  if (tar.status !== 0) {
    throw new Error(
      `Failed to extract ${path.basename(zipPath)} with tar: ${tar.stderr || tar.stdout || "unknown error"}`
    );
  }

  if (!fs.existsSync(outputProbe)) {
    throw new Error(`Extraction succeeded but Pages.csv was not found in ${dest}`);
  }

  return dest;
}

function findLatestGscExport() {
  const files = readDirSafe(SEO_RESULTS_DIR)
    .filter((d) => d.isFile() && d.name.toLowerCase().includes("performance-on-search") && d.name.toLowerCase().endsWith(".zip"))
    .map((d) => {
      const fullPath = path.join(SEO_RESULTS_DIR, d.name);
      return {
        name: d.name,
        fullPath,
        mtimeMs: fs.statSync(fullPath).mtimeMs,
      };
    })
    .sort((a, b) => b.mtimeMs - a.mtimeMs);

  return files[0] ?? null;
}

function fmtPct(n) {
  return `${(n * 100).toFixed(2)}%`;
}

function fmtInt(n) {
  return Math.round(n).toLocaleString("en-GB");
}

function slugFromUrl(url) {
  const parts = String(url).split("/").filter(Boolean);
  return parts[parts.length - 1] ?? "";
}

function run() {
  fs.mkdirSync(SEO_RESULTS_DIR, { recursive: true });

  const latest = findLatestGscExport();
  if (!latest) {
    writeWaitingReport("No Performance-on-Search zip found yet.");
    return;
  }

  const extractedDir = ensureExtracted(latest.fullPath);
  const pages = parseCsv(path.join(extractedDir, "Pages.csv"));
  const queries = parseCsv(path.join(extractedDir, "Queries.csv"));
  const countries = parseCsv(path.join(extractedDir, "Countries.csv"));
  const devices = parseCsv(path.join(extractedDir, "Devices.csv"));
  const filters = parseCsv(path.join(extractedDir, "Filters.csv"));

  const pageRows = pages
    .map((r) => {
      const impressions = toNum(r.Impressions);
      const clicks = toNum(r.Clicks);
      const ctr = toCtr(r.CTR);
      const position = toNum(r.Position);
      const tCtr = targetCtr(position);
      const potentialClicks = Math.max(0, (tCtr - ctr) * impressions);
      const score = potentialClicks + impressions * (position <= 50 ? 0.01 : 0);

      return {
        url: r["Top pages"],
        slug: slugFromUrl(r["Top pages"]),
        impressions,
        clicks,
        ctr,
        position,
        targetCtr: tCtr,
        potentialClicks,
        score,
      };
    })
    .filter((r) => r.impressions >= 20)
    .sort((a, b) => b.score - a.score);

  const queryRows = queries
    .map((r) => {
      const impressions = toNum(r.Impressions);
      const clicks = toNum(r.Clicks);
      const ctr = toCtr(r.CTR);
      const position = toNum(r.Position);
      const tCtr = targetCtr(position);
      const potentialClicks = Math.max(0, (tCtr - ctr) * impressions);

      return {
        query: r["Top queries"],
        impressions,
        clicks,
        ctr,
        position,
        potentialClicks,
      };
    })
    .filter((r) => r.impressions >= 10)
    .sort((a, b) => b.potentialClicks - a.potentialClicks)
    .slice(0, 20);

  const topCountries = countries
    .map((r) => ({
      country: r.Country,
      clicks: toNum(r.Clicks),
      impressions: toNum(r.Impressions),
      ctr: toCtr(r.CTR),
      position: toNum(r.Position),
    }))
    .sort((a, b) => b.impressions - a.impressions)
    .slice(0, 10);

  const topDevices = devices
    .map((r) => ({
      device: r.Device,
      clicks: toNum(r.Clicks),
      impressions: toNum(r.Impressions),
      ctr: toCtr(r.CTR),
      position: toNum(r.Position),
    }))
    .sort((a, b) => b.impressions - a.impressions);

  const totalImpressions = pageRows.reduce((sum, r) => sum + r.impressions, 0);
  const totalClicks = pageRows.reduce((sum, r) => sum + r.clicks, 0);
  const weightedCtr = totalImpressions > 0 ? totalClicks / totalImpressions : 0;

  const today = new Date().toISOString().slice(0, 10);
  const reportPath = path.join(SEO_RESULTS_DIR, `seo-priority-report-${today}.md`);
  const latestPath = path.join(SEO_RESULTS_DIR, "seo-priority-report-latest.md");

  const lines = [];
  lines.push("# SEO Priority Report");
  lines.push("");
  lines.push(`Generated: ${new Date().toISOString()}`);
  lines.push(`Source zip: ${latest.name}`);
  lines.push(`Date filter: ${filters.find((f) => f.Filter === "Date")?.Value ?? "n/a"}`);
  lines.push("");
  lines.push("## Snapshot");
  lines.push("");
  lines.push(`- Pages analysed (impressions >= 20): ${pageRows.length}`);
  lines.push(`- Total impressions (analysed set): ${fmtInt(totalImpressions)}`);
  lines.push(`- Total clicks (analysed set): ${fmtInt(totalClicks)}`);
  lines.push(`- Weighted CTR: ${fmtPct(weightedCtr)}`);
  lines.push("");
  lines.push("## Immediate Page Priorities");
  lines.push("");
  lines.push("| Priority | URL | Impr | Clicks | CTR | Pos | Target CTR | Est. click upside |");
  lines.push("|---|---|---:|---:|---:|---:|---:|---:|");
  pageRows.slice(0, 10).forEach((r, idx) => {
    lines.push(`| ${idx + 1} | ${r.url} | ${fmtInt(r.impressions)} | ${fmtInt(r.clicks)} | ${fmtPct(r.ctr)} | ${r.position.toFixed(2)} | ${fmtPct(r.targetCtr)} | ${fmtInt(r.potentialClicks)} |`);
  });
  lines.push("");
  lines.push("## Query Opportunities (Top 20)");
  lines.push("");
  lines.push("| Query | Impr | Clicks | CTR | Pos | Est. click upside |");
  lines.push("|---|---:|---:|---:|---:|---:|");
  queryRows.forEach((r) => {
    lines.push(`| ${r.query} | ${fmtInt(r.impressions)} | ${fmtInt(r.clicks)} | ${fmtPct(r.ctr)} | ${r.position.toFixed(2)} | ${fmtInt(r.potentialClicks)} |`);
  });
  lines.push("");
  lines.push("## Geo Split (Top 10 by impressions)");
  lines.push("");
  lines.push("| Country | Impr | Clicks | CTR | Pos |");
  lines.push("|---|---:|---:|---:|---:|");
  topCountries.forEach((r) => {
    lines.push(`| ${r.country} | ${fmtInt(r.impressions)} | ${fmtInt(r.clicks)} | ${fmtPct(r.ctr)} | ${r.position.toFixed(2)} |`);
  });
  lines.push("");
  lines.push("## Device Split");
  lines.push("");
  lines.push("| Device | Impr | Clicks | CTR | Pos |");
  lines.push("|---|---:|---:|---:|---:|");
  topDevices.forEach((r) => {
    lines.push(`| ${r.device} | ${fmtInt(r.impressions)} | ${fmtInt(r.clicks)} | ${fmtPct(r.ctr)} | ${r.position.toFixed(2)} |`);
  });
  lines.push("");
  lines.push("## Auto Actions For This Week");
  lines.push("");
  pageRows.slice(0, 5).forEach((r, idx) => {
    lines.push(`${idx + 1}. Prioritise ${r.url}`);
    lines.push(`   - Reason: ${fmtInt(r.impressions)} impressions, ${fmtPct(r.ctr)} CTR, position ${r.position.toFixed(2)}.`);
    lines.push("   - Action: tighten title/meta to match exact high-impression query variants and strengthen in-body links from adjacent intent pages.");
  });

  const output = `${lines.join("\n")}\n`;
  fs.writeFileSync(reportPath, output, "utf8");
  fs.writeFileSync(latestPath, output, "utf8");

  console.log(`Generated ${reportPath}`);
  console.log(`Updated ${latestPath}`);
}

try {
  run();
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
}
