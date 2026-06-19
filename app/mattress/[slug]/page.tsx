import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import { mattressSeoPages, mattressSeoPageMap } from "../../../config/mattress/seo-pages";
import MattressSeoLandingPage from "./MattressSeoLandingPage";

type Props = { params: Promise<{ slug: string }> };

const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.findmyidealmattress.com").replace(/\/$/, "");

const LEGACY_UK_SLUG_REDIRECTS: Record<string, string> = {
  "best-mattress-for-side-sleepers-uk": "best-mattress-for-side-sleepers",
  "best-mattress-for-back-pain-uk": "best-mattress-for-back-pain",
  "best-mattress-for-heavy-people-uk": "best-mattress-for-heavy-people",
  "best-mattress-for-couples-uk": "best-mattress-for-couples",
  "best-cooling-mattress-uk": "best-cooling-mattress",
  "best-hybrid-mattress-uk": "best-hybrid-mattress",
  "best-budget-mattress-uk": "best-budget-mattress",
  "best-mattress-under-500-uk": "best-mattress-under-500",
};

export function generateStaticParams() {
  return mattressSeoPages.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  if (LEGACY_UK_SLUG_REDIRECTS[slug]) return {};
  const page = mattressSeoPageMap[slug];
  if (!page) return {};
  return {
    title: page.metaTitle,
    description: page.metaDescription,
    alternates: { canonical: `/mattress/${slug}` },
    robots: { index: true, follow: true },
    openGraph: {
      title: page.metaTitle,
      description: page.metaDescription,
      url: `${SITE_URL}/mattress/${slug}`,
      type: "article",
    },
  };
}

export default async function Page({ params }: Props) {
  const { slug } = await params;
  const redirectedSlug = LEGACY_UK_SLUG_REDIRECTS[slug];
  if (redirectedSlug) {
    permanentRedirect(`/mattress/${redirectedSlug}`);
  }
  const page = mattressSeoPageMap[slug];
  if (!page) notFound();

  const pageUrl = `${SITE_URL}/mattress/${slug}`;

  const faqJsonLd =
    page.faq && page.faq.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: page.faq.map((item) => ({
            "@type": "Question",
            name: item.question,
            acceptedAnswer: {
              "@type": "Answer",
              text: item.answer,
            },
          })),
        }
      : null;

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` },
      { "@type": "ListItem", position: 2, name: "Mattress finder", item: `${SITE_URL}/mattress/questionnaire` },
      { "@type": "ListItem", position: 3, name: page.keyword, item: pageUrl },
    ],
  };

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: page.h1,
    description: page.metaDescription,
    inLanguage: "en",
    mainEntityOfPage: pageUrl,
    dateModified: `${page.lastReviewed}T00:00:00Z`,
    datePublished: `${page.lastReviewed}T00:00:00Z`,
    image: [
      {
        "@type": "ImageObject",
        url: `${SITE_URL}/opengraph-image`,
        width: 1200,
        height: 630,
      },
    ],
    author: { "@type": "Organization", name: "FindMyIdealMattress", url: SITE_URL },
    publisher: {
      "@type": "Organization",
      name: "FindMyIdealMattress",
      url: SITE_URL,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      {faqJsonLd ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />
      ) : null}
      <MattressSeoLandingPage page={page} />
    </>
  );
}
