"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import type { Region } from "./types";
import { resolveRegionFromLocale } from "../../config/markets";

// ── Types ─────────────────────────────────────────────────────────────────────

export interface RegionContextType {
  /** Currently active display region. */
  region: Region;
  /** Region detected from request metadata, if available. */
  detectedRegion: Region | null;
  /** Raw ISO country code detected from request metadata, if available. */
  detectedCountry: string | null;
  /** Set a manual region choice and persist it to localStorage. */
  setRegion: (r: Region) => void;
  /** True when the user has manually overridden the detected region. */
  isOverridden: boolean;
  /**
   * True on first render before the region has been resolved.
   * Use to avoid rendering region-specific UI before hydration is safe.
   */
  isLoading: boolean;
}

// ── Internal constants ────────────────────────────────────────────────────────

const STORAGE_KEY = "fmi_region_override";

type GeoResponse = {
  region: Region;
  detectedCountry: string | null;
};

type GtagFn = (command: string, event: string, params?: Record<string, string | number>) => void;

function trackEvent(name: string, params?: Record<string, string | number>) {
  if (typeof window !== "undefined" && typeof (window as typeof window & { gtag?: GtagFn }).gtag === "function") {
    (window as typeof window & { gtag: GtagFn }).gtag("event", name, params ?? {});
  }
}

function getBrowserLocaleFallbackRegion(): Region | null {
  if (typeof navigator === "undefined") return null;

  const preferredLocales = Array.isArray(navigator.languages) && navigator.languages.length > 0
    ? navigator.languages
    : [navigator.language];

  for (const locale of preferredLocales) {
    const resolved = resolveRegionFromLocale(locale ?? null);
    if (resolved) return resolved;
  }

  return null;
}

// Default to UK — both the server-side fallback and the SSR placeholder must
// agree to avoid hydration mismatches.  UK is safe because:
//   1. The site was built for a UK audience first.
//   2. Unknown / other regions also fall back to UK.
const DEFAULT_REGION: Region = "UK";

// ── Context ───────────────────────────────────────────────────────────────────

const RegionContext = createContext<RegionContextType | undefined>(undefined);

// ── Provider ──────────────────────────────────────────────────────────────────

/**
 * RegionProvider
 *
 * Place this anywhere in the component tree where buy-link region awareness
 * is needed.  Currently used in the results page.
 *
 * Resolution order (first match wins):
 *   1. localStorage override  (`fmi_region_override`) — survives sessions
 *   2. Server-detected country via /api/geo-region  (Vercel edge header)
 *   3. Browser locale fallback when country header is missing
 *   4. Hard fallback: UK
 *
 * The initial render always uses DEFAULT_REGION (UK) so that SSR and the
 * first client paint agree, avoiding React hydration warnings.  After mount,
 * the effect runs and updates to the correct region.
 */
export function RegionProvider({ children }: { children: ReactNode }) {
  const [region, setRegionState] = useState<Region>(DEFAULT_REGION);
  const [detectedRegion, setDetectedRegion] = useState<Region | null>(null);
  const [detectedCountry, setDetectedCountry] = useState<string | null>(null);
  const [isOverridden, setIsOverridden] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let storedOverride: Region | null = null;

    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored === "UK" || stored === "US") {
        storedOverride = stored;
      }
    } catch {
      // localStorage may be unavailable in some privacy modes — that is fine.
    }

    fetch("/api/geo-region")
      .then((r) => r.json())
      .then((data: GeoResponse) => {
        const localeFallbackRegion = data.detectedCountry ? null : getBrowserLocaleFallbackRegion();
        const resolvedDetectedRegion = data.detectedCountry
          ? (data.region ?? DEFAULT_REGION)
          : (localeFallbackRegion ?? data.region ?? DEFAULT_REGION);
        setDetectedRegion(resolvedDetectedRegion);
        setDetectedCountry(data.detectedCountry ?? null);

        if (storedOverride) {
          setRegionState(storedOverride);
          setIsOverridden(true);

          trackEvent("region_override_set", {
            selected_region: storedOverride,
            detected_region: resolvedDetectedRegion,
            detected_country: data.detectedCountry ?? "unknown",
          });

          if (storedOverride !== resolvedDetectedRegion) {
            trackEvent("region_override_mismatch", {
              selected_region: storedOverride,
              detected_region: resolvedDetectedRegion,
              detected_country: data.detectedCountry ?? "unknown",
            });
          }
        } else {
          setRegionState(resolvedDetectedRegion);
          setIsOverridden(false);

          trackEvent("region_detected", {
            detected_region: resolvedDetectedRegion,
            detected_country: data.detectedCountry ?? "unknown",
            detection_source: data.detectedCountry ? "geo" : localeFallbackRegion ? "locale" : "default",
          });
        }
      })
      .catch(() => {
        if (storedOverride) {
          setRegionState(storedOverride);
          setIsOverridden(true);
          trackEvent("region_override_set", {
            selected_region: storedOverride,
            detected_region: "unknown",
            detected_country: "unknown",
          });
        } else {
          const localeFallbackRegion = getBrowserLocaleFallbackRegion();
          if (localeFallbackRegion) {
            setRegionState(localeFallbackRegion);
            setDetectedRegion(localeFallbackRegion);
            setIsOverridden(false);
            trackEvent("region_detected", {
              detected_region: localeFallbackRegion,
              detected_country: "unknown",
              detection_source: "locale",
            });
          }
          // Else keep DEFAULT_REGION.
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  function setRegion(r: Region) {
    try {
      localStorage.setItem(STORAGE_KEY, r);
    } catch {
      // Silently ignore if storage is unavailable.
    }
    setRegionState(r);
    setIsOverridden(true);
  }

  return (
    <RegionContext.Provider value={{ region, detectedRegion, detectedCountry, setRegion, isOverridden, isLoading }}>
      {children}
    </RegionContext.Provider>
  );
}

// ── Hook ──────────────────────────────────────────────────────────────────────

export function useRegion(): RegionContextType {
  const ctx = useContext(RegionContext);
  if (!ctx) throw new Error("useRegion must be used within a RegionProvider");
  return ctx;
}
