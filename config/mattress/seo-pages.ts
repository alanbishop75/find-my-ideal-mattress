/**
 * config/mattress/seo-pages.ts
 *
 * SEO landing page definitions for FindYourIdealMattress (UK market).
 *
 * Mattress now ships with a full long-tail content cluster, matching the
 * pattern used across the other product sites.
 * Each page follows the same quiz-first structure and is designed to route
 * users into /mattress/questionnaire after giving genuinely useful guidance.
 *
 * ──────────────────────────────────────────────────────────────────────────
 * TARGET KEYWORD CLUSTER — 8 pages (to be built post-launch)
 * ──────────────────────────────────────────────────────────────────────────
 *
 *   Sleep position cluster
 *     1. best-mattress-for-side-sleepers
 *     2. best-mattress-for-back-pain
 *
 *   Body type cluster
 *     3. best-mattress-for-heavy-people
 *     4. best-mattress-for-couples
 *
 *   Temperature / material cluster
 *     5. best-cooling-mattress
 *     6. best-hybrid-mattress
 *
 *   Budget cluster
 *     7. best-budget-mattress
 *     8. best-mattress-under-500
 */

export interface MattressSeoSection {
  h2: string;
  body: string;
  subsections?: { h3: string; body: string }[];
}

export interface MattressSeoPage {
  slug: string;
  keyword: string;
  metaTitle: string;
  metaDescription: string;
  h1: string;
  intro: string;
  whoItIsFor: string[];
  keyFactors: string[];
  sections: MattressSeoSection[];
  faq: { question: string; answer: string }[];
  relatedSlugs: string[];
  lastReviewed: string;
}

const lastReviewed = "2026-06-18";

// ──────────────────────────────────────────────────────────────────────────
// PAGE 1 — Best Mattress for Side Sleepers UK
// ──────────────────────────────────────────────────────────────────────────

const sideSleepersUk: MattressSeoPage = {
  slug: "best-mattress-for-side-sleepers",
  keyword: "best mattress for side sleepers",
  metaTitle: "Best Mattress for Side Sleepers 2026 - FindYourIdeal",
  metaDescription:
    "Side sleeping puts pressure on hips and shoulders — the wrong mattress makes it worse. Take our 2-minute quiz for a UK-matched recommendation.",
  h1: "Best Mattress for Side Sleepers (Guide)",
  intro:
    "Side sleeping is the most common position in the UK, but most mattresses are designed around back sleepers. The result: hip and shoulder pressure that builds through the night, leaving you stiff by morning. This guide explains exactly what side sleepers need from a mattress and how to find one that actually holds up.",
  whoItIsFor: [
    "You spend most of the night on your left or right side",
    "You wake with a sore hip, shoulder, or numb arm",
    "Your current mattress feels too firm for side sleeping",
    "You want to understand what actually matters before spending £400–£1,500",
  ],
  sections: [
    {
      h2: "Why side sleeping is harder on a mattress than any other position",
      body:
        "When you lie on your side, your hip and shoulder stick out further than the rest of your body. A mattress needs to let those pressure points sink in so your spine can stay neutral — if it does not, the firmness pushes back against the hip and shoulder joint all night. Back sleepers distribute weight more evenly, which is why a mattress that feels fine for one position can be genuinely uncomfortable for another.",
    },
    {
      h2: "The two properties that matter most",
      body: "Side sleepers need a mattress to do two distinct things well.",
      subsections: [
        {
          h3: "Pressure relief at the hips and shoulders",
          body:
            "This is the non-negotiable. A mattress needs enough give at those contact points to let them sink slightly without bottoming out. Memory foam and softer pocket-sprung surfaces do this best. A too-firm mattress keeps pressure concentrated at those joints all night.",
        },
        {
          h3: "Spinal support under the waist",
          body:
            "Pressure relief alone is not enough. The mattress also needs to support the waist so it does not sag downward, which would create a curve in the lumbar spine. The best side-sleeper mattresses combine a softer comfort layer with a firmer support core — often described as medium or medium-soft.",
        },
      ],
    },
    {
      h2: "Which firmness rating suits side sleepers",
      body:
        "Most side sleepers do best with a medium or medium-soft mattress (roughly 4–6 out of 10 on the standard firmness scale). Lighter sleepers often need softer to get enough pressure relief; heavier sleepers may need medium-firm so the comfort layer does not compress fully. There is no single right answer, which is why body weight matters as much as sleep position when matching a mattress.",
    },
    {
      h2: "Memory foam vs pocket sprung vs hybrid for side sleeping",
      body: "Each construction behaves differently under side-sleeping pressure.",
      subsections: [
        {
          h3: "Memory foam",
          body:
            "Contours closely around the hip and shoulder, distributing pressure across a wider surface. Good motion isolation for couples. Can sleep warm in cheaper versions — look for open-cell or gel-infused foam if temperature is a concern.",
        },
        {
          h3: "Pocket sprung",
          body:
            "Each spring moves independently, providing localised support. Naturally breathable. Softer tension ratings (soft or medium) work well for side sleepers; open coil mattresses are generally not well-suited because they cannot isolate pressure points.",
        },
        {
          h3: "Hybrid",
          body:
            "A pocket-sprung base with a foam or latex comfort layer. Combines the airflow of springs with the pressure relief of foam — often the most versatile choice for side sleepers who also share a bed.",
        },
      ],
    },
    {
      h2: "What side sleepers should avoid",
      body:
        "Very firm mattresses — marketed as 'orthopaedic' or 'extra firm' — are designed for back and front sleepers who need a flat surface. For a side sleeper they push directly into the hip and shoulder without giving way. Open-coil (or Bonnell spring) mattresses transfer movement across the whole surface and lack the independent pressure response that side sleeping needs. Neither is necessarily a bad product — they are just a poor fit for this position.",
    },
  ],
  keyFactors: [
    "Your body weight (affects how far you sink into a comfort layer)",
    "Whether you share the bed (motion isolation becomes more important)",
    "Temperature preference — foam retains more heat than springs",
    "Budget: strong UK options exist from £300 to £1,200",
    "Whether you also sleep on your back some of the night",
  ],
  faq: [
    {
      question: "What firmness is best for side sleepers?",
      answer:
        "Medium or medium-soft for most people. The mattress needs enough give to let the hip and shoulder sink slightly, but still enough support to keep the waist from sagging. Lighter sleepers may prefer softer; heavier sleepers often need medium-firm.",
    },
    {
      question: "Is memory foam or a spring mattress better for side sleeping?",
      answer:
        "Both can work. Memory foam contours more closely around pressure points. Pocket springs provide airflow and bounce. A hybrid combining both is often the best of both worlds for side sleepers, especially in couples.",
    },
    {
      question: "Can a mattress cause shoulder pain if I sleep on my side?",
      answer:
        "Yes. A too-firm mattress pushes back against the shoulder rather than letting it sink in, concentrating pressure on the joint all night. If you wake with shoulder pain that eases as the day goes on, mattress firmness is a likely contributor.",
    },
    {
      question: "How long should a mattress last?",
      answer:
        "Most manufacturers suggest 7–10 years. In practice, many mattresses lose meaningful support after 6–8 years. If you are waking stiffer than when you went to bed and the mattress is over six years old, it may be time to replace it.",
    },
  ],
  relatedSlugs: [
    "best-mattress-for-back-pain",
    "best-cooling-mattress",
    "best-hybrid-mattress",
  ],
  lastReviewed,
};

// ──────────────────────────────────────────────────────────────────────────
// PAGE 2 — Best Mattress for Back Pain UK
// ──────────────────────────────────────────────────────────────────────────

const backPainUk: MattressSeoPage = {
  slug: "best-mattress-for-back-pain",
  keyword: "best mattress for back pain",
  metaTitle: "Best Mattress for Back Pain 2026 - FindYourIdeal",
  metaDescription:
    "The wrong mattress can make back pain worse. Learn what to look for and take our 2-minute quiz to find a matched UK option.",
  h1: "Best Mattress for Back Pain (Guide)",
  intro:
    "A mattress does not cure back pain, but a poorly matched one can absolutely make it worse. The key is spinal alignment: your mattress needs to hold the spine in a neutral position across the whole night, regardless of whether you sleep on your back, side, or a mix of both. This guide covers what that means in practice and what to look for.",
  whoItIsFor: [
    "You wake with lower back stiffness that eases after 30–60 minutes",
    "Your back pain is worse on some days and you suspect your mattress is a factor",
    "You have been advised to consider your sleep setup by a GP or physio",
    "You want independent guidance rather than a retailer's recommendation",
  ],
  sections: [
    {
      h2: "What does 'good for back pain' actually mean?",
      body:
        "Marketing uses this phrase loosely, and the word 'orthopaedic' has no regulated meaning in the UK. What actually helps is a mattress that keeps your spine in alignment: the lumbar curve supported when you're on your back, the hip and shoulder allowed to sink when you're on your side, without any section of the spine sagging or being pushed upward. That requirement depends heavily on your weight, shape, and preferred sleep position — which is why there is no single mattress that is right for everyone with back pain.",
    },
    {
      h2: "How your sleep position changes what you need",
      body: "The optimal mattress differs by position.",
      subsections: [
        {
          h3: "Back sleepers",
          body:
            "The lumbar curve needs support so the lower back does not sag into the mattress. A medium or medium-firm surface usually works best. Too soft and the hips sink further than the shoulders, creating a hammock curve in the spine.",
        },
        {
          h3: "Side sleepers",
          body:
            "The hip and shoulder need to sink in enough to keep the spine level. A medium or medium-soft mattress is usually required. Too firm and pressure builds at those joints all night.",
        },
        {
          h3: "Combination sleepers",
          body:
            "The mattress needs to handle both scenarios. This is where hybrids (pocket springs with a foam or latex comfort layer) tend to excel — they respond more dynamically as you shift position than an all-foam mattress does.",
        },
      ],
    },
    {
      h2: "Why firmness is not the whole story",
      body:
        "A common piece of received wisdom says firm mattresses are better for backs. The evidence is more nuanced. A 2003 study published in The Lancet found that people with chronic non-specific low-back pain reported less pain and disability on medium-firm mattresses than firm ones. Very firm surfaces can push against the natural lumbar curve rather than supporting it. Very soft surfaces let the spine sag. The right answer for most people is somewhere in the medium range, adjusted for body weight and position.",
    },
    {
      h2: "Body weight and its effect on mattress choice",
      body:
        "A lighter person puts less load through the comfort layer and may need a softer mattress to get the same level of pressure relief. A heavier person compresses the comfort layer more quickly and may need a firmer or deeper mattress to reach the support core before the foam bottoms out. Standard medium mattresses are generally calibrated for people around 70–85 kg. Outside that range, the ratings become less reliable.",
    },
    {
      h2: "What to watch out for when shopping",
      body:
        "Avoid mattresses marketed solely as 'orthopaedic' without specification of spring count, foam density, or firmness rating. These terms are not regulated. Look instead for mattresses with clear construction information: comfort layer material and depth, support core type (pocket springs or foam), and an independent firmness rating. A 100-night trial or free returns policy is important because alignment problems often take a few weeks to become apparent.",
    },
  ],
  keyFactors: [
    "Your primary sleep position (back, side, combination)",
    "Body weight — affects how far you compress the comfort layer",
    "Whether the pain is worse in the morning or consistent through the day",
    "Any specific advice from a GP or physiotherapist",
    "Budget and trial period — essential when buying for a health concern",
  ],
  faq: [
    {
      question: "Is a firm mattress better for back pain?",
      answer:
        "Not necessarily. Research suggests medium-firm mattresses tend to suit most people with lower back pain better than very firm ones. The right firmness depends on your sleep position and body weight. A mattress that is too firm can push against the lumbar curve rather than supporting it.",
    },
    {
      question: "What does 'orthopaedic mattress' mean?",
      answer:
        "'Orthopaedic' is a marketing term with no regulated definition in the UK. It does not mean the mattress has been clinically tested or endorsed. Focus on construction details (spring count, foam density, firmness rating) rather than labels.",
    },
    {
      question: "How long does it take to know if a mattress is helping?",
      answer:
        "Most people need at least 3–4 weeks to adapt to a new mattress. A 100-night trial period is worth prioritising when you are buying specifically to address back pain, because the difference only becomes clear after your body has had time to adjust.",
    },
    {
      question: "Should I see a doctor before buying a new mattress?",
      answer:
        "If you have persistent or worsening back pain, a GP visit is sensible before making assumptions about the cause. A physiotherapist can often give more specific guidance on what mattress properties might help your particular situation.",
    },
  ],
  relatedSlugs: [
    "best-mattress-for-side-sleepers",
    "best-hybrid-mattress",
    "best-mattress-for-heavy-people",
  ],
  lastReviewed,
};

// ──────────────────────────────────────────────────────────────────────────
// PAGE 3 — Best Mattress for Heavy People UK
// ──────────────────────────────────────────────────────────────────────────

const heavyPeopleUk: MattressSeoPage = {
  slug: "best-mattress-for-heavy-people",
  keyword: "best mattress for heavy people",
  metaTitle: "Best Mattress for Heavy People 2026 - FindYourIdeal",
  metaDescription:
    "Heavier sleepers need deeper support and durable construction. Find a UK-matched mattress in 2 minutes.",
  h1: "Best Mattress for Heavier Sleepers (Guide)",
  intro:
    "Standard mattresses are generally calibrated for people around 70–85 kg. If you are significantly above that range, the same mattress behaves differently: comfort layers compress further, edges sag sooner, and support core ratings become less reliable. This guide covers what changes — and what to look for — when choosing a mattress as a heavier sleeper.",
  whoItIsFor: [
    "You weigh over 100 kg and find most mattresses compress too quickly",
    "Your mattress edge sags when you sit on it to get in or out of bed",
    "You wake with pressure points despite the mattress feeling soft enough initially",
    "You want a mattress that will hold its support for the long term",
  ],
  sections: [
    {
      h2: "Why heavier sleepers need a different specification",
      body:
        "Weight affects every layer of a mattress. A comfort layer that provides 8 cm of give for an average-weight sleeper may compress fully for a heavier person, leaving them effectively sleeping on the support core — which is harder and less contoured. Edge support also degrades faster when more load is placed on it. This is not a design flaw; standard mattresses are simply not built for the top end of the weight range.",
    },
    {
      h2: "Key specification differences to look for",
      body: "Three things change when the weight requirement is higher.",
      subsections: [
        {
          h3: "Higher foam density in the comfort layer",
          body:
            "Foam density (measured in kg/m³) determines how well it holds its shape under repeated compression. Low-density foam (under 30 kg/m³) can develop body impressions quickly under heavy use. Look for comfort foam at 40 kg/m³ or above, or a latex comfort layer, which is naturally more resilient.",
        },
        {
          h3: "Higher spring count or heavier gauge springs",
          body:
            "For pocket-sprung or hybrid mattresses, a higher spring count or heavier wire gauge means more resistance per unit area. Some manufacturers produce specific 'heavy duty' or 'reinforced' variants; these are worth comparing against the standard version.",
        },
        {
          h3: "Deeper total mattress depth",
          body:
            "A mattress of 25–30 cm or more gives more room in the support core before bottoming out. Thinner mattresses (under 20 cm) are rarely suitable for heavier sleepers over extended use.",
        },
      ],
    },
    {
      h2: "Edge support matters more than people realise",
      body:
        "Heavier sleepers put more load on the mattress edges — getting in and out of bed, sitting on the side at night. A mattress with poor edge support compresses significantly at the perimeter, which shrinks the usable sleeping surface and can cause a feeling of rolling off the side. Reinforced edge support (a firmer foam border around the perimeter springs) is worth specifically checking for.",
    },
    {
      h2: "Firmness rating adjustments",
      body:
        "A 'medium' mattress calibrated for average weights will feel softer to a heavier person because more of the comfort layer is engaged. If you are used to choosing medium, consider trying medium-firm or firm — the effective feel will often be closer to what you expected from medium. This is one reason in-store trials can be misleading: the salesperson's experience of 'medium' may not match yours.",
    },
    {
      h2: "Durability and long-term value",
      body:
        "A mattress that compresses unevenly within 2–3 years is not a saving. Spending more on higher-density foam and a better spring system tends to extend usable life significantly. Look for at least a 10-year guarantee from the manufacturer, and check whether the guarantee covers body impressions of a specified depth (typically 1.5–2 cm).",
    },
  ],
  keyFactors: [
    "Your body weight and whether you are above the standard range",
    "Foam density in the comfort layer (40 kg/m³ or above is a useful benchmark)",
    "Total mattress depth (25 cm or more recommended)",
    "Edge support quality",
    "Manufacturer guarantee length and what it covers",
  ],
  faq: [
    {
      question: "What weight limit should I look for in a mattress?",
      answer:
        "Most standard double and king mattresses list a weight limit of 120–140 kg per person. Look for this in the product specification. If you are near or above that limit, seek out mattresses with a higher stated capacity or those marketed specifically for heavier sleepers.",
    },
    {
      question: "Does a firmer mattress last longer for heavier people?",
      answer:
        "Firmness and durability are different things. A high-density foam in a medium or medium-firm mattress will outlast a low-density foam in a firm mattress. Focus on foam density and spring quality rather than firmness rating alone.",
    },
    {
      question: "Are reinforced mattresses significantly more expensive?",
      answer:
        "Often yes, by 20–40% over a comparable standard mattress. The longer usable lifespan tends to make them better value over 8–10 years than replacing a cheaper mattress every 3–4 years.",
    },
    {
      question: "Is a memory foam mattress suitable for heavier sleepers?",
      answer:
        "Memory foam can work well if the density is high enough. Low-density memory foam (under 50 kg/m³) tends to develop body impressions quickly under heavier loads. High-density options or hybrid mattresses (springs plus foam) are usually more durable.",
    },
  ],
  relatedSlugs: [
    "best-mattress-for-back-pain",
    "best-hybrid-mattress",
    "best-budget-mattress",
  ],
  lastReviewed,
};

// ──────────────────────────────────────────────────────────────────────────
// PAGE 4 — Best Mattress for Couples UK
// ──────────────────────────────────────────────────────────────────────────

const couplesUk: MattressSeoPage = {
  slug: "best-mattress-for-couples",
  keyword: "best mattress for couples",
  metaTitle: "Best Mattress for Couples 2026 - FindYourIdeal",
  metaDescription:
    "Couples often have different needs from a mattress. Learn how to find a UK option that works for both of you.",
  h1: "Best Mattress for Couples (Guide)",
  intro:
    "Buying a mattress as a couple is harder than buying one for yourself, because two people sharing a bed often have different weights, sleep positions, and temperature preferences. The best mattress for couples is one that handles motion transfer well, suits both body profiles, and does not create a compromise that neither person is happy with.",
  whoItIsFor: [
    "You and your partner have different sleep positions or firmness preferences",
    "Your movements during the night disturb your partner",
    "One of you sleeps significantly warmer than the other",
    "You want to make a considered joint decision rather than guessing",
  ],
  sections: [
    {
      h2: "Motion isolation: the most important property for shared beds",
      body:
        "When one person moves or gets up in the night, how much disturbance does the other feel? Open-coil spring mattresses transfer movement across the whole surface — a heavy roll or getting out of bed can wake a light sleeper. Pocket springs, where each spring moves independently, reduce this significantly. Memory foam reduces it further still. Hybrid mattresses (pocket springs with foam) are a good middle ground: better motion isolation than a traditional spring mattress, with more bounce and airflow than all-foam.",
    },
    {
      h2: "Different firmness needs",
      body: "If two people have meaningfully different firmness preferences, there are practical options.",
      subsections: [
        {
          h3: "Zoned or dual-tension mattresses",
          body:
            "Some manufacturers offer zip-and-link mattresses with different firmness on each half. They join seamlessly in use. This is worth considering if the two of you differ by more than two positions on the firmness scale.",
        },
        {
          h3: "A medium that works for both",
          body:
            "For couples with broadly similar weights and positions, a medium or medium-firm mattress tends to be the best shared compromise. It provides enough pressure relief for a side sleeper without being too soft to support a back sleeper.",
        },
      ],
    },
    {
      h2: "Temperature differences between partners",
      body:
        "It is common for one partner to sleep warmer than the other. Memory foam retains more heat than springs or latex. If one person consistently runs warm, a hybrid or latex mattress with a breathable cover tends to regulate temperature better than an all-foam option. Some couples find that separate duvets — each chosen for individual temperature preference — solve as much of the problem as the mattress itself.",
    },
    {
      h2: "Mattress size: getting it right for two",
      body:
        "A standard double (135 × 190 cm) gives each person roughly the same width as a single bed. For most adults sharing a bed long-term, a king (150 × 200 cm) or super king (180 × 200 cm) is noticeably more comfortable. The extra width is often more valuable than any mattress specification change, especially if one or both partners move a lot in the night.",
    },
    {
      h2: "Edge support for couples",
      body:
        "When two people share a bed, they tend to use the full width of the mattress — including the edges. Good edge support means you can sleep close to the side without feeling like you might roll off, and the mattress perimeter holds up over time rather than sagging unevenly.",
    },
  ],
  keyFactors: [
    "Motion isolation — critical if one partner is a light sleeper",
    "Whether you have different firmness or temperature needs",
    "Mattress size — king or super king is often worth the investment",
    "Edge support for full use of the sleeping surface",
    "Budget per person — couples mattresses are often better value per head than two singles",
  ],
  faq: [
    {
      question: "What is the best type of mattress for couples?",
      answer:
        "Pocket-sprung or hybrid mattresses tend to work best for most couples: good motion isolation, airflow, and enough versatility to suit different sleep positions. All-foam mattresses offer even better motion isolation but can sleep warmer.",
    },
    {
      question: "Should couples get a king or super king mattress?",
      answer:
        "A king (150 × 200 cm) is a significant step up from a double and suits most couples well. A super king (180 × 200 cm) is the most spacious option and is especially worth considering if either partner moves a lot or is a larger frame.",
    },
    {
      question: "What if we have completely different firmness preferences?",
      answer:
        "A zip-and-link mattress with different tensions on each half is the most practical solution. These are sold by several UK manufacturers and are designed to join invisibly in use. The alternative is finding a medium that both people can tolerate — which is possible if preferences are within two firmness steps of each other.",
    },
    {
      question: "Does memory foam solve motion transfer for couples?",
      answer:
        "Memory foam has excellent motion isolation — movements on one side of the bed barely register on the other. The trade-off is heat retention and less bounce when moving position. If both partners sleep warm, a hybrid is usually a better compromise.",
    },
  ],
  relatedSlugs: [
    "best-cooling-mattress",
    "best-hybrid-mattress",
    "best-mattress-for-side-sleepers",
  ],
  lastReviewed,
};

// ──────────────────────────────────────────────────────────────────────────
// PAGE 5 — Best Cooling Mattress UK
// ──────────────────────────────────────────────────────────────────────────

const coolingUk: MattressSeoPage = {
  slug: "best-cooling-mattress",
  keyword: "best cooling mattress",
  metaTitle: "Best Cooling Mattress 2026 - FindYourIdeal",
  metaDescription:
    "If you sleep hot, your mattress may be the cause. Find out what actually helps and get a UK-matched recommendation.",
  h1: "Best Cooling Mattress (Guide)",
  intro:
    "Sleeping hot disrupts sleep quality even when you do not fully wake up. If you regularly throw the duvet off in the night, wake sweating, or feel uncomfortably warm by 3am, your mattress construction is often a bigger factor than the room temperature. This guide explains which mattress properties genuinely help with heat regulation — and which marketing claims to ignore.",
  whoItIsFor: [
    "You regularly wake feeling too warm during the night",
    "You push the duvet off or sleep with a leg out to stay cool",
    "Your partner says you radiate heat in bed",
    "You want to understand what 'cooling' mattress features actually do",
  ],
  sections: [
    {
      h2: "Why some mattresses sleep hot",
      body:
        "Heat retention in a mattress comes primarily from two sources: the materials used and how well air can circulate through them. Dense, closed-cell foam absorbs body heat and holds it close to the surface. Traditional memory foam is the most common offender — its viscoelastic structure wraps closely around the body, which is great for pressure relief but limits airflow. The deeper you sink into the foam, the more surface area is in contact with your body, and the more heat is retained.",
    },
    {
      h2: "Which mattress types sleep coolest",
      body: "Different constructions vary significantly in how much heat they retain.",
      subsections: [
        {
          h3: "Pocket springs",
          body:
            "The air gaps between springs allow passive ventilation throughout the mattress. A pocket-sprung mattress with a breathable comfort layer and a natural-fibre cover is typically the coolest option available. The main limitation is that spring mattresses without a foam comfort layer offer less pressure relief.",
        },
        {
          h3: "Latex",
          body:
            "Natural latex is inherently cooler than memory foam because it does not respond to heat in the same way. It also has an open-cell structure with pinholes added during manufacture that promote airflow. Latex sleeps noticeably cooler than most memory foam and is a good choice for warm sleepers who want contouring without heat retention.",
        },
        {
          h3: "Hybrid (springs + foam or latex)",
          body:
            "The pocket-spring base promotes airflow from below while the foam or latex comfort layer provides pressure relief at the surface. A hybrid is generally cooler than an all-foam mattress of similar thickness, making it the most practical all-round option for warm sleepers who also need pressure relief.",
        },
        {
          h3: "Gel-infused memory foam",
          body:
            "Gel particles are added to memory foam to draw heat away from the surface. In practice, they absorb heat initially but reach equilibrium fairly quickly. Gel foam sleeps cooler than standard memory foam at first, but the difference diminishes over the course of the night for very warm sleepers.",
        },
      ],
    },
    {
      h2: "Cover materials and their effect on surface temperature",
      body:
        "The mattress cover is in direct contact with your body (or your sheet). A tightly woven polyester cover traps heat regardless of what is underneath. Natural fibres — wool, cotton, and Tencel — wick moisture and breathe more effectively. Some covers incorporate phase-change materials (PCMs) that absorb latent heat as they transition from solid to liquid at skin temperature. PCM covers can make a noticeable difference for moderately warm sleepers.",
    },
    {
      h2: "Other factors that affect sleep temperature",
      body:
        "The mattress is often one of several factors. A 13.5 tog duvet used year-round, a very warm room, or a polyester mattress protector can each undermine a cooler mattress choice. For the warmest sleepers, addressing the full sleep environment — lower duvet tog, natural-fibre bedding, room ventilation — often makes a bigger difference than the mattress alone. But if your current mattress is dense all-foam, switching to a hybrid or latex is still likely to help.",
    },
  ],
  keyFactors: [
    "Your natural sleep temperature — do you always sleep hot or only in summer",
    "Whether you share the bed (partners often run at different temperatures)",
    "Current mattress type — switching from all-foam has the highest impact",
    "Budget: open-cell and latex options cost more than gel-foam alternatives",
    "Bedding setup: cover material and duvet tog rating also matter",
  ],
  faq: [
    {
      question: "Does a cooling mattress really make a difference?",
      answer:
        "Yes, if you are switching from a dense all-foam mattress. The difference between sleeping on closed-cell memory foam and a breathable hybrid or latex surface is measurable in surface temperature and perceived comfort. For people who currently sleep hot, it is often one of the most impactful changes they can make.",
    },
    {
      question: "Is latex cooler than memory foam?",
      answer:
        "Generally yes. Natural latex has an open-cell structure and is manufactured with pinholes to promote airflow. It does not respond to body heat the way memory foam does, so it does not trap heat against the body in the same way.",
    },
    {
      question: "Are gel mattresses worth it for hot sleepers?",
      answer:
        "Gel-infused foam sleeps cooler than standard memory foam, particularly in the first few hours. However, the gel reaches thermal equilibrium over time, so very warm sleepers may find the benefit wears off through the night. A hybrid or latex mattress tends to provide more consistent cooling.",
    },
    {
      question: "What duvet should I use with a cooling mattress?",
      answer:
        "A lower tog duvet (4.5–7 tog for year-round use if you run warm) and a natural-fibre cover (cotton, wool, or bamboo) help the most. A cooling mattress paired with a synthetic 13.5 tog duvet will still cause overheating for most warm sleepers.",
    },
  ],
  relatedSlugs: [
    "best-mattress-for-couples",
    "best-hybrid-mattress",
    "best-mattress-for-side-sleepers",
  ],
  lastReviewed,
};

// ──────────────────────────────────────────────────────────────────────────
// PAGE 6 — Best Hybrid Mattress UK
// ──────────────────────────────────────────────────────────────────────────

const hybridUk: MattressSeoPage = {
  slug: "best-hybrid-mattress",
  keyword: "best hybrid mattress",
  metaTitle: "Best Hybrid Mattress 2026 - FindYourIdeal",
  metaDescription:
    "Hybrid mattresses combine springs and foam for a balanced feel. Find the right UK option for your sleep style in 2 minutes.",
  h1: "Best Hybrid Mattress (Guide)",
  intro:
    "Hybrid mattresses combine a pocket-sprung support core with one or more foam or latex comfort layers. The result is a mattress that aims to give you the pressure relief and contouring of foam without the heat retention and lack of bounce associated with all-foam designs. This guide explains when a hybrid is the right choice — and when another type might serve you better.",
  whoItIsFor: [
    "You want more pressure relief than a traditional spring mattress but find all-foam too warm",
    "You share a bed and need a balance of motion isolation and bounce",
    "You change position during the night and find memory foam too slow to respond",
    "You want a versatile mattress that works across different sleep positions",
  ],
  sections: [
    {
      h2: "What makes a hybrid different",
      body:
        "A true hybrid mattress has a substantial pocket-spring base — typically 1,000 springs or more in a king size — topped with at least 5–8 cm of foam, latex, or micro-springs as a comfort layer. The pocket springs provide airflow, responsiveness, and edge support. The comfort layer provides the contouring and pressure relief that springs alone cannot deliver. The best hybrids integrate these two systems so each layer does its job without compromising the other.",
    },
    {
      h2: "Hybrid vs all-foam vs pocket sprung: how to choose",
      body: "Each construction has a different trade-off profile.",
      subsections: [
        {
          h3: "Hybrid vs all-foam",
          body:
            "All-foam mattresses have better motion isolation and are often cheaper at a given firmness rating. Hybrids sleep cooler, have more bounce (easier to move position), and tend to be more durable over time because the spring system maintains structure even as the foam softens with age.",
        },
        {
          h3: "Hybrid vs traditional pocket sprung",
          body:
            "A pocket-sprung mattress without a substantial foam comfort layer provides good support and airflow but limited pressure relief. A hybrid adds that pressure relief layer, making it more suitable for side sleepers, people with joint pain, or anyone who benefits from contouring.",
        },
      ],
    },
    {
      h2: "Comfort layer options and what they mean",
      body: "The foam or latex layer on top significantly affects how the mattress feels.",
      subsections: [
        {
          h3: "Memory foam comfort layer",
          body:
            "Contours closely, slow to respond to movement, good for pressure point relief. Tends to retain more heat than latex. Works well for single sleepers or couples who both prefer a moulded feel.",
        },
        {
          h3: "Latex comfort layer",
          body:
            "Naturally cooler than memory foam, more responsive (springier), and longer-lasting. Natural latex is more breathable; synthetic latex costs less but performs less well over time. A good choice for warm sleepers or anyone who found memory foam too slow.",
        },
        {
          h3: "Reflex or HR foam comfort layer",
          body:
            "A firmer foam that provides a more traditional spring-mattress feel with added cushioning. Less contouring than memory foam or latex, but very durable. Often found in hybrids in the medium-firm to firm range.",
        },
      ],
    },
    {
      h2: "Spring count and what it means for quality",
      body:
        "Higher spring counts generally indicate finer, more individually-responsive springs that adapt better to body contours. As a rough benchmark, 1,000 springs in a king is a reasonable minimum for a quality hybrid; 1,500–2,000 springs provides a noticeably more precise response. Very high counts (3,000+) exist but the incremental improvement diminishes. Spring gauge (thickness of wire) also matters: a heavier gauge spring is more supportive and often more durable.",
    },
    {
      h2: "Are hybrids worth the extra cost?",
      body:
        "Hybrids are often priced £100–£400 more than a comparable all-foam mattress. The case for paying more is strongest if you sleep hot, share the bed with a partner who moves around, or have previously found all-foam mattresses too slow and warm. For a light, solo sleeper who sleeps cold and lies still all night, a quality all-foam or pocket-sprung mattress may be a better use of budget.",
    },
  ],
  keyFactors: [
    "Sleep position — hybrids suit a wide range but especially combination sleepers",
    "Temperature — the main reason most people choose hybrid over all-foam",
    "Whether you share the bed",
    "Comfort layer preference: latex vs memory foam vs reflex",
    "Budget: quality hybrids start around £500 for a king",
  ],
  faq: [
    {
      question: "What is a hybrid mattress?",
      answer:
        "A hybrid mattress combines a pocket-spring support core with one or more foam or latex comfort layers. The springs provide structure, airflow, and bounce; the comfort layer provides pressure relief and contouring. A mattress with fewer than 1,000 springs in a king is often described as hybrid but may be closer to a spring mattress with a foam topper.",
    },
    {
      question: "Are hybrid mattresses good for back pain?",
      answer:
        "They can be, especially for combination sleepers who need a mattress that adapts to multiple positions. The pocket-spring base supports the lumbar spine; the comfort layer allows the hip and shoulder to sink slightly when on your side. Medium-firm hybrids are often recommended for lower back pain.",
    },
    {
      question: "How long do hybrid mattresses last?",
      answer:
        "A well-made hybrid with a high-density comfort layer and quality springs should last 8–10 years. The comfort layer typically softens before the spring core fails. Rotating the mattress every 3–6 months helps even out wear.",
    },
    {
      question: "Is latex or memory foam better in a hybrid mattress?",
      answer:
        "Latex sleeps cooler and is more responsive (easier to change position). Memory foam contours more closely and absorbs movement better. If you sleep warm or move frequently, latex is usually the better comfort layer. If you want maximum pressure relief and sleep at a normal temperature, memory foam works well.",
    },
  ],
  relatedSlugs: [
    "best-mattress-for-back-pain",
    "best-cooling-mattress",
    "best-mattress-for-couples",
  ],
  lastReviewed,
};

// ──────────────────────────────────────────────────────────────────────────
// PAGE 7 — Best Budget Mattress UK
// ──────────────────────────────────────────────────────────────────────────

const budgetUk: MattressSeoPage = {
  slug: "best-budget-mattress",
  keyword: "best budget mattress",
  metaTitle: "Best Budget Mattress 2026 - FindYourIdeal",
  metaDescription:
    "You do not need to spend a fortune to sleep well. Find the best-value UK mattress for your needs in 2 minutes.",
  h1: "Best Budget Mattress UK (Under £400 Guide)",
  intro:
    "There is a large gap between the cheapest mattress on the market and a quality budget option that will give you comfortable, supported sleep for several years. This guide explains where that line sits, what you should not compromise on even at lower prices, and what you can reasonably trade off to keep the cost down.",
  whoItIsFor: [
    "You need a new mattress but have a firm upper limit on what you can spend",
    "You are furnishing a guest room or a child's room and want good value",
    "You are unconvinced you need to spend over £500 and want to understand why",
    "You want to know which budget options are genuinely usable long-term",
  ],
  sections: [
    {
      h2: "What you can and cannot get at budget price points",
      body:
        "A budget mattress (under £300–400 for a double) will typically have a lower foam density, a lower spring count, a thinner comfort layer, or some combination of these. The gap in performance compared to mid-range mattresses is real, but it is also manageable if you know what to prioritise.",
    },
    {
      h2: "What to prioritise at budget price points",
      body: "Some properties matter more than others when the budget is limited.",
      subsections: [
        {
          h3: "Avoid open-coil springs",
          body:
            "Open-coil (or Bonnell spring) mattresses are the cheapest to produce. All springs are connected, so movement transfers across the whole surface and pressure relief is uneven. Even at budget prices, a pocket-sprung option is a meaningful step up. Some manufacturers produce budget pocket-sprung mattresses at similar price points.",
        },
        {
          h3: "Check foam density if buying foam",
          body:
            "The difference between a 25 kg/m³ foam mattress and a 35 kg/m³ one is mostly felt after 18 months when the cheaper version has started to sag. If the density is not stated in the specification, ask before buying.",
        },
        {
          h3: "Prioritise the right firmness over features",
          body:
            "A budget mattress in the right firmness for your position and weight will outperform an expensive mattress in the wrong firmness. Get this right first, then work within your price range.",
        },
      ],
    },
    {
      h2: "Where budget mattresses cut corners (and whether it matters)",
      body:
        "At lower price points, manufacturers typically reduce spring count, foam density, comfort layer depth, cover quality, and edge support. Of these, foam density and spring count matter most for long-term support. Cover quality and edge support matter less for solo sleepers who do not sit on the edge; they matter more for couples or heavier sleepers.",
    },
    {
      h2: "Guest room vs everyday use",
      body:
        "A budget mattress used a few nights a month in a guest room can last 10+ years. The same mattress used every night by two adults may show wear within 3–4 years. Matching the specification to the actual usage pattern is more important than price. For a master bedroom used every night, the mid-range (£400–700) is often worth the step up.",
    },
    {
      h2: "Getting value from the UK market",
      body:
        "UK retailers regularly run substantial discounts — 30–50% off listed prices. These are often permanent promotional prices rather than genuine reductions. Comparing mattresses at their discounted price gives a more accurate picture of the actual market. Look for manufacturers with transparent pricing, a reasonable trial period (60 nights minimum), and a clear returns process.",
    },
  ],
  keyFactors: [
    "How often the mattress will be used (guest room vs every night)",
    "Your weight and sleep position — affects how quickly budget foams compress",
    "Spring type: pocket springs are worth paying a small premium for even at budget prices",
    "Foam density if buying foam-based: 35 kg/m³ or above for everyday use",
    "Trial period and returns policy",
  ],
  faq: [
    {
      question: "How much should I spend on a mattress?",
      answer:
        "For a mattress used every night as a primary bed, £350–600 for a double gets you into the range where quality pocket springs and reasonable foam density are achievable. Below £250, the most common issue is foam that compresses too quickly. Above £700, diminishing returns set in for most sleepers.",
    },
    {
      question: "Are cheap mattresses bad for your back?",
      answer:
        "A cheap mattress that provides the right firmness and holds its shape is not inherently bad for your back. The main risk with very cheap mattresses is loss of support over time as low-density foam develops body impressions. Poor support that develops gradually is easy to miss until back pain arrives.",
    },
    {
      question: "Is a memory foam mattress cheaper than a spring mattress?",
      answer:
        "At entry level, foam-only mattresses are often cheaper to produce than pocket-sprung options. However, very cheap foam is also lower density and wears out faster. A budget pocket-sprung mattress often provides better long-term value than the same-priced foam option.",
    },
    {
      question: "Can I get a decent mattress for under £300?",
      answer:
        "Yes, for light use or a guest room. For a primary bed used every night by an adult of average weight, the £300–400 range is a more realistic minimum for a mattress that will hold up for 5+ years.",
    },
  ],
  relatedSlugs: [
    "best-mattress-under-500",
    "best-hybrid-mattress",
    "best-mattress-for-heavy-people",
  ],
  lastReviewed,
};

// ──────────────────────────────────────────────────────────────────────────
// PAGE 8 — Best Mattress Under £500 UK
// ──────────────────────────────────────────────────────────────────────────

const under500Uk: MattressSeoPage = {
  slug: "best-mattress-under-500",
  keyword: "best mattress under 500",
  metaTitle: "Best Mattress Under £500 2026 - FindYourIdeal",
  metaDescription:
    "A £500 budget gets you into quality territory. Find the best UK mattress at this price point for your sleep style.",
  h1: "Best Mattress Under £500 (Guide)",
  intro:
    "Five hundred pounds is a meaningful budget for a mattress — enough to access genuine pocket-spring construction, decent foam density, and trial periods that give you time to be sure. This guide covers what the £300–500 UK market actually offers and how to make a well-informed choice within it.",
  whoItIsFor: [
    "You have set a budget of around £500 for a new mattress",
    "You want to understand what this budget realistically gets you in the UK market",
    "You are upgrading from a cheap mattress and want to get it right this time",
    "You want a quality everyday mattress without paying premium brand prices",
  ],
  sections: [
    {
      h2: "What £300–500 gets you in the UK market",
      body:
        "This price range is the sweet spot for everyday mattresses in the UK. At £300+, you can reliably access pocket-sprung construction with 600–1,000 springs in a double or king, foam densities in the 35–40 kg/m³ range, and 25+ cm total depth. At £400–500, quality hybrid options (pocket springs with a foam comfort layer) become available — these represent a significant step up from basic open-coil or low-density foam products.",
    },
    {
      h2: "Pocket spring vs hybrid at this price point",
      body: "The main choice within this budget is between a traditional pocket-sprung mattress and an entry-level hybrid.",
      subsections: [
        {
          h3: "Pocket sprung (£300–450)",
          body:
            "A pocket-sprung mattress with a natural-fibre or foam comfort layer is the most widely available option in this range. It offers good support, airflow, and durability. The main limitation is that the comfort layer may be thinner than on higher-priced options — which matters more for side sleepers or heavier people.",
        },
        {
          h3: "Entry-level hybrid (£400–500)",
          body:
            "At the upper end of this budget, hybrid mattresses combining pocket springs with a memory foam or reflex foam comfort layer become accessible. These offer better pressure relief than a comparable traditional spring mattress, with the airflow advantage of springs over all-foam. Worth prioritising if you are a side sleeper or sleep warm.",
        },
      ],
    },
    {
      h2: "Trial periods and returns",
      body:
        "The £300–500 range includes many online-first brands that offer 100-night trial periods with free collection if you are not satisfied. This is genuinely useful at any price point but especially here: comfort preferences are personal and a few minutes in a showroom cannot tell you how a mattress performs over a full night. Prioritise brands that offer a meaningful trial rather than a very short one (under 30 nights is not enough time to adapt).",
    },
    {
      h2: "Sale prices and how the UK market works",
      body:
        "Many UK mattress retailers list a 'was' price alongside a permanent sale price. The Advertising Standards Authority has investigated some of these practices, and many 'half price' mattresses were never regularly sold at the original price. The most reliable comparison is the current asking price against other mattresses with similar specifications — not the claimed original price. Which?, Sleep Foundation, and independent reviews are more reliable sources of relative value than retailer-generated comparisons.",
    },
    {
      h2: "Pairing with the right bed frame",
      body:
        "A good mattress on the wrong base will underperform. Slatted bases should have slats no more than 8 cm apart, or the mattress may sag between them. Solid divan bases are compatible with most mattresses but reduce airflow underneath. Platform tops (solid divan tops) are specifically designed for mattresses that would otherwise need a slatted base. Check the manufacturer's base recommendations before buying.",
    },
  ],
  keyFactors: [
    "Your sleep position and weight — determines whether you need extra comfort depth",
    "Whether you are a sole or shared-bed sleeper",
    "Spring type preference: pocket spring only vs hybrid with foam layer",
    "Trial period and returns policy",
    "Bed base compatibility",
  ],
  faq: [
    {
      question: "Is £500 enough to get a good mattress in the UK?",
      answer:
        "Yes. At £400–500 you can access quality pocket-sprung and entry-level hybrid mattresses from established UK brands. The main thing you miss compared to premium options (£700+) is spring count, deeper comfort layers, and higher-grade latex — improvements that matter most for heavier sleepers or those with specific pressure-relief needs.",
    },
    {
      question: "Which UK mattress brands offer the best value around £500?",
      answer:
        "Several direct-to-consumer brands offer strong value at this price point by removing retail margin. Our quiz compares verified UK options on Amazon against your specific requirements, which gives you a more personalised shortlist than a generic top-10 list.",
    },
    {
      question: "Should I buy a mattress online or in a store at this price?",
      answer:
        "Online-first brands at this price often offer better specification for the money and longer trial periods than in-store equivalents. The main advantage of in-store is touching the mattress before buying — though a few minutes lying down in a showroom is a poor substitute for sleeping on it for several weeks.",
    },
    {
      question: "Is it worth spending more than £500?",
      answer:
        "For most sleepers of average weight and standard sleep positions, a well-chosen £400–500 mattress is difficult to meaningfully improve on. Spending more makes most sense if you are significantly above average weight, have specific health requirements, or want a luxury latex or high-spring-count hybrid.",
    },
  ],
  relatedSlugs: [
    "best-budget-mattress",
    "best-hybrid-mattress",
    "best-mattress-for-side-sleepers",
  ],
  lastReviewed,
};

// ──────────────────────────────────────────────────────────────────────────
// Export
// ──────────────────────────────────────────────────────────────────────────

export const mattressSeoPages: MattressSeoPage[] = [
  sideSleepersUk,
  backPainUk,
  heavyPeopleUk,
  couplesUk,
  coolingUk,
  hybridUk,
  budgetUk,
  under500Uk,
];

export const mattressSeoPageMap: Record<string, MattressSeoPage> = Object.fromEntries(
  mattressSeoPages.map((p) => [p.slug, p])
);
