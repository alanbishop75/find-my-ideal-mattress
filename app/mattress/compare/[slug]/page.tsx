import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { products } from "../../../../config/mattress/products";
import { getRegionLinks } from "../../../../config/mattress/buy-links";
import { mattressComparisonPageMap, mattressComparisonPages } from "../../../../config/mattress/comparison-pages";
import { getRequiredSiteUrl } from "../../../../lib/site-url";
import { seoPalette } from "../../../../config/mattress/seo-theme";

type Props = { params: Promise<{ slug: string }> };

const SITE_URL = getRequiredSiteUrl();
const WHITE = seoPalette.white;
const NAVY = seoPalette.navy;
const LIME = seoPalette.lime;
const SOFT_LIME = seoPalette.softLime;
const SURFACE = seoPalette.surface;
const BORDER = seoPalette.border;
const TEXT = seoPalette.text;
const TEXT2 = seoPalette.text2;

export function generateStaticParams() {
  return mattressComparisonPages.map((page) => ({ slug: page.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const page = mattressComparisonPageMap[slug];
  if (!page) return {};
  const ogImage = `${SITE_URL}/opengraph-image`;
  return {
    title: page.metaTitle,
    description: page.metaDescription,
    alternates: { canonical: `/mattress/compare/${slug}` },
    robots: { index: true, follow: true },
    openGraph: {
      title: page.metaTitle,
      description: page.metaDescription,
      url: `${SITE_URL}/mattress/compare/${slug}`,
      type: "article",
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: page.h1,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: page.metaTitle,
      description: page.metaDescription,
      images: [ogImage],
    },
  };
}

export default async function Page({ params }: Props) {
  const { slug } = await params;
  const page = mattressComparisonPageMap[slug];
  if (!page) notFound();

  const left = products.find((product) => product.id === page.leftProductId);
  const right = products.find((product) => product.id === page.rightProductId);
  if (!left || !right) notFound();

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` },
      { "@type": "ListItem", position: 2, name: "Best Mattress", item: `${SITE_URL}/mattress/best-mattress` },
      { "@type": "ListItem", position: 3, name: "Compare", item: `${SITE_URL}/mattress/compare/${slug}` },
    ],
  };

  const faqJsonLd = page.faq?.length
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

  return (
    <div style={{ width: "100%", background: SURFACE }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      {faqJsonLd ? (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      ) : null}
      <section
        style={{
          background: "linear-gradient(135deg, #1a3d2f 0%, #1e4d38 55%, #245c42 100%)",
          color: WHITE,
          padding: "48px 20px 42px",
        }}
      >
        <div style={{ maxWidth: 1120, margin: "0 auto" }}>
          <div style={{ fontSize: 13, opacity: 0.72, marginBottom: 18 }}>
            <Link href="/" style={{ color: "inherit", textDecoration: "none" }}>Home</Link>
            <span style={{ margin: "0 6px" }}>›</span>
            <Link href="/mattress/best-mattress" style={{ color: "inherit", textDecoration: "none" }}>Best Mattress</Link>
            <span style={{ margin: "0 6px" }}>›</span>
            <span>Compare</span>
          </div>

          <h1 style={{ margin: "0 0 12px", fontSize: "clamp(30px, 5vw, 46px)", lineHeight: 1.1, letterSpacing: -0.6 }}>
            {page.h1}
          </h1>
          <p style={{ margin: 0, maxWidth: 820, color: "rgba(255,255,255,0.82)", fontSize: 17, lineHeight: 1.6 }}>
            {page.intro}
          </p>
        </div>
      </section>

      <main style={{ maxWidth: 1120, margin: "0 auto", padding: "24px 20px 64px" }}>
        <section
          style={{
            background: WHITE,
            borderTop: `1px solid ${BORDER}`,
            borderRight: `1px solid ${BORDER}`,
            borderBottom: `1px solid ${BORDER}`,
            borderLeft: `4px solid ${SOFT_LIME}`,
            borderRadius: 14,
            padding: "22px 24px",
          }}
        >
          <h2 style={{ margin: "0 0 10px", fontSize: 24, color: NAVY }}>What people usually want to know</h2>
          <p style={{ margin: 0, color: TEXT2, lineHeight: 1.7 }}>
            Search intent for this page is direct comparison: one mattress against another. The goal is to make the choice obvious on support, feel, and fit.
          </p>
        </section>

        <section
          style={{
            marginTop: 16,
            background: WHITE,
            borderTop: `1px solid ${BORDER}`,
            borderRight: `1px solid ${BORDER}`,
            borderBottom: `1px solid ${BORDER}`,
            borderLeft: `4px solid ${SOFT_LIME}`,
            borderRadius: 14,
            padding: "22px 24px",
          }}
        >
          <h2 style={{ margin: "0 0 10px", fontSize: 24, color: NAVY }}>Key differences</h2>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 640 }}>
              <thead>
                <tr>
                  <th style={{ textAlign: "left", padding: "12px 10px", color: NAVY, borderBottom: `1px solid ${BORDER}` }}>Comparison</th>
                  <th style={{ textAlign: "left", padding: "12px 10px", color: NAVY, borderBottom: `1px solid ${BORDER}` }}>{left.brand} {left.name}</th>
                  <th style={{ textAlign: "left", padding: "12px 10px", color: NAVY, borderBottom: `1px solid ${BORDER}` }}>{right.brand} {right.name}</th>
                </tr>
              </thead>
              <tbody>
                {page.keyPoints.map((point) => (
                  <tr key={point.label}>
                    <td style={{ padding: "12px 10px", borderBottom: `1px solid ${BORDER}`, color: NAVY, fontWeight: 800 }}>{point.label}</td>
                    <td style={{ padding: "12px 10px", borderBottom: `1px solid ${BORDER}`, color: TEXT2, lineHeight: 1.6 }}>{point.left}</td>
                    <td style={{ padding: "12px 10px", borderBottom: `1px solid ${BORDER}`, color: TEXT2, lineHeight: 1.6 }}>{point.right}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section
          style={{
            marginTop: 16,
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))",
            gap: 12,
          }}
        >
          {[left, right].map((product) => {
            const ukLinks = getRegionLinks(product.id, "UK");
            const usLinks = getRegionLinks(product.id, "US");
            return (
              <article
                key={product.id}
                style={{
                  background: WHITE,
                  borderTop: `1px solid ${BORDER}`,
                  borderRight: `1px solid ${BORDER}`,
                  borderBottom: `1px solid ${BORDER}`,
                  borderLeft: `4px solid ${SOFT_LIME}`,
                  borderRadius: 14,
                  padding: "18px 18px 16px",
                  display: "flex",
                  flexDirection: "column",
                  gap: 14,
                }}
              >
                <div style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
                  <Image src={product.imageUrl} alt={`${product.brand} ${product.name}`} width={104} height={104} style={{ borderRadius: 14, objectFit: "cover" }} />
                  <div>
                    <p style={{ margin: "0 0 4px", color: NAVY, fontSize: 11, fontWeight: 800, letterSpacing: 0.4, textTransform: "uppercase" }}>
                      {product.brand}
                    </p>
                    <h3 style={{ margin: "0 0 8px", color: NAVY, fontSize: 22, lineHeight: 1.2 }}>{product.name}</h3>
                    <p style={{ margin: 0, color: TEXT2, lineHeight: 1.7 }}>{product.description}</p>
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 10 }}>
                  <div style={{ background: "#f1f8f3", border: `1px solid ${BORDER}`, borderRadius: 12, padding: 12 }}>
                    <p style={{ margin: "0 0 6px", color: NAVY, fontSize: 11, fontWeight: 800, letterSpacing: 0.4, textTransform: "uppercase" }}>Fit signals</p>
                    <p style={{ margin: 0, color: TEXT2, lineHeight: 1.6 }}>Firmness {String(product.attributes.firmness ?? "-")}, {String(product.attributes.construction ?? "-")}, cooling {product.attributes.cooling ? "yes" : "no"}, {String(product.attributes.priceTier ?? "-")} tier</p>
                  </div>
                  <div style={{ background: "#f1f8f3", border: `1px solid ${BORDER}`, borderRadius: 12, padding: 12 }}>
                    <p style={{ margin: "0 0 6px", color: NAVY, fontSize: 11, fontWeight: 800, letterSpacing: 0.4, textTransform: "uppercase" }}>Quick verdict</p>
                    <p style={{ margin: 0, color: TEXT2, lineHeight: 1.6 }}>{product.id === page.leftProductId ? page.keyPoints[0].left : page.keyPoints[0].right}</p>
                  </div>
                </div>

                <div>
                  <p style={{ margin: "0 0 8px", color: NAVY, fontSize: 12, fontWeight: 800, letterSpacing: 0.4, textTransform: "uppercase" }}>Buy in the UK</p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                    {ukLinks.map((link) => (
                      <a
                        key={`${product.id}-uk-${link.retailerKey}`}
                        href={link.url}
                        target="_blank"
                        rel="noreferrer"
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          justifyContent: "center",
                          padding: "9px 12px",
                          borderRadius: 999,
                          border: `1px solid ${BORDER}`,
                          color: NAVY,
                          textDecoration: "none",
                          fontWeight: 700,
                          fontSize: 13,
                          background: "#ffffff",
                        }}
                      >
                        {link.retailerName}
                      </a>
                    ))}
                  </div>
                </div>

                <div>
                  <p style={{ margin: "0 0 8px", color: NAVY, fontSize: 12, fontWeight: 800, letterSpacing: 0.4, textTransform: "uppercase" }}>Buy in the US</p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                    {usLinks.map((link) => (
                      <a
                        key={`${product.id}-us-${link.retailerKey}`}
                        href={link.url}
                        target="_blank"
                        rel="noreferrer"
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          justifyContent: "center",
                          padding: "9px 12px",
                          borderRadius: 999,
                          border: `1px solid ${BORDER}`,
                          color: NAVY,
                          textDecoration: "none",
                          fontWeight: 700,
                          fontSize: 13,
                          background: "#ffffff",
                        }}
                      >
                        {link.retailerName}
                      </a>
                    ))}
                  </div>
                </div>
              </article>
            );
          })}
        </section>

        <section
          style={{
            marginTop: 16,
            background: WHITE,
            borderTop: `1px solid ${BORDER}`,
            borderRight: `1px solid ${BORDER}`,
            borderBottom: `1px solid ${BORDER}`,
            borderLeft: `4px solid ${SOFT_LIME}`,
            borderRadius: 14,
            padding: "20px 22px",
          }}
        >
          <h2 style={{ margin: "0 0 8px", fontSize: 22, color: NAVY }}>Bottom line</h2>
          <p style={{ margin: 0, color: TEXT2, lineHeight: 1.7 }}>{page.verdict}</p>
        </section>

        {page.faq?.length ? (
          <section
            style={{
              marginTop: 16,
              background: WHITE,
              borderTop: `1px solid ${BORDER}`,
              borderRight: `1px solid ${BORDER}`,
              borderBottom: `1px solid ${BORDER}`,
              borderLeft: `4px solid ${SOFT_LIME}`,
              borderRadius: 14,
              padding: "20px 22px",
            }}
          >
            <h2 style={{ margin: "0 0 14px", fontSize: 22, color: NAVY }}>Dormeo vs Simba FAQs</h2>
            <div style={{ display: "grid", gap: 16 }}>
              {page.faq.map((item) => (
                <div key={item.question}>
                  <h3 style={{ margin: "0 0 6px", color: NAVY, fontSize: 18 }}>{item.question}</h3>
                  <p style={{ margin: 0, color: TEXT2, lineHeight: 1.7 }}>{item.answer}</p>
                </div>
              ))}
            </div>
          </section>
        ) : null}
      </main>
    </div>
  );
}
