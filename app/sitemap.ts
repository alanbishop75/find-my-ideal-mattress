import type { MetadataRoute } from 'next';
import { mattressSeoPages } from '../config/mattress/seo-pages';
import { getRequiredSiteUrl } from '../lib/site-url';

const SITE_URL = getRequiredSiteUrl();
const GENERATED_AT = new Date();

function latestDate(dateA: Date, dateB: Date): Date {
  return dateA > dateB ? dateA : dateB;
}

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: `${SITE_URL}/`,
      lastModified: GENERATED_AT,
      changeFrequency: 'monthly',
      priority: 1,
    },
    {
      url: `${SITE_URL}/mattress/best-mattress`,
      lastModified: GENERATED_AT,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/about`,
      lastModified: GENERATED_AT,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${SITE_URL}/affiliate-disclosure`,
      lastModified: GENERATED_AT,
      changeFrequency: 'yearly',
      priority: 0.2,
    },
    {
      url: `${SITE_URL}/privacy-policy`,
      lastModified: GENERATED_AT,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${SITE_URL}/terms`,
      lastModified: GENERATED_AT,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${SITE_URL}/contact`,
      lastModified: GENERATED_AT,
      changeFrequency: 'yearly',
      priority: 0.4,
    },
    {
      url: `${SITE_URL}/faq`,
      lastModified: GENERATED_AT,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
  ];

  const seoLandingPages: MetadataRoute.Sitemap = mattressSeoPages.map((page) => ({
    url: `${SITE_URL}/mattress/${page.slug}`,
    lastModified: latestDate(new Date(page.lastReviewed), GENERATED_AT),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }));

  return [...staticPages, ...seoLandingPages];
}
