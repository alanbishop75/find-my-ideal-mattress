
import { headers } from "next/headers";
import ClientRoot from "./client-root";
import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "../core/theme";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import CookieBanner from "../components/CookieBanner";
import { QuizAbandonProvider } from "../components/QuizAbandonProvider";
import { categoryRegistry } from "../config/registry";
import { categoryFromHost, defaultCategoryId } from "../config/domain-map";
import { CategoryProvider } from "../core/category-context";
import { ThemeName, themeNames } from "../core/theme/tokens";
import { getRequiredSiteUrl } from "../lib/site-url";
import fs from "fs";
import path from "path";

const BUILD_PHASE = "phase-production-build";

async function resolveCategoryIdForRequest(): Promise<string> {
  // During `next build`, there is no real request host context.
  // Use the DEFAULT_CATEGORY_ID env var (or the domain-map default) to keep
  // metadata/layout resolution deterministic. Set this in .env.local and Vercel.
  if (process.env.NEXT_PHASE === BUILD_PHASE) {
    return process.env.DEFAULT_CATEGORY_ID ?? defaultCategoryId;
  }

  const host = (await headers()).get("host") ?? "";
  return categoryFromHost(host);
}

function resolveActiveTheme(categoryId: string): ThemeName {
  const fallback = (categoryRegistry[categoryId]?.theme ?? "white") as ThemeName;
  try {
    const configPath = path.resolve(process.cwd(), "config/global-theme.json");
    const raw = fs.readFileSync(configPath, "utf-8");
    const parsed = JSON.parse(raw) as { themes?: Record<string, string>; theme?: string };
    const fromConfig = parsed.themes?.[categoryId] ?? parsed.themes?.default ?? parsed.theme;
    if (fromConfig && (themeNames as readonly string[]).includes(fromConfig)) {
      return fromConfig as ThemeName;
    }
  } catch {
    // Fall back to category default if config read/parse fails.
  }
  return fallback;
}

export async function generateMetadata(): Promise<Metadata> {
  const categoryId = await resolveCategoryIdForRequest();
  const config = categoryRegistry[categoryId];
  const siteUrl = getRequiredSiteUrl();
  const title = config?.meta.title ?? "FindYourIdealMattress — Find Your Perfect Mattress";
  const description = config?.meta.description ?? "Answer a few quick questions and get your personalised mattress recommendations. Free, no sign-up required.";
  const ogImage = "/opengraph-image";
  return {
    metadataBase: new URL(siteUrl),
    title,
    description,
    icons: {
      icon: [{ url: '/icon.svg', type: 'image/svg+xml' }],
    },
    openGraph: {
      title,
      description,
      url: siteUrl,
      siteName: 'FindYourIdealMattress',
      type: 'website',
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: 'FindYourIdealMattress share image',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      site: '@FYIdealMattress',
      images: [ogImage],
    },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const categoryId = await resolveCategoryIdForRequest();
  const activeTheme = resolveActiveTheme(categoryId);

  return (
    <html
      lang="en"
      className="min-h-screen flex flex-col antialiased"
    >
      <head>
        {/* Google Consent Mode v2 — must run before gtag.js loads */}
        <script dangerouslySetInnerHTML={{ __html: `
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('consent', 'default', {
            analytics_storage: 'denied',
            ad_storage: 'denied',
            wait_for_update: 500
          });
          try {
            if (localStorage.getItem('cookie_consent') === 'granted') {
              gtag('consent', 'update', { analytics_storage: 'granted', ad_storage: 'granted' });
            }
          } catch(e) {}
        ` }} />
        {/* Google tag (gtag.js) */}
        <script async src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA4_ID ?? ''}`}></script>
        <script dangerouslySetInnerHTML={{ __html: `
          gtag('js', new Date());
          gtag('config', '${process.env.NEXT_PUBLIC_GA4_ID ?? ''}');
        ` }} />
      </head>
      <body className="flex flex-col min-h-screen">
        <ThemeProvider themeName={activeTheme}>
          <CategoryProvider categoryId={categoryId} brandName={categoryRegistry[categoryId]?.meta.brandName ?? 'FindMyIdealMattress'}>
            <Header />
            <QuizAbandonProvider>
              <main className="p-0 m-0">
                <ClientRoot>{children}</ClientRoot>
              </main>
            </QuizAbandonProvider>
            <Footer />
            <CookieBanner />
          </CategoryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
