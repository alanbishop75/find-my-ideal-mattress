"use client";

import { RegionViewBanner } from "../../components/RegionViewBanner";
import { useRegion } from "../../core/geo/RegionContext";

export default function ContactPageClient() {
  const { region } = useRegion();

  const regionalSupportNote = region === "US"
    ? "US support tip: when reporting price or availability issues, include your state and the retailer."
    : "UK support tip: when reporting price or availability issues, include your postcode area and the retailer.";

  return (
    <div style={{ maxWidth: 720, margin: "0 auto", padding: "40px 20px", lineHeight: 1.8 }}>
      <RegionViewBanner audience="content" />

      <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 16 }}>Contact Us</h1>
      <p style={{ fontSize: 17 }}>
        We&apos;d love to hear from you - whether you have a question about a recommendation,
        spotted a product error, or just want to say hello.
      </p>

      <h2 style={{ fontSize: 20, fontWeight: 600, marginTop: 32, marginBottom: 8 }}>Email</h2>
      <p>
        The best way to reach us is by email: {" "}
        <a href="mailto:hello@findmyidealmattress.com" style={{ fontWeight: 600 }}>
          hello@findmyidealmattress.com
        </a>
      </p>
      <p>We aim to respond within 2 business days.</p>

      <h2 style={{ fontSize: 20, fontWeight: 600, marginTop: 32, marginBottom: 8 }}>What to include</h2>
      <ul>
        <li>A brief description of your question or issue</li>
        <li>If reporting a product error: the product name and what you believe is incorrect</li>
        <li>If reporting a broken link: the product and which retailer link is affected</li>
        <li>{regionalSupportNote}</li>
      </ul>
    </div>
  );
}
