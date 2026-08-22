export type MattressComparisonPage = {
  slug: string;
  metaTitle: string;
  metaDescription: string;
  h1: string;
  intro: string;
  leftProductId: string;
  rightProductId: string;
  searchIntent: string;
  keyPoints: Array<{
    label: string;
    left: string;
    right: string;
  }>;
  faq?: Array<{
    question: string;
    answer: string;
  }>;
  verdict: string;
};

export const mattressComparisonPages: MattressComparisonPage[] = [
  {
    slug: "simba-hybrid-pro-vs-emma-original-lite",
    metaTitle: "Simba Hybrid Pro vs Emma Original Lite (2026) | Which Suits You?",
    metaDescription:
      "Compare Simba Hybrid Pro vs Emma Original Lite side by side, see the key differences in support and feel, and view UK and US buy links for both.",
    h1: "Simba Hybrid Pro vs Emma Original Lite",
    intro:
      "This is the classic UK bed-in-a-box comparison. The Simba Hybrid Pro is a heavily engineered premium hybrid, while the Emma Original Lite is a lighter all-foam mattress at a friendlier price. They suit different priorities on support, cooling and budget.",
    leftProductId: "simba-hybrid-pro",
    rightProductId: "emma-original-lite",
    searchIntent: "Simba vs Emma",
    keyPoints: [
      {
        label: "Construction",
        left: "28cm hybrid with up to 5,000 aerocoil springs and cooling foam",
        right: "22cm all-foam with Airgocell and memory foam layers",
      },
      {
        label: "Temperature",
        left: "Active cooling with graphite-infused foam",
        right: "No active cooling layer",
      },
      {
        label: "Best for",
        left: "Sleepers who want a premium all-rounder with strong zone support",
        right: "Combination and average-weight sleepers who want an easier-turning feel",
      },
      {
        label: "Decision rule",
        left: "Choose this if support, cooling and edge strength matter most",
        right: "Choose this if you want a responsive foam feel for less",
      },
    ],
    verdict:
      "The Simba Hybrid Pro is the more capable mattress on support, cooling and edge strength, while the Emma Original Lite is the smarter buy if you want a responsive foam feel at a lower price.",
  },
  {
    slug: "nectar-classic-hybrid-vs-otty-original-hybrid",
    metaTitle: "Nectar Classic Hybrid vs Otty Original Hybrid (2026) | Compared",
    metaDescription:
      "Compare Nectar Classic Hybrid vs Otty Original Hybrid, see which cooling hybrid fits how you sleep, and shop both with UK and US buy links.",
    h1: "Nectar Classic Hybrid vs Otty Original Hybrid",
    intro:
      "Two of the most searched mid-price cooling hybrids in the UK. The Nectar Classic Hybrid leans firmer with reinforced edges, while the Otty Original Hybrid keeps a balanced medium feel for mixed-position sleepers who run warm.",
    leftProductId: "nectar-classic-hybrid-25cm",
    rightProductId: "otty-original-hybrid-2000",
    searchIntent: "Nectar vs Otty",
    keyPoints: [
      {
        label: "Firmness",
        left: "Medium-firm with enhanced back support",
        right: "Balanced medium, versatile across positions",
      },
      {
        label: "Edge support",
        left: "Reinforced edges, good for couples",
        right: "Standard edges, breathable build",
      },
      {
        label: "Best for",
        left: "Back sleepers and couples who want firmer zone support",
        right: "Mixed-position sleepers who run warm",
      },
      {
        label: "Decision rule",
        left: "Choose this if you want a firmer, edge-strong feel",
        right: "Choose this if you want a versatile medium that breathes",
      },
    ],
    verdict:
      "The Nectar Classic Hybrid is the better pick for firmer, edge-strong support, while the Otty Original Hybrid wins if you want a versatile medium feel with strong airflow.",
  },
  {
    slug: "nectar-hybrid-lite-vs-nectar-classic-hybrid",
    metaTitle: "Nectar Hybrid Lite vs Classic Hybrid (2026) | Entry vs Step-Up",
    metaDescription:
      "Compare the Nectar Hybrid Lite vs Classic Hybrid, understand the trade-offs between entry and step-up, and view UK and US buy links.",
    h1: "Nectar Hybrid Lite vs Classic Hybrid",
    intro:
      "A common in-brand Nectar comparison: is the entry Hybrid Lite enough, or is the Classic Hybrid worth the step up? This page breaks the choice down on feel, cooling and support.",
    leftProductId: "nectar-hybrid-lite-20cm",
    rightProductId: "nectar-classic-hybrid-25cm",
    searchIntent: "Nectar Hybrid Lite vs Classic",
    keyPoints: [
      {
        label: "Profile",
        left: "20cm entry hybrid, balanced medium",
        right: "25cm step-up hybrid, medium-firm",
      },
      {
        label: "Cooling",
        left: "No active cooling layer",
        right: "Cooling memory foam layer",
      },
      {
        label: "Best for",
        left: "Value buyers wanting hybrid support and a recognisable brand",
        right: "Back sleepers and couples wanting firmer, cooler support",
      },
      {
        label: "Decision rule",
        left: "Choose this to keep costs down with a balanced feel",
        right: "Choose this for firmer support, cooling and reinforced edges",
      },
    ],
    verdict:
      "The Nectar Hybrid Lite is the value entry point with a balanced medium feel, while the Classic Hybrid is worth the step up if you want firmer support, cooling and stronger edges.",
  },
  {
    slug: "dormeo-octasmart-hybrid-vs-simba-hybrid-pro",
    metaTitle: "Dormeo vs Simba (2026): Which Mattress Is Better?",
    metaDescription:
      "Compare Dormeo Octasmart vs Simba Hybrid Pro on cooling, support, motion isolation and value to decide which premium hybrid mattress suits you.",
    h1: "Dormeo Octasmart Hybrid vs Simba Hybrid Pro",
    intro:
      "Both are premium cooling hybrids aimed at hot sleepers who want zoned support without the bounce of a traditional spring mattress. The choice comes down to spring engineering, price and motion control.",
    leftProductId: "dormeo-octasmart-hybrid",
    rightProductId: "simba-hybrid-pro",
    searchIntent: "Dormeo Octasmart vs Simba Hybrid Pro",
    keyPoints: [
      {
        label: "Spring system",
        left: "Octaspring foam-spring tech over a pocket-spring base",
        right: "Up to 5,000 individually pocketed aerocoil springs",
      },
      {
        label: "Price tier",
        left: "Premium, lower entry point of the two",
        right: "Flagship premium pricing",
      },
      {
        label: "Best for",
        left: "Hot sleepers wanting responsive relief at a lower premium price",
        right: "Sleepers wanting the most engineered all-rounder available",
      },
      {
        label: "Decision rule",
        left: "Choose this for premium cooling support at a friendlier price",
        right: "Choose this if you want maximum support, cooling and edge strength",
      },
    ],
    faq: [
      {
        question: "Is Dormeo or Simba better?",
        answer:
          "The Simba Hybrid Pro is better if reinforced edges and maximum engineered support are your priorities. The Dormeo Octasmart Hybrid is the stronger-value choice if you want premium cooling and responsive pressure relief at a lower price point.",
      },
      {
        question: "Which is cooler, Dormeo Octasmart or Simba Hybrid Pro?",
        answer:
          "Both are designed for hot sleepers. Dormeo combines breathable Octaspring foam-spring technology with Aerocell foam, while Simba uses graphite-infused Simbatex foam and an aerocoil spring system for active heat dissipation.",
      },
      {
        question: "Which is better for couples, Dormeo or Simba?",
        answer:
          "Both provide excellent motion isolation in our catalogue. Simba has the advantage for couples who use the full mattress width because it has reinforced edge support, while Dormeo uses standard edge support.",
      },
      {
        question: "Is the Simba Hybrid Pro worth paying more for than Dormeo Octasmart?",
        answer:
          "It can be if reinforced edges, stronger zoned support and a highly engineered all-round build matter most. Dormeo is likely the better value when cooling, motion isolation and responsive pressure relief are the main priorities.",
      },
    ],
    verdict:
      "The Dormeo Octasmart Hybrid delivers premium cooling support at a friendlier price, while the Simba Hybrid Pro is the pick if you want the most engineered, edge-strong all-rounder in the range.",
  },
];

export const mattressComparisonPageMap = Object.fromEntries(
  mattressComparisonPages.map((page) => [page.slug, page])
) as Record<string, MattressComparisonPage>;
