import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "FindMyIdealMattress — find the right mattress for how you sleep";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 1200,
          height: 630,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #f4ede3 0%, #dbe7f6 100%)",
          fontFamily: "Georgia, serif",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: "48px auto auto 48px",
            width: 220,
            height: 220,
            borderRadius: 999,
            background: "rgba(193, 123, 58, 0.12)",
          }}
        />
        <div
          style={{
            position: "absolute",
            right: 64,
            bottom: 56,
            width: 260,
            height: 260,
            borderRadius: 32,
            background: "rgba(89, 115, 161, 0.14)",
            transform: "rotate(18deg)",
          }}
        />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "0 96px",
          }}
        >
          <div
            style={{
              fontSize: 18,
              fontWeight: 700,
              letterSpacing: 3,
              textTransform: "uppercase",
              color: "#6f5633",
              marginBottom: 18,
            }}
          >
            FindMyIdealMattress
          </div>
        <div
          style={{
            fontSize: 62,
            fontWeight: 700,
            color: "#1a1a1a",
            textAlign: "center",
            maxWidth: 900,
            lineHeight: 1.12,
          }}
        >
          Find the right mattress for how you actually sleep
        </div>
        <div
          style={{
            marginTop: 24,
            fontSize: 28,
            color: "#4b5876",
            textAlign: "center",
            maxWidth: 860,
          }}
        >
          Personalised recommendations, a fast quiz, and region-aware UK and US retailer links
        </div>
        <div
          style={{
            marginTop: 40,
            display: "flex",
            gap: 16,
          }}
        >
          <div
            style={{
              background: "#c17b3a",
              color: "#fff",
              borderRadius: 999,
              padding: "14px 28px",
              fontSize: 22,
              fontWeight: 700,
            }}
          >
            2-minute quiz
          </div>
          <div
            style={{
              background: "rgba(255,255,255,0.78)",
              color: "#23314d",
              borderRadius: 999,
              padding: "14px 28px",
              fontSize: 22,
              fontWeight: 700,
              border: "1px solid rgba(35,49,77,0.12)",
            }}
          >
            findmyidealmattress.com
          </div>
        </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
