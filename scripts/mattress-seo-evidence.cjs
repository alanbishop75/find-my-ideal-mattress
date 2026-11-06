/* eslint-disable @typescript-eslint/no-require-imports -- CommonJS helpers are shared by Jest and ESM command entry points. */
const { MATTRESS_PROPERTY } = require('./mattress-seo-policy.cjs');
const DIMENSIONS = ['date', 'page', 'query', 'country', 'device'];
const DAY_MS = 86400000;
const API_DAILY_LIMIT = 50000;

function datesInRange(range) {
  const dates = [];
  const start = Date.parse(`${range.startDate}T00:00:00Z`);
  const end = Date.parse(`${range.endDate}T00:00:00Z`);
  if (!Number.isFinite(start) || !Number.isFinite(end) || start > end || end - start > 366 * DAY_MS) throw new Error('Invalid evidence date range');
  for (let time = start; time <= end; time += DAY_MS) dates.push(new Date(time).toISOString().slice(0, 10));
  if (dates[0] !== range.startDate || dates.at(-1) !== range.endDate) throw new Error('Invalid calendar date');
  return dates;
}

// Pagination exhausts the API result, not anonymised queries or data beyond Google's cap.
async function collectDays(query, range, pageSize = 25000) {
  if (!Number.isInteger(pageSize) || pageSize < 1 || pageSize > 25000) throw new Error('Invalid page size');
  const rows = [];
  const days = [];
  for (const date of datesInRange(range)) {
    let startRow = 0;
    let requests = 0;
    const seen = new Set();
    while (true) {
      const response = await query({ siteUrl: MATTRESS_PROPERTY, requestBody: {
        startDate: date, endDate: date, dimensions: DIMENSIONS.slice(1),
        type: 'web', dataState: 'final', rowLimit: pageSize, startRow,
      } });
      const batch = response.data.rows ?? [];
      requests += 1;
      if (!Array.isArray(batch) || batch.length > pageSize) throw new Error('Malformed API page');
      for (const row of batch) {
        if (!Array.isArray(row.keys) || row.keys.length !== 4) throw new Error('Malformed API dimensions');
        const key = JSON.stringify(row.keys);
        if (seen.has(key)) throw new Error('Duplicate API row or repeated pagination page');
        seen.add(key);
        rows.push({ date, page: row.keys[0], query: row.keys[1], country: row.keys[2], device: row.keys[3],
          clicks: row.clicks, impressions: row.impressions, ctr: row.ctr, averagePosition: row.position });
      }
      startRow += batch.length;
      if (startRow >= API_DAILY_LIMIT) throw new Error(`API daily row cap may truncate ${date}; evidence withheld`);
      if (batch.length < pageSize) break;
    }
    days.push({ date, rowCount: startRow, requests, exhausted: true });
  }
  return { rows, pagination: { complete: true, pageSize, days } };
}

function validateSnapshot(snapshot, range, now = new Date()) {
  if (!snapshot || snapshot.schemaVersion !== 2 || snapshot.source !== 'direct-google-search-console' || snapshot.siteUrl !== MATTRESS_PROPERTY) throw new Error('Wrong or legacy evidence identity');
  if (JSON.stringify(snapshot.dimensions) !== JSON.stringify(DIMENSIONS) || snapshot.searchType !== 'web' || snapshot.dataState !== 'final') throw new Error('Incompatible evidence dimensions');
  if (snapshot.dateRange?.startDate !== range.startDate || snapshot.dateRange?.endDate !== range.endDate) throw new Error('Stale or incompatible evidence window');
  const fetched = Date.parse(snapshot.fetchedAt);
  if (!Number.isFinite(fetched) || fetched > now.getTime() + 300000 || now.getTime() - fetched > 7 * DAY_MS) throw new Error('Invalid or stale fetch time');
  if (!/^[a-f0-9-]{36}$/.test(snapshot.collectionId ?? '')) throw new Error('Missing collection run identity');
  if (range.endDate > new Date(now.getTime() - 3 * DAY_MS).toISOString().slice(0, 10)) throw new Error('Evidence window is not settled');
  if (!/^[a-f0-9]{40}$/.test(snapshot.sourceCommit ?? '')) throw new Error('Missing source commit provenance');
  if (!Array.isArray(snapshot.rows) || snapshot.rowCount !== snapshot.rows.length) throw new Error('Evidence row count mismatch');
  const dates = datesInRange(range);
  const pagination = snapshot.pagination;
  if (pagination?.complete !== true || !Number.isInteger(pagination.pageSize) || pagination.pageSize < 1 || pagination.pageSize > 25000 || !Array.isArray(pagination.days) || pagination.days.length !== dates.length) throw new Error('Incomplete pagination');
  const counts = new Map(dates.map(date => [date, 0]));
  const seen = new Set();
  for (const row of snapshot.rows) {
    if (!counts.has(row.date) || !DIMENSIONS.slice(1).every(field => typeof row[field] === 'string' && row[field].length)) throw new Error('Invalid evidence row identity');
    if (!['clicks', 'impressions', 'ctr', 'averagePosition'].every(field => Number.isFinite(row[field]) && row[field] >= 0) || row.clicks > row.impressions || row.ctr > 1) throw new Error('Invalid evidence metrics');
    const pageUrl = new URL(row.page);
    if (!['http:', 'https:'].includes(pageUrl.protocol) || !['findyouridealmattress.com', 'www.findyouridealmattress.com'].includes(pageUrl.hostname)) throw new Error('Cross-property page row');
    const key = JSON.stringify(DIMENSIONS.map(field => row[field]));
    if (seen.has(key)) throw new Error('Duplicate evidence row');
    seen.add(key);
    counts.set(row.date, counts.get(row.date) + 1);
  }
  dates.forEach((date, index) => {
    const day = pagination.days[index];
    if (day.date !== date || day.exhausted !== true || day.rowCount !== counts.get(date) || day.rowCount >= API_DAILY_LIMIT || day.requests !== Math.floor(day.rowCount / pagination.pageSize) + 1) throw new Error('Incomplete daily evidence');
  });
  return snapshot;
}

function buildReport(inventory, snapshots, windows, now = new Date()) {
  const evidence = {};
  const unavailable = [];
  for (const name of ['latest', 'previous', 'discovery']) {
    try { evidence[name] = validateSnapshot(snapshots[name], windows[name], now); }
    catch (error) { unavailable.push(`${name}: ${error.message}`); }
  }
  const available = unavailable.length === 0;
  const missing = inventory.pages.filter(page => page.indexable && page.sitemapPresent === false);
  const observed = (snapshot, url, country) => {
    const rows = snapshot.rows.filter(row => row.page === url && row.country === country);
    return rows.length ? `${rows.reduce((sum, row) => sum + row.impressions, 0)} impressions in returned rows` : 'not observed in returned rows (not a zero-traffic claim)';
  };
  const lines = ['# Mattress SEO evidence review', '', `Generated: ${now.toISOString()}`, '',
    '## Coverage and technical facts', `${inventory.pages.length} source-discovered commercial pages. Sitemap evaluated from current app/sitemap.ts; live index status is NOT ASSESSED.`,
    'Sitemap dates are recorded as emitted; a credible page-level modification date requires page-owned evidence.',
    ...inventory.pages.map(page => `- ${page.url}; sitemap ${page.sitemapPresent}; lastmod ${page.sitemapLastModified ?? 'omitted'}; links: source-derived, not browser-verified.`),
    '', '## Search evidence', ...unavailable.map(reason => `- UNAVAILABLE: ${reason}`),
    'Google API query rows exclude anonymised queries and can omit data. Pagination is not proof of complete site traffic.',
    ...Object.entries(evidence).map(([name, item]) => `- ${name}: ${item.siteUrl}; ${item.dateRange.startDate} to ${item.dateRange.endDate}; ${item.rowCount} returned rows; fetched ${item.fetchedAt}; collector commit ${item.sourceCommit}.`),
    '', '## Page observations',
    ...inventory.pages.map(page => `- ${page.url}; UK latest: ${available ? observed(evidence.latest, page.url, 'gbr') : 'UNAVAILABLE'}; previous: ${available ? observed(evidence.previous, page.url, 'gbr') : 'UNAVAILABLE'}; US latest: ${available ? observed(evidence.latest, page.url, 'usa') : 'UNAVAILABLE'}.`),
    '', '## SERPs and competitors', 'NOT ASSESSED: no current sourced SERP observations were supplied. No competitor or ranking claim is inferred.',
    '', '## Supported next actions',
    ...missing.map(page => `- VERIFY: source sitemap omits ${page.url}; confirm intended indexability before preparing a change.`),
    ...(missing.length ? [] : ['- No missing commercial sitemap URL observed in the current source. Do not repeat a completed sitemap fix.']),
    ...(available ? ['- Validated returned-row evidence is available for a bounded specialist review. No content change is inferred automatically.'] : ['- Obtain validated current same-property shared evidence; use manual retrieval only for a documented missing slice. No performance-based edit is supported.']),
    '- Use the shared Hub queue; no mandatory opportunity count, new recurring collector or automatic edits.',
    '- Preserve recommendations, affiliate destinations and protected experiments. Record baseline and settled 14/28/56-day outcomes after an approved release.', ''];
  return { report: lines.join('\n'), evidenceAvailable: available, unavailable };
}

module.exports = { DIMENSIONS, collectDays, validateSnapshot, datesInRange, buildReport };
