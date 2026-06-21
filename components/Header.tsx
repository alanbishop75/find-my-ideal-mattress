"use client";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useQuizAbandon } from "./QuizAbandonContext";

const guideLinks = [
  { href: "/mattress/best-mattress", label: "Best Mattress (Overview)" },
  { href: "/mattress/best-mattress-for-side-sleepers", label: "Side sleepers" },
  { href: "/mattress/best-mattress-for-back-pain", label: "Back pain" },
  { href: "/mattress/best-hybrid-mattress", label: "Hybrid mattresses" },
  { href: "/mattress/best-cooling-mattress", label: "Hot sleepers" },
  { href: "/mattress/best-budget-mattress", label: "Budget picks" },
];

export function Header() {
  const router = useRouter();
  const { abandonQuiz } = useQuizAbandon();
  const pathname = usePathname();
  const isQuizPage = Boolean(pathname && pathname.split("/").filter(Boolean).includes("questionnaire"));
  if (pathname === "/") return null;
  const handleHomeClick = async (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (abandonQuiz) {
      e.preventDefault();
      await Promise.resolve(abandonQuiz());
      router.push("/");
    }
  };

  return (
    <header
      style={{
        background: "#1a3d2f",
        borderBottom: "1px solid rgba(255,255,255,0.08)",
        padding: "14px 0",
        boxShadow: "0 4px 16px -8px rgba(26,61,47,0.25)",
        position: "relative",
      }}
    >
      {isQuizPage && (
        <nav
          aria-label="Mattress guides"
          style={{
            position: "absolute",
            right: 16,
            top: "50%",
            transform: "translateY(-50%)",
            zIndex: 2,
          }}
        >
          <details style={{ position: "relative" }}>
            <summary
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                listStyle: "none",
                background: "#7ed4a6",
                color: "#1a3d2f",
                borderRadius: 999,
                padding: "8px 14px",
                fontWeight: 700,
                fontSize: 14,
                whiteSpace: "nowrap",
                cursor: "pointer",
                userSelect: "none",
              }}
            >
              Mattress Guides
            </summary>
            <div
              style={{
                position: "absolute",
                top: "110%",
                right: 0,
                minWidth: 240,
                background: "#ffffff",
                borderRadius: 12,
                boxShadow: "0 10px 24px -8px rgba(26,61,47,0.25)",
                border: "1px solid #d8e7de",
                padding: "8px 0",
              }}
            >
              {guideLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  style={{
                    display: "block",
                    padding: "10px 14px",
                    color: "#1a3d2f",
                    fontWeight: 600,
                    fontSize: 14,
                    textDecoration: "none",
                  }}
                  onClick={(event) => {
                    const details = event.currentTarget.closest("details");
                    if (details) details.removeAttribute("open");
                  }}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </details>
        </nav>
      )}
      <Link
        href="/"
        aria-label="Find Your Ideal Mattress — home"
        onClick={handleHomeClick}
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
          src="/images/logo.PNG"
          alt="Find Your Ideal Mattress"
          width={80}
          height={80}
          priority
          style={{ borderRadius: "50%", display: "block" }}
        />
        <span style={{ color: "#ffffff", fontWeight: 700, fontSize: 18, letterSpacing: -0.2 }}>
          FindYourIdealMattress
        </span>
      </Link>
    </header>
  );
}
