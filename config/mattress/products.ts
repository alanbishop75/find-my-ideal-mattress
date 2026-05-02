/**
 * config/mattress/products.ts
 *
 * Mattress product catalogue — UK market, Double size baseline.
 *
 * Catalogue rebuilt 2026-05-02 (mattress-v1.1, Phase 5 direct-link milestone).
 * All 18 entries point to a verified Amazon UK ASIN with the affiliate
 * tag "findmyidealmattress-21". Source ASINs were validated via
 * scripts/research-asins.mjs (non-sponsored brand-match) and curated.
 *
 * Earlier iterations of this catalogue contained 30 SKUs, but DTC-only brands
 * (Hypnia, MLily, Eve, Hyde&Sleep, Tempur mattresses, Panda mattresses) do
 * not sell on Amazon UK. Those entries were removed rather than mislink to
 * unrelated products.
 *
 * Attribute key reference (used by the scoring engine):
 *
 *  sleepPosition  'side' | 'back' | 'stomach' | 'combination' | 'any'
 *  firmness       'soft' | 'medium-soft' | 'medium' | 'medium-firm' | 'firm'
 *  construction   'memory-foam' | 'pocket-spring' | 'hybrid' | 'latex' | 'open-coil'
 *  cooling        boolean — true if product has active cooling layer/technology
 *  hypoallergenic boolean — true if safe for dust-mite/allergy sufferers
 *  edgeSupport    'none' | 'standard' | 'reinforced'
 *  motionIsolation 'poor' | 'good' | 'excellent'
 *  weightClass    'light' | 'average' | 'heavy' | 'any'
 *  backSupport    'standard' | 'enhanced' | 'ortho'
 *  priceTier      'budget' | 'mid' | 'premium'
 *  rrp            UK RRP in GBP (Double size)
 *  rrpUs          US RRP in USD (Queen size, for future US market)
 *  availability   'uk' | 'us' | 'both'
 */
import type { Product } from "../../core/types";

const REVIEW_DATE = "2026-05-02";

function ukVerified(asin: string) {
  return {
    status: "AMAZON_UK_VERIFIED_EXACT" as const,
    notes:
      `Verified on Amazon UK via scripts/research-asins.mjs (non-sponsored brand-match). ASIN: ${asin}.`,
    amazonUkCandidateUrl: `https://www.amazon.co.uk/dp/${asin}`,
    lastReviewed: REVIEW_DATE,
  };
}

export const products: Product[] = [
  {
    id: "jayBe-truecore-hybrid-2000",
    brand: "Jay-Be",
    name: "Truecore Hybrid 2000 Mattress",
    description:
      "A Made-in-the-UK 23cm hybrid with 2,000 e-pocket springs and a foam comfort layer. Sustainable construction and a medium feel make it an easy budget pick for back and combination sleepers of average weight.",
    imageUrl: "https://m.media-amazon.com/images/I/91oQRYr3WCL._AC_SL1500_.jpg",
    rrp: 299,
    rrpUs: 379,
    attributes: {
      sleepPosition: "any",
      firmness: "medium",
      construction: "hybrid",
      cooling: false,
      hypoallergenic: true,
      edgeSupport: "standard",
      motionIsolation: "good",
      weightClass: "average",
      backSupport: "standard",
      priceTier: "budget",
      rrp: 299,
      rrpUs: 379,
      availability: "uk",
    },
    ukAmazonVerification: ukVerified("B0BX491JDR"),
  },

  {
    id: "silentnight-7zone-memory-foam",
    brand: "Silentnight",
    name: "7 Zone Memory Foam Rolled Mattress",
    description:
      "Seven targeted pressure zones wrapped in hypoallergenic memory foam. Made in the UK and rolled for delivery, with a medium-firm feel that contours to the body and isolates motion well — a strong budget pick for solo side and back sleepers.",
    imageUrl: "https://m.media-amazon.com/images/I/71KAaDYK0cL._AC_SL1150_.jpg",
    rrp: 199,
    rrpUs: 249,
    attributes: {
      sleepPosition: "side",
      firmness: "medium-firm",
      construction: "memory-foam",
      cooling: false,
      hypoallergenic: true,
      edgeSupport: "none",
      motionIsolation: "excellent",
      weightClass: "average",
      backSupport: "standard",
      priceTier: "budget",
      rrp: 199,
      rrpUs: 249,
      availability: "uk",
    },
    ukAmazonVerification: ukVerified("B008I1E374"),
  },

  {
    id: "inofia-12in-hybrid",
    brand: "Inofia",
    name: "12 Inch Aeroshield Hybrid Mattress",
    description:
      "A 30cm hybrid with Inofia's Aeroshield memory foam comfort layer over NexusArc pocket springs. Breathable cover and balanced medium feel — solid value for couples or single sleepers wanting hybrid support without premium pricing.",
    imageUrl: "https://m.media-amazon.com/images/I/71vdhudZJdL._AC_SL1500_.jpg",
    rrp: 219,
    rrpUs: 279,
    attributes: {
      sleepPosition: "any",
      firmness: "medium",
      construction: "hybrid",
      cooling: false,
      hypoallergenic: true,
      edgeSupport: "standard",
      motionIsolation: "good",
      weightClass: "average",
      backSupport: "standard",
      priceTier: "budget",
      rrp: 219,
      rrpUs: 279,
      availability: "uk",
    },
    ukAmazonVerification: ukVerified("B0F1X6LHK8"),
  },

  {
    id: "zinus-8in-green-tea",
    brand: "Zinus",
    name: "8 Inch Green Tea Memory Foam Mattress",
    description:
      "Memory foam infused with green tea extract and active charcoal to keep the foam fresher for longer. A compact 8-inch profile suits light sleepers and lower bed frames. OEKO-TEX certified and strongly hypoallergenic.",
    imageUrl: "https://m.media-amazon.com/images/I/81Gbm7Al2LL._AC_SL1500_.jpg",
    rrp: 169,
    rrpUs: 209,
    attributes: {
      sleepPosition: "side",
      firmness: "medium-firm",
      construction: "memory-foam",
      cooling: false,
      hypoallergenic: true,
      edgeSupport: "none",
      motionIsolation: "excellent",
      weightClass: "light",
      backSupport: "standard",
      priceTier: "budget",
      rrp: 169,
      rrpUs: 209,
      availability: "uk",
    },
    ukAmazonVerification: ukVerified("B0DHRWKR65"),
  },

  {
    id: "vesgantti-10in-hybrid",
    brand: "Vesgantti",
    name: "10.3 Inch Multilayer Hybrid Mattress",
    description:
      "A value hybrid with a Euro box-top comfort layer over individually pocketed springs. The multilayer build provides decent pressure relief and more support than budget all-foam options. Medium-firm feel suits average-weight sleepers.",
    imageUrl: "https://m.media-amazon.com/images/I/81Mv1D8zu-L._AC_SL1500_.jpg",
    rrp: 199,
    rrpUs: 249,
    attributes: {
      sleepPosition: "any",
      firmness: "medium-firm",
      construction: "hybrid",
      cooling: false,
      hypoallergenic: true,
      edgeSupport: "standard",
      motionIsolation: "good",
      weightClass: "average",
      backSupport: "standard",
      priceTier: "budget",
      rrp: 199,
      rrpUs: 249,
      availability: "uk",
    },
    ukAmazonVerification: ukVerified("B072XLVL4S"),
  },

  {
    id: "sweetnight-8in-memory-foam",
    brand: "Sweetnight",
    name: "8 Inch Memory Foam Sprung Mattress",
    description:
      "An 8-inch memory-foam-and-spring hybrid with a gel-infused comfort layer for light cooling. Low-profile, hypoallergenic, and built for solo sleepers in tighter spaces or guest rooms.",
    imageUrl: "https://m.media-amazon.com/images/I/71puL0RyMML._AC_SL1500_.jpg",
    rrp: 159,
    rrpUs: 199,
    attributes: {
      sleepPosition: "side",
      firmness: "medium-soft",
      construction: "hybrid",
      cooling: true,
      hypoallergenic: true,
      edgeSupport: "standard",
      motionIsolation: "good",
      weightClass: "light",
      backSupport: "standard",
      priceTier: "budget",
      rrp: 159,
      rrpUs: 199,
      availability: "uk",
    },
    ukAmazonVerification: ukVerified("B08P9S1GFJ"),
  },

  {
    id: "dormeo-essence-hybrid-classic",
    brand: "Dormeo",
    name: "Essence Hybrid Classic Foam Mattress",
    description:
      "Dormeo's Essence Hybrid Classic combines breathable foam layers with a supportive base. Balanced medium feel for combination sleepers who want temperature-aware foam without crossing into mid-tier pricing.",
    imageUrl: "https://m.media-amazon.com/images/I/711JwWWC+tL._AC_SL1500_.jpg",
    rrp: 229,
    rrpUs: 289,
    attributes: {
      sleepPosition: "any",
      firmness: "medium",
      construction: "hybrid",
      cooling: true,
      hypoallergenic: true,
      edgeSupport: "standard",
      motionIsolation: "good",
      weightClass: "average",
      backSupport: "standard",
      priceTier: "budget",
      rrp: 229,
      rrpUs: 289,
      availability: "uk",
    },
    ukAmazonVerification: ukVerified("B0F3X7T9HB"),
  },

  {
    id: "silentnight-3zone-memory-foam",
    brand: "Silentnight",
    name: "3 Zone Memory Foam Rolled Mattress",
    description:
      "Three targeted comfort zones in UK-made hypoallergenic memory foam. Slightly softer feel than the 7-zone variant, suiting side sleepers who want pressure relief at the shoulders and hips at a mid-budget price.",
    imageUrl: "https://m.media-amazon.com/images/I/91tIbAvelNL._AC_SL1500_.jpg",
    rrp: 269,
    rrpUs: 339,
    attributes: {
      sleepPosition: "side",
      firmness: "medium",
      construction: "memory-foam",
      cooling: false,
      hypoallergenic: true,
      edgeSupport: "none",
      motionIsolation: "excellent",
      weightClass: "average",
      backSupport: "standard",
      priceTier: "mid",
      rrp: 269,
      rrpUs: 339,
      availability: "uk",
    },
    ukAmazonVerification: ukVerified("B006MUTMF6"),
  },

  {
    id: "bedstory-12in-hybrid",
    brand: "BedStory",
    name: "12 Inch Hybrid Pocket Spring Mattress",
    description:
      "A deep 30cm hybrid from BedStory with a Euro pillow top, gel-infused memory foam, and 1,000 pocket springs. Good lumbar support for heavier sleepers at a competitive mid-market price.",
    imageUrl: "https://m.media-amazon.com/images/I/81P4We2YRnL._AC_SL1500_.jpg",
    rrp: 269,
    rrpUs: 339,
    attributes: {
      sleepPosition: "back",
      firmness: "medium-firm",
      construction: "hybrid",
      cooling: false,
      hypoallergenic: true,
      edgeSupport: "reinforced",
      motionIsolation: "good",
      weightClass: "heavy",
      backSupport: "enhanced",
      priceTier: "mid",
      rrp: 269,
      rrpUs: 339,
      availability: "uk",
    },
    ukAmazonVerification: ukVerified("B0FR9G29JY"),
  },

  {
    id: "silentnight-1400-eco-comfort",
    brand: "Silentnight",
    name: "1400 Eco Comfort Mattress (Firm)",
    description:
      "Silentnight's 1400-count Eco Comfort uses recycled fibres and a firm pocket-spring core for solid back-support. No foam comfort layer keeps it breathable — a good choice for heavier back sleepers wanting traditional UK pocket-spring feel.",
    imageUrl: "https://m.media-amazon.com/images/I/91dS3DA4BtS._AC_SL1500_.jpg",
    rrp: 349,
    rrpUs: 449,
    attributes: {
      sleepPosition: "back",
      firmness: "firm",
      construction: "pocket-spring",
      cooling: false,
      hypoallergenic: false,
      edgeSupport: "standard",
      motionIsolation: "poor",
      weightClass: "heavy",
      backSupport: "enhanced",
      priceTier: "mid",
      rrp: 349,
      rrpUs: 449,
      availability: "uk",
    },
    ukAmazonVerification: ukVerified("B00W4RQMTA"),
  },

  {
    id: "emma-original-lite",
    brand: "Emma",
    name: "Original Lite Mattress",
    description:
      "Emma's Original Lite — a 22cm all-foam mattress with the brand's signature Airgocell open-cell foam and a cold-process memory foam comfort layer. Responsive yet pressure-relieving feel suiting combination sleepers of average weight.",
    imageUrl: "https://m.media-amazon.com/images/I/61ndmardGNL._AC_SL1500_.jpg",
    rrp: 379,
    rrpUs: 479,
    attributes: {
      sleepPosition: "combination",
      firmness: "medium",
      construction: "memory-foam",
      cooling: false,
      hypoallergenic: true,
      edgeSupport: "standard",
      motionIsolation: "excellent",
      weightClass: "average",
      backSupport: "standard",
      priceTier: "mid",
      rrp: 379,
      rrpUs: 479,
      availability: "uk",
    },
    ukAmazonVerification: ukVerified("B0GSS36HF8"),
  },

  {
    id: "nectar-hybrid-lite-20cm",
    brand: "Nectar",
    name: "Hybrid Lite 20cm Mattress",
    description:
      "Nectar's entry hybrid: 20cm of memory foam comfort over a supportive spring base. Balanced medium feel and a classic Nectar long trial period — accessible mid-tier comfort for solo sleepers and couples on a budget.",
    imageUrl: "https://m.media-amazon.com/images/I/71G2h2LRhKL._AC_SL1500_.jpg",
    rrp: 329,
    rrpUs: 419,
    attributes: {
      sleepPosition: "any",
      firmness: "medium",
      construction: "hybrid",
      cooling: false,
      hypoallergenic: true,
      edgeSupport: "standard",
      motionIsolation: "good",
      weightClass: "average",
      backSupport: "standard",
      priceTier: "mid",
      rrp: 329,
      rrpUs: 419,
      availability: "uk",
    },
    ukAmazonVerification: ukVerified("B0F8CK9GWF"),
  },

  {
    id: "nectar-classic-hybrid-25cm",
    brand: "Nectar",
    name: "Classic Hybrid 25cm Mattress",
    description:
      "Nectar's Classic Hybrid pairs cooling memory foam with individually pocketed springs in a 25cm profile. Medium-firm feel with reinforced edges — well-suited to couples and back sleepers who want zoned support and good motion isolation.",
    imageUrl: "https://m.media-amazon.com/images/I/61-Fpf0QilL._AC_SL1000_.jpg",
    rrp: 449,
    rrpUs: 569,
    attributes: {
      sleepPosition: "back",
      firmness: "medium-firm",
      construction: "hybrid",
      cooling: true,
      hypoallergenic: true,
      edgeSupport: "reinforced",
      motionIsolation: "good",
      weightClass: "average",
      backSupport: "enhanced",
      priceTier: "mid",
      rrp: 449,
      rrpUs: 569,
      availability: "uk",
    },
    ukAmazonVerification: ukVerified("B0GPR7JP8M"),
  },

  {
    id: "otty-original-hybrid-2000",
    brand: "Otty",
    name: "Original UK Hybrid 2000 Mattress",
    description:
      "Award-winning UK hybrid with a cooling gel-foam comfort layer, bamboo-charcoal memory foam, and up to 2,000 individually pocketed micro-springs. The cooling gel and open-cell construction make it one of the best temperature-regulating hybrids in the mid tier.",
    imageUrl: "https://m.media-amazon.com/images/I/41jTYNsFkZL._AC_SL1000_.jpg",
    rrp: 499,
    rrpUs: 629,
    attributes: {
      sleepPosition: "any",
      firmness: "medium",
      construction: "hybrid",
      cooling: true,
      hypoallergenic: true,
      edgeSupport: "standard",
      motionIsolation: "good",
      weightClass: "any",
      backSupport: "enhanced",
      priceTier: "mid",
      rrp: 499,
      rrpUs: 629,
      availability: "uk",
    },
    ukAmazonVerification: ukVerified("B01HS66RM8"),
  },

  {
    id: "sealy-steeple-ortho-plus",
    brand: "Sealy",
    name: "Steeple Ortho Plus Mattress",
    description:
      "Sealy's orthopaedic-grade pocket spring system in their Steeple range, with a firm surface designed to support the lumbar spine. No foam comfort layers keeps it breathable — ideal for heavy back sleepers and anyone with lower-back issues who needs ortho-firm support.",
    imageUrl: "https://m.media-amazon.com/images/I/81MGCbwvqEL._AC_SL1500_.jpg",
    rrp: 449,
    rrpUs: 569,
    attributes: {
      sleepPosition: "back",
      firmness: "firm",
      construction: "pocket-spring",
      cooling: false,
      hypoallergenic: false,
      edgeSupport: "reinforced",
      motionIsolation: "poor",
      weightClass: "heavy",
      backSupport: "ortho",
      priceTier: "mid",
      rrp: 449,
      rrpUs: 569,
      availability: "uk",
    },
    ukAmazonVerification: ukVerified("B0BSR7P29W"),
  },

  {
    id: "dormeo-octasmart-hybrid",
    brand: "Dormeo",
    name: "Octasmart Hybrid Mattress",
    description:
      "Dormeo's Octasmart Hybrid combines patented Octaspring foam-spring technology with Aerocell foam and a pocket-spring base. Excellent airflow and zoned support — a premium pick for hot sleepers who want responsive feel without traditional metal-spring noise.",
    imageUrl: "https://m.media-amazon.com/images/I/61vvhjOd6DL._AC_SL1500_.jpg",
    rrp: 649,
    rrpUs: 829,
    attributes: {
      sleepPosition: "any",
      firmness: "medium",
      construction: "hybrid",
      cooling: true,
      hypoallergenic: true,
      edgeSupport: "standard",
      motionIsolation: "excellent",
      weightClass: "any",
      backSupport: "enhanced",
      priceTier: "premium",
      rrp: 649,
      rrpUs: 829,
      availability: "uk",
    },
    ukAmazonVerification: ukVerified("B09MR3FQK3"),
  },

  {
    id: "silentnight-miracoil-ortho",
    brand: "Silentnight",
    name: "Miracoil Ortho Extra Firm Mattress",
    description:
      "Silentnight's Miracoil continuous-coil spring system runs vertically rather than in a grid, providing edge-to-edge support and zero partner disturbance. The Ortho variant has an extra-firm feel suiting heavier back sleepers and anyone with lower-back complaints.",
    imageUrl: "https://m.media-amazon.com/images/I/91NdEIlJICL._AC_SL1500_.jpg",
    rrp: 599,
    rrpUs: 759,
    attributes: {
      sleepPosition: "back",
      firmness: "firm",
      construction: "hybrid",
      cooling: false,
      hypoallergenic: false,
      edgeSupport: "reinforced",
      motionIsolation: "good",
      weightClass: "heavy",
      backSupport: "ortho",
      priceTier: "premium",
      rrp: 599,
      rrpUs: 759,
      availability: "uk",
    },
    ukAmazonVerification: ukVerified("B00ATOGV9G"),
  },

  {
    id: "simba-hybrid-pro",
    brand: "Simba",
    name: "Hybrid Pro Mattress 28cm",
    description:
      "Simba's flagship 28cm hybrid: graphite-infused Simbatex cooling foam, open-cell memory foam, and up to 5,000 individually pocketed titanium-alloy aerocoil springs. The highest spring count in the range delivers exceptional zone support, near-zero motion transfer, and active heat dissipation.",
    imageUrl: "https://m.media-amazon.com/images/I/51UW0Q1aLXL._AC_SL1500_.jpg",
    rrp: 1099,
    rrpUs: 1399,
    attributes: {
      sleepPosition: "any",
      firmness: "medium",
      construction: "hybrid",
      cooling: true,
      hypoallergenic: true,
      edgeSupport: "reinforced",
      motionIsolation: "excellent",
      weightClass: "any",
      backSupport: "enhanced",
      priceTier: "premium",
      rrp: 1099,
      rrpUs: 1399,
      availability: "uk",
    },
    ukAmazonVerification: ukVerified("B076PLV4Z7"),
  },
];
