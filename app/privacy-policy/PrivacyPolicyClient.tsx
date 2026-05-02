"use client";

import { RegionViewBanner } from "../../components/RegionViewBanner";
import { useRegion } from "../../core/geo/RegionContext";

export default function PrivacyPolicyClient() {
  const { region } = useRegion();

  return (
    <div style={{ maxWidth: 720, margin: "0 auto", padding: "40px 20px", lineHeight: 1.7 }}>
      <RegionViewBanner audience="legal" />

      <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 8 }}>Privacy Policy</h1>
      <p style={{ color: "#666", marginBottom: 24, fontSize: 14 }}>Last updated: April 2026</p>

      <p>
        This policy explains what data FindMyIdealMattress collects, how it is used, and the privacy rights that may apply to you.
      </p>

      <h2 style={{ fontSize: 20, fontWeight: 600, marginTop: 32, marginBottom: 8 }}>1. Who we are</h2>
      <p>
        FindMyIdealMattress is a free online mattress recommendation tool available at <strong>findmyidealmattress.com</strong>.
        Contact: <a href="mailto:hello@findmyidealmattress.com">hello@findmyidealmattress.com</a>.
      </p>

      <h2 style={{ fontSize: 20, fontWeight: 600, marginTop: 32, marginBottom: 8 }}>2. Data we collect</h2>
      <ul>
        <li>
          <strong>Quiz answers:</strong> Stored temporarily in your browser session storage. Not sent to our servers.
        </li>
        <li>
          <strong>Analytics:</strong> We use GA4 for aggregate usage patterns.
        </li>
        <li>
          <strong>Cookies:</strong> Analytics cookies may be set by Google Analytics.
        </li>
      </ul>

      <h2 style={{ fontSize: 20, fontWeight: 600, marginTop: 32, marginBottom: 8 }}>3. Affiliate links</h2>
      <p>
        Some links on this site are affiliate links. If you purchase after clicking, we may earn a commission at no extra
        cost to you. Retailers may apply their own cookies and privacy practices.
      </p>
      <p>
        <strong>US visitors:</strong> FindMyIdealMattress is a participant in the Amazon Services LLC Associates Program,
        an affiliate advertising program designed to provide a means for sites to earn advertising fees by advertising
        and linking to Amazon.com.
      </p>
      <p>
        <strong>UK visitors:</strong> FindMyIdealMattress is a participant in the Amazon EU Associates Programme, an
        affiliate advertising program designed to provide a means for sites to earn advertising fees by advertising and
        linking to Amazon.co.uk.
      </p>

      <h2 style={{ fontSize: 20, fontWeight: 600, marginTop: 32, marginBottom: 8 }}>4. Regional privacy notices</h2>
      <div style={{ border: "1px solid #e5e7eb", borderRadius: 10, padding: "14px 16px", background: region === "US" ? "#f0f9ff" : "#fff" }}>
        <h3 style={{ marginTop: 0, marginBottom: 8 }}>US notice</h3>
        <p style={{ margin: 0 }}>
          US users may have privacy rights under applicable state laws. If you have a privacy request, email us and include
          your state and request type.
        </p>
      </div>

      <div style={{ border: "1px solid #e5e7eb", borderRadius: 10, padding: "14px 16px", marginTop: 12, background: region === "UK" ? "#f0fdf4" : "#fff" }}>
        <h3 style={{ marginTop: 0, marginBottom: 8 }}>UK notice</h3>
        <p style={{ margin: 0 }}>
          UK users may have rights under UK data protection law, including access, correction, and deletion requests.
        </p>
      </div>

      <h2 style={{ fontSize: 20, fontWeight: 600, marginTop: 32, marginBottom: 8 }}>5. Cookies and consent</h2>
      <p>
        We use Google Analytics (GA4) to understand how this site is used in aggregate. Analytics cookies are
        <strong> only set after you give consent</strong> via the banner shown on your first visit.
      </p>
      <p>
        When you click <strong>Accept</strong>, analytics data collection is enabled for your browser. When you click
        <strong> Decline</strong>, no analytics cookies are set and no tracking data is sent to Google.
      </p>
      <p>
        <strong>To withdraw or change your consent:</strong> clear your browser&rsquo;s local storage for this site
        (or open the site in a private/incognito window) and the consent banner will reappear, allowing you to make
        a fresh choice.
      </p>
      <p>
        You can also manage or block cookies entirely through your browser settings, or install the
        {" "}<a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer">Google Analytics opt-out browser add-on</a>.
      </p>

      <h2 style={{ fontSize: 20, fontWeight: 600, marginTop: 32, marginBottom: 8 }}>6. Changes</h2>
      <p>We may update this policy and will update the last updated date above.</p>
    </div>
  );
}
