import type { MetadataRoute } from 'next';
import { mattressSeoPages } from '../config/mattress/seo-pages';

const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.findyouridealmattress.com').replace(/\/$/, '');
const SITE_CHROME_LAST_MODIFIED = new Date('2026-06-19');

function latestDate(dateA: Date, dateB: Date): Date {
  return dateA > dateB ? dateA : dateB;
}

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: `${SITE_URL}/`,
      lastModified: SITE_CHROME_LAST_MODIFIED,
      changeFrequency: 'monthly',
      priority: 1,
    },
    {
      url: `${SITE_URL}/mattress/best-mattress`,
      lastModified: SITE_CHROME_LAST_MODIFIED,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/about`,
      lastModified: SITE_CHROME_LAST_MODIFIED,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${SITE_URL}/affiliate-disclosure`,
      lastModified: SITE_CHROME_LAST_MODIFIED,
      changeFrequency: 'yearly',
      priority: 0.2,
    },
    {
      url: `${SITE_URL}/privacy-policy`,
      lastModified: SITE_CHROME_LAST_MODIFIED,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${SITE_URL}/terms`,
      lastModified: SITE_CHROME_LAST_MODIFIED,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${SITE_URL}/contact`,
      lastModified: SITE_CHROME_LAST_MODIFIED,
      changeFrequency: 'yearly',
      priority: 0.4,
    },
    {
      url: `${SITE_URL}/faq`,
      lastModified: SITE_CHROME_LAST_MODIFIED,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
  ];

  const seoLandingPages: MetadataRoute.Sitemap = mattressSeoPages.map((page) => ({
    url: `${SITE_URL}/mattress/${page.slug}`,
    lastModified: latestDate(new Date(page.lastReviewed), SITE_CHROME_LAST_MODIFIED),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }));

  return [...staticPages, ...seoLandingPages];
}
