import sitemap from './sitemap';
import { mattressComparisonPages } from '../config/mattress/comparison-pages';
import { mattressSeoPages } from '../config/mattress/seo-pages';

describe('Mattress sitemap', () => {
  const siteUrl = 'https://www.findyouridealmattress.com';

  beforeAll(() => {
    process.env.NEXT_PUBLIC_SITE_URL = siteUrl;
  });

  it('includes every configured guide and comparison URL once', () => {
    const entries = sitemap();
    const urls = entries.map((entry) => entry.url);

    expect(new Set(urls).size).toBe(urls.length);
    mattressSeoPages.forEach((page) => expect(urls).toContain(`${siteUrl}/mattress/${page.slug}`));
    mattressComparisonPages.forEach((page) => expect(urls).toContain(`${siteUrl}/mattress/compare/${page.slug}`));
  });

  it('uses only guide-owned review dates and never a build timestamp', () => {
    const entries = sitemap();
    const guideEntries = entries.filter((entry) => entry.url.includes('/mattress/') && !entry.url.includes('/compare/'));
    const comparisonEntries = entries.filter((entry) => entry.url.includes('/mattress/compare/'));
    const staticEntries = entries.filter((entry) => !entry.url.includes('/mattress/'));

    guideEntries.filter((entry) => entry.url !== `${siteUrl}/mattress/best-mattress`).forEach((entry) => expect(entry.lastModified).toEqual(new Date('2026-06-18')));
    expect(guideEntries.find((entry) => entry.url === `${siteUrl}/mattress/best-mattress`)?.lastModified).toBeUndefined();
    comparisonEntries.forEach((entry) => expect(entry.lastModified).toBeUndefined());
    staticEntries.forEach((entry) => expect(entry.lastModified).toBeUndefined());
  });
});