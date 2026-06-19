import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Affiliate Disclosure | FindYourIdealMattress",
  description:
    "How affiliate links work on FindYourIdealMattress, including Amazon Associates participation and editorial independence.",
  alternates: {
    canonical: "/affiliate-disclosure",
  },
};

export default function AffiliateDisclosurePage() {
  return (
    <main style={{ maxWidth: 860, margin: "0 auto", padding: "32px 20px 48px", lineHeight: 1.75 }}>
      <h1 style={{ fontSize: 32, marginBottom: 12 }}>Affiliate Disclosure</h1>
      <p style={{ marginTop: 0, color: "#555" }}>
        Last updated: 18 June 2026
      </p>

      <p>
        Some links on this website are affiliate links. If you click one of these links and buy a product, we may
        earn a commission at no extra cost to you.
      </p>

      <h2 style={{ fontSize: 22, marginTop: 28 }}>Amazon Associates</h2>
      <p>
        FindYourIdealMattress participates in the Amazon Services LLC Associates Program and the Amazon UK
        Associates Program. These programs are designed to provide a means for sites to earn advertising fees by
        advertising and linking to Amazon properties.
      </p>

      <h2 style={{ fontSize: 22, marginTop: 28 }}>Editorial Independence</h2>
      <p>
        Affiliate partnerships do not control our scoring logic or product recommendations. Recommendations are based
        on the fit factors in your quiz answers, the mattress catalogue, and the selection rules we publish for each
        product category.
      </p>

      <h2 style={{ fontSize: 22, marginTop: 28 }}>Price And Availability</h2>
      <p>
        Retailers set final pricing, stock, shipping, and return terms. These can change at any time, so always verify
        the current price and availability on the retailer page before you buy.
      </p>

      <h2 style={{ fontSize: 22, marginTop: 28 }}>Contact</h2>
      <p>
        Questions about this disclosure can be sent via our contact page.
      </p>
    </main>
  );
}