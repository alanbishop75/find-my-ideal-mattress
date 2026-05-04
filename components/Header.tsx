"use client";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

export function Header() {
  const pathname = usePathname();
  if (pathname === "/") return null;
  return (
    <header
      style={{
        background: "#1a3d2f",
        borderBottom: "1px solid rgba(255,255,255,0.08)",
        padding: "14px 0",
        boxShadow: "0 4px 16px -8px rgba(26,61,47,0.25)",
      }}
    >
      <Link
        href="/"
        aria-label="Find My Ideal Mattress — home"
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 8,
          textDecoration: "none",
        }}
      >
        <Image
          src="/images/pillowLogo.PNG"
          alt="Find My Ideal Mattress"
          width={80}
          height={80}
          priority
          style={{ borderRadius: "50%", display: "block" }}
        />
        <span style={{ color: "#ffffff", fontWeight: 700, fontSize: 18, letterSpacing: -0.2 }}>
          FindMyIdealMattress
        </span>
      </Link>
    </header>
  );
}
