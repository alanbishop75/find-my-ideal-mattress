"use client";

import { Header } from "../../components/Header";
import { RegionViewBanner } from "../../components/RegionViewBanner";
import { useRegion } from "../../core/geo/RegionContext";

export default function TermsPageClient() {
  const { region } = useRegion();
  const amazonDisclosure = region === "UK"
    ? "As an Amazon Associate, we earn from qualifying purchases on eligible Amazon UK links."
    : null;

  return (
    <>
      <Header />
      <div style={{ maxWidth: 720, margin: "0 auto", padding: "40px 20px", lineHeight: 1.8 }}>
      <RegionViewBanner audience="legal" />

      <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 8 }}>Terms of Use</h1>
      <p style={{ color: "#666", marginBottom: 32, fontSize: 14 }}>Last updated: April 2026</p>

      <p>
        These terms explain how you may use the site and what to expect when using our recommendations and retailer links.
      </p>

      <h2 style={{ fontSize: 20, fontWeight: 600, marginTop: 32, marginBottom: 8 }}>1. About this service</h2>
      <p>
        FindMyIdealMattress provides a free mattress recommendation tool at <strong>findmyidealmattress.com</strong> based
        on self-reported quiz inputs.
      </p>

      <h2 style={{ fontSize: 20, fontWeight: 600, marginTop: 32, marginBottom: 8 }}>2. Informational recommendations</h2>
      <p>
        Recommendations are informational only and do not guarantee performance outcomes. Always verify fit, price, and
        availability with the retailer.
      </p>

      <h2 style={{ fontSize: 20, fontWeight: 600, marginTop: 32, marginBottom: 8 }}>3. Affiliate links and retailer terms</h2>
      <p>
        Some links are affiliate links. We may earn a commission on qualifying purchases at no extra cost to you.
        Third-party retailer terms and policies apply on their sites.
      </p>
      {amazonDisclosure ? <p>{amazonDisclosure}</p> : null}

      <h2 style={{ fontSize: 20, fontWeight: 600, marginTop: 32, marginBottom: 8 }}>4. Regional legal notices</h2>
      <div style={{ border: "1px solid #e5e7eb", borderRadius: 10, padding: "14px 16px", background: region === "US" ? "#f0f9ff" : "#fff" }}>
        <h3 style={{ marginTop: 0, marginBottom: 8 }}>US notice</h3>
        <p style={{ margin: 0 }}>
          For US users, these terms are intended to be interpreted under applicable US law and consumer protections.
        </p>
      </div>

      <div style={{ border: "1px solid #e5e7eb", borderRadius: 10, padding: "14px 16px", marginTop: 12, background: region === "UK" ? "#f0fdf4" : "#fff" }}>
        <h3 style={{ marginTop: 0, marginBottom: 8 }}>UK notice</h3>
        <p style={{ margin: 0 }}>
          For UK users, these terms are intended to be interpreted under UK consumer law principles.
        </p>
      </div>

      <h2 style={{ fontSize: 20, fontWeight: 600, marginTop: 32, marginBottom: 8 }}>5. Limitation of liability</h2>
      <p>
        To the fullest extent permitted by law, we are not liable for losses arising from use of this tool, reliance on
        recommendations, or purchases made through external retailer links.
      </p>

      <h2 style={{ fontSize: 20, fontWeight: 600, marginTop: 32, marginBottom: 8 }}>6. Contact</h2>
      <p>
        Questions? Email <a href="mailto:hello@findmyidealmattress.com">hello@findmyidealmattress.com</a>.
      </p>
    </div>
    </>
  );
}
