import type { MetadataRoute } from 'next';
import { getRequiredSiteUrl } from '../lib/site-url';

export default function robots(): MetadataRoute.Robots {
  const siteUrl = getRequiredSiteUrl();
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin/',
          '/api/',
          '/mattress/questionnaire',
          '/mattress/results',
          '/questionnaire',
          '/results',
        ],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
