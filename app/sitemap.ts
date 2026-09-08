import type { MetadataRoute } from 'next';
import { mattressComparisonPages } from '../config/mattress/comparison-pages';
import { mattressSeoPages } from '../config/mattress/seo-pages';
import { getRequiredSiteUrl } from '../lib/site-url';

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = getRequiredSiteUrl();
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: `${siteUrl}/`,
      changeFrequency: 'monthly',
      priority: 1,
    },
    {
      url: `${siteUrl}/mattress/best-mattress`,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${siteUrl}/about`,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${siteUrl}/affiliate-disclosure`,
      changeFrequency: 'yearly',
      priority: 0.2,
    },
    {
      url: `${siteUrl}/privacy-policy`,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${siteUrl}/terms`,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${siteUrl}/contact`,
      changeFrequency: 'yearly',
      priority: 0.4,
    },
    {
      url: `${siteUrl}/faq`,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
  ];

  const seoLandingPages: MetadataRoute.Sitemap = mattressSeoPages.map((page) => ({
    url: `${siteUrl}/mattress/${page.slug}`,
    lastModified: new Date(page.lastReviewed),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }));

  const comparisonPages: MetadataRoute.Sitemap = mattressComparisonPages.map((page) => ({
    url: `${siteUrl}/mattress/compare/${page.slug}`,
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  return [...staticPages, ...seoLandingPages, ...comparisonPages];
}
