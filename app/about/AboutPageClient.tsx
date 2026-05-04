"use client";

import { Header } from "../../components/Header";
import { RegionViewBanner } from "../../components/RegionViewBanner";
import { useRegion } from "../../core/geo/RegionContext";

export default function AboutPageClient() {
  const { region } = useRegion();
  const intro = region === "US"
    ? "FindYourIdealMattress is a free tool that helps you find the right mattress for how you sleep - no sign-up, no ads, and no pop-ups."
    : "FindYourIdealMattress is a free tool that matches you with the right mattress for how you sleep - no sign-up, no ads, and no pop-ups.";
  const amazonDisclosure = region === "UK"
    ? "As an Amazon Associate, we earn from qualifying purchases on eligible Amazon UK links."
    : null;

  const regionalSummary = region === "US"
    ? "US visitors see retailer links and product recommendations chosen for the US market."
    : "UK visitors see retailer links and product recommendations chosen for the UK market.";

  return (
    <>
      <Header />
      <div style={{ maxWidth: 720, margin: "0 auto", padding: "40px 20px", lineHeight: 1.8 }}>
      <RegionViewBanner audience="content" />

      <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 16 }}>About FindYourIdealMattress</h1>
      <p style={{ fontSize: 17 }}>{intro}</p>
      <p>{regionalSummary}</p>

      <h2 style={{ fontSize: 20, fontWeight: 600, marginTop: 32, marginBottom: 8 }}>How it works</h2>
      <p>
        You answer a short series of questions about how you sleep. Our scoring engine then evaluates every product in our
        catalogue against your answers - weighing the factors that matter most to you - and surfaces your top matches.
      </p>
      <p>
        Recommendations are generated in real time, entirely in your browser. We do not store your answers on any server.
      </p>

      <h2 style={{ fontSize: 20, fontWeight: 600, marginTop: 32, marginBottom: 8 }}>How scoring stays independent</h2>
      <p>
        Product ranking is driven by fit score only (sleep position, firmness, fill type, cooling, and your priorities).
        Commission status does not change score order.
      </p>

      <h2 style={{ fontSize: 20, fontWeight: 600, marginTop: 32, marginBottom: 8 }}>Our catalogue</h2>
      <p>
        We cover mattresses across all sleep types - from side sleepers to back sleepers, budget to premium. Products are
        selected based on availability, verified specifications, and breadth of coverage across different sleep needs.
      </p>

      <h2 style={{ fontSize: 20, fontWeight: 600, marginTop: 32, marginBottom: 8 }}>Affiliate disclosure</h2>
      <p>
        Some links on this site are affiliate links. If you click through and make a purchase, we may earn a small
        commission at no extra cost to you. This helps us keep the tool free and independent.
      </p>
      {amazonDisclosure ? <p>{amazonDisclosure}</p> : null}
      <p>Our recommendations are driven by the scoring algorithm - not by commission rates or sponsorship.</p>
      <p>
        Prices and availability are set by retailers, not by us, and may change at any time. Always confirm the latest
        product details, delivery terms, and return policy on the retailer&apos;s site before purchasing.
      </p>

      <h2 style={{ fontSize: 20, fontWeight: 600, marginTop: 32, marginBottom: 8 }}>Who&rsquo;s behind this</h2>
      <p>
        FindYourIdealMattress was built to cut through the noise of mattress marketing and give people a straightforward,
        honest recommendation based on how they actually sleep — nothing to buy, sign up for, or sit through.
      </p>

      <h2 style={{ fontSize: 20, fontWeight: 600, marginTop: 32, marginBottom: 8 }}>Get in touch</h2>
      <p>
        Have a suggestion or spotted an error? Email us at <a href="mailto:hello@findyouridealmattress.com">hello@findyouridealmattress.com</a>.
      </p>
    </div>
    </>
  );
}
