/* eslint-disable @typescript-eslint/no-require-imports */
const { collectDays, validateSnapshot, buildReport, DIMENSIONS } = require('./mattress-seo-evidence.cjs');
const range = { startDate: '2026-11-01', endDate: '2026-11-01' };
const now = new Date('2026-11-06T12:00:00Z');
const url = 'https://www.findyouridealmattress.com/mattress/test';
const apiRow = (query) => ({ keys: [url, query, 'gbr', 'DESKTOP'], clicks: 0, impressions: 10, ctr: 0, position: 8 });
const snapshot = () => ({ schemaVersion: 2, source: 'direct-google-search-console', siteUrl: 'sc-domain:findyouridealmattress.com', collectionId: '12345678-1234-1234-1234-123456789abc', sourceCommit: 'a'.repeat(40), fetchedAt: now.toISOString(), dateRange: range, dimensions: DIMENSIONS, searchType: 'web', dataState: 'final', rowCount: 0, rows: [], pagination: { complete: true, pageSize: 25000, days: [{ date: range.startDate, rowCount: 0, requests: 1, exhausted: true }] } });
const inventory = { pages: [{ url, indexable: true, sitemapPresent: true, sitemapLastModified: null }] };
const windows = { latest: range, previous: range, discovery: range };

describe('manual GSC evidence boundaries', () => {
  it('requests finalized pages until the short page, preserving offset and daily receipt', async () => {
    const query = jest.fn().mockResolvedValueOnce({ data: { rows: [apiRow('a'), apiRow('b')] } }).mockResolvedValueOnce({ data: { rows: [apiRow('c')] } });
    const result = await collectDays(query, range, 2);
    expect(query.mock.calls.map(([request]) => request.requestBody.startRow)).toEqual([0, 2]);
    expect(query.mock.calls.every(([request]) => request.requestBody.dataState === 'final')).toBe(true);
    expect(result.rows).toHaveLength(3);
    expect(result.pagination.days).toEqual([{ date: range.startDate, rowCount: 3, requests: 2, exhausted: true }]);
  });
  it('makes an empty final request after an exact page boundary', async () => {
    const query = jest.fn().mockResolvedValueOnce({ data: { rows: [apiRow('a'), apiRow('b')] } }).mockResolvedValueOnce({ data: { rows: [] } });
    expect((await collectDays(query, range, 2)).pagination.days[0].requests).toBe(2);
  });
  it('refuses repeated pages, API failures and potential daily cap truncation', async () => {
    const repeated = jest.fn().mockResolvedValue({ data: { rows: [apiRow('a')] } });
    await expect(collectDays(repeated, range, 1)).rejects.toThrow('Duplicate');
    await expect(collectDays(jest.fn().mockRejectedValue(new Error('quota')), range)).rejects.toThrow('quota');
    const capped = jest.fn().mockImplementation(async ({ requestBody }) => ({ data: { rows: Array.from({ length: 25000 }, (_, i) => apiRow(String(i + requestBody.startRow))) } }));
    await expect(collectDays(capped, range)).rejects.toThrow('daily row cap');
  });
  it.each([
    ['property', s => { s.siteUrl = 'sc-domain:other.example'; }],
    ['dimensions', s => { s.dimensions = ['page']; }],
    ['window', s => { s.dateRange = { ...range, startDate: '2026-10-01' }; }],
    ['timestamp', s => { s.fetchedAt = '2026-09-01T00:00:00Z'; }],
    ['collection identity', s => { delete s.collectionId; }],
    ['provenance', s => { delete s.sourceCommit; }],
    ['pagination', s => { s.pagination.complete = false; }],
    ['daily receipt', s => { s.pagination.days = []; }],
    ['row count', s => { s.rowCount = 1; }],
    ['legacy', s => { s.schemaVersion = 1; }],
  ])('withholds incompatible %s evidence', (_, mutate) => {
    const data = snapshot(); mutate(data);
    expect(() => validateSnapshot(data, range, now)).toThrow();
    expect(buildReport(inventory, { latest: data, previous: snapshot(), discovery: snapshot() }, windows, now).evidenceAvailable).toBe(false);
  });
  it('does not turn absent evidence into zero traffic or fabricated opportunities', () => {
    const result = buildReport(inventory, {}, windows, now);
    expect(result.report).toContain('UK latest: UNAVAILABLE');
    expect(result.report).toContain('NOT ASSESSED');
    expect(result.report).not.toMatch(/0 versus 0|Five Strongest|UK side-sleeper SERP sample|Prepare for approval: add the four|sitemap uses a deployment-time timestamp/);
  });
  it('distinguishes an exhausted empty API response from measured total zero', () => {
    const result = buildReport(inventory, { latest: snapshot(), previous: snapshot(), discovery: snapshot() }, windows, now);
    expect(result.evidenceAvailable).toBe(true);
    expect(result.report).toContain('not observed in returned rows (not a zero-traffic claim)');
    expect(result.report).toContain('No missing commercial sitemap URL observed');
  });
  it('reports actual missing sitemap facts only', () => {
    const result = buildReport({ pages: [{ ...inventory.pages[0], sitemapPresent: false }] }, {}, windows, now);
    expect(result.report).toContain(`source sitemap omits ${url}`);
    expect(result.report).not.toContain('No missing commercial sitemap');
  });
});
