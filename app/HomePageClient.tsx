"use client";

import Link from "next/link";
import Image from "next/image";
import { useRegion } from "../core/geo/RegionContext";
import { getHomepageIntro } from "../core/geo/content";

const FOREST = "#1a3d2f";
const GREEN  = "#3bb273";
const WHITE  = "#ffffff";
const SURFACE = "#f6fbf7";
const BORDER  = "#cbe3d3";
const TEXT_PRIMARY   = "#1a3d2f";
const TEXT_SECONDARY = "#4b6b57";

export default function HomePageClient() {
  const { region, isLoading } = useRegion();
  const intro = getHomepageIntro(isLoading ? "UK" : region);
  const popularGuides = [
    { href: "/mattress/best-mattress", label: "Best mattress (hub)" },
    { href: "/mattress/best-mattress-for-side-sleepers-uk", label: "Side sleepers" },
    { href: "/mattress/best-mattress-for-back-pain-uk", label: "Back pain" },
    { href: "/mattress/best-hybrid-mattress-uk", label: "Hybrid mattresses" },
    { href: "/mattress/best-cooling-mattress-uk", label: "Hot sleepers" },
    { href: "/mattress/best-budget-mattress-uk", label: "Budget picks" },
  ];

  const features = [
    { icon: "📋", title: "Quick & easy", text: "A few quick questions, under 2 minutes" },
    { icon: "🎯", title: "Personalised picks", text: "Scored against how you sleep" },
    { icon: "🛏️", title: "Better sleep", text: "Right mattress. Better nights." },
    { icon: "💷", title: "Every budget", text: "From value to premium" },
  ];

  return (
    <div style={{ width: "100%", background: SURFACE }}>
      {/* HERO */}
      <section
        style={{
          background: "linear-gradient(135deg, #1a3d2f 0%, #1e4d38 55%, #245c42 100%)",
          color: WHITE,
          padding: "48px 20px 48px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div aria-hidden style={{ position: "absolute", top: -100, right: -100, width: 340, height: 340, borderRadius: "50%", border: `2px solid ${GREEN}`, opacity: 0.15 }} />
        <div aria-hidden style={{ position: "absolute", bottom: -60, left: -60, width: 200, height: 200, borderRadius: "50%", background: GREEN, opacity: 0.07 }} />

        <div style={{ maxWidth: 640, margin: "0 auto", position: "relative", display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", gap: 24 }}>
          <Image
            src="/images/logo.PNG"
            alt="Find Your Ideal Mattress"
            width={120}
            height={120}
            priority
            style={{ borderRadius: "50%", display: "block", boxShadow: "0 12px 40px -8px rgba(0,0,0,0.5)" }}
          />
          <h1 style={{ fontSize: "clamp(28px, 5vw, 44px)", fontWeight: 800, margin: 0, letterSpacing: -0.8, lineHeight: 1.1 }}>
            Find Your <span style={{ color: GREEN }}>Ideal Mattress</span>
          </h1>
          <p style={{ fontSize: "clamp(15px, 1.8vw, 17px)", color: "rgba(255,255,255,0.78)", margin: 0, lineHeight: 1.6, maxWidth: 520 }}>
            {intro}
          </p>
          <div style={{ display: "flex", flexDirection: "row", alignItems: "flex-start", gap: 12, flexWrap: "wrap", justifyContent: "center", marginTop: 8 }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
              <Link
                href="/mattress/questionnaire"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  background: GREEN,
                  color: FOREST,
                  borderRadius: 999,
                  padding: "16px 40px",
                  fontWeight: 800,
                  fontSize: 16,
                  textDecoration: "none",
                  letterSpacing: 0.2,
                  boxShadow: "0 8px 24px -8px rgba(59,178,115,0.6)",
                }}
              >
                Start fitting
              </Link>
              <span style={{ fontSize: 13, color: "rgba(255,255,255,0.55)" }}>Fitting in less than a minute</span>
            </div>
            <span style={{ fontWeight: 700, color: "#ffffff", fontSize: 16, display: "flex", alignItems: "center", paddingTop: 14 }}>Or</span>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
              <Link
                href="/mattress/best-mattress#quick-buy-starting-points"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  background: GREEN,
                  color: FOREST,
                  borderRadius: 999,
                  padding: "16px 40px",
                  fontWeight: 800,
                  fontSize: 16,
                  textDecoration: "none",
                  letterSpacing: 0.2,
                  boxShadow: "0 8px 24px -8px rgba(59,178,115,0.6)",
                }}
              >
                Quick Buy
              </Link>
              <span style={{ fontSize: 13, color: "rgba(255,255,255,0.55)" }}>Top-rated picks, ready to shop</span>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURE STRIP */}
      <section style={{ background: SURFACE, padding: "28px 20px", borderBottom: `1px solid ${BORDER}` }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 20 }}>
          {features.map(({ icon, title, text }) => (
            <div key={title} style={{ background: WHITE, border: `1px solid ${BORDER}`, borderRadius: 14, padding: "20px 22px", display: "flex", flexDirection: "column", gap: 8 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <span style={{ fontSize: 28, lineHeight: 1 }}>{icon}</span>
                <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: TEXT_PRIMARY }}>{title}</h3>
              </div>
              <p style={{ margin: 0, fontSize: 14, color: TEXT_SECONDARY, lineHeight: 1.5 }}>{text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section style={{ padding: "32px 20px 16px" }}>
        <div style={{ maxWidth: 880, margin: "0 auto" }}>
          <h2 style={{ fontSize: 26, fontWeight: 800, color: TEXT_PRIMARY, textAlign: "center", margin: "0 0 32px 0", letterSpacing: -0.5 }}>How it works</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16 }}>
            {[
              { step: "1", text: "Answer a few quick questions about how you sleep" },
              { step: "2", text: "Our engine scores every mattress against your answers" },
              { step: "3", text: "Get your personalised top picks — free, instantly" },
            ].map(({ step, text }) => (
              <div key={step} style={{ background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 14, padding: "22px 22px 24px", display: "flex", alignItems: "flex-start", gap: 14 }}>
                <span style={{ background: GREEN, color: FOREST, borderRadius: "50%", width: 32, height: 32, flexShrink: 0, display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 15, fontWeight: 800 }}>{step}</span>
                <p style={{ margin: 0, fontSize: 15, color: TEXT_PRIMARY, lineHeight: 1.55 }}>{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ padding: "0 20px 26px" }}>
        <div
          style={{
            maxWidth: 860,
            margin: "0 auto",
            background: WHITE,
            border: `1px solid ${BORDER}`,
            borderRadius: 14,
            padding: "16px 18px",
          }}
          aria-label="Help and trust links"
        >
          <p style={{ margin: "0 0 10px 0", fontSize: 14, color: TEXT_SECONDARY }}>
            Learn more before you start
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
            {[
              { href: "/mattress/best-mattress", label: "Best mattress hub" },
              { href: "/about", label: "How our recommendations work" },
              { href: "/contact", label: "Contact support" },
              { href: "/privacy-policy", label: "Privacy and cookies" },
              { href: "/terms", label: "Terms of use" },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                style={{
                  fontSize: 14,
                  fontWeight: 600,
                  color: TEXT_PRIMARY,
                  textDecoration: "none",
                }}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* POPULAR GUIDES */}
      {popularGuides.length > 0 && (
        <section style={{ padding: "24px 20px 48px" }}>
          <div style={{ maxWidth: 880, margin: "0 auto" }} aria-label="Popular mattress guides">
            <h2 style={{ fontSize: 20, fontWeight: 700, color: TEXT_PRIMARY, margin: "0 0 16px 0", textAlign: "center" }}>Popular mattress guides</h2>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 10, justifyContent: "center" }}>
              {popularGuides.map((guide) => (
                <Link key={guide.href} href={guide.href} style={{ fontSize: 14, fontWeight: 600, color: TEXT_PRIMARY, background: WHITE, border: `1px solid ${BORDER}`, borderRadius: 999, padding: "10px 16px", textDecoration: "none" }}>
                  {guide.label}
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
