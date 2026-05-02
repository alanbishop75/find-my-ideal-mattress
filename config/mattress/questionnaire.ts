/**
 * config/mattress/questionnaire.ts
 *
 * Mattress recommendation questionnaire — mattress-v1
 *
 * Designed with input from three expert perspectives:
 *
 *  • Sleep physiotherapy — sleep position drives spinal alignment requirements
 *    more than any other factor. Side sleepers need a mattress that relieves
 *    shoulder and hip pressure; back sleepers need lumbar support; stomach
 *    sleepers need a firmer surface to prevent lumbar hyperextension.
 *
 *  • Materials science — pocket springs provide targeted support, bounce, and
 *    airflow. Memory foam contours and absorbs motion but retains heat.
 *    Hybrid (springs + foam comfort layers) combines the benefits of both.
 *    Latex is resilient, breathable, and naturally hypoallergenic.
 *
 *  • Consumer insight — UK buyers spend on average £300–£700 for a Double
 *    mattress. Boxed mattresses (Emma, Simba, Nectar) dominate online search.
 *    Trials periods (100–365 nights) are a key purchase driver in 2026.
 *    Body weight, partner sharing, and back pain are the three highest-intent
 *    signals from UK buyer research.
 */
import type { Questionnaire } from "../../core/types";

export const mattressQuestionnaire: Questionnaire = {
  id: "mattress-v1",
  version: "mattress-v1",
  title: "Find Your Ideal Mattress",
  questions: [
    // ── Q1 — Sleep position ──────────────────────────────────────────────────
    // Primary signal: drives firmness, support profile, and pressure relief.
    // Side sleepers need pressure relief at shoulder and hip; back sleepers need
    // lumbar support; stomach sleepers need a firm surface; combination sleepers
    // need a responsive, medium mattress that moves with them.
    {
      id: "sleep-position",
      text: "How do you mainly sleep?",
      helpText: "Choose the position you spend most of the night in.",
      options: [
        { id: "side",        label: "On my side" },
        { id: "back",        label: "On my back" },
        { id: "stomach",     label: "On my front / stomach" },
        { id: "combination", label: "I switch positions through the night" },
      ],
    },

    // ── Q2 — Body weight ─────────────────────────────────────────────────────
    // Weight affects how far a person sinks into a mattress. Heavy sleepers
    // compress soft foam excessively and need stronger support (pocket springs
    // or hybrid). Light sleepers may not fully engage firm mattresses.
    {
      id: "body-weight",
      text: "What's your approximate body weight?",
      helpText: "This helps match the mattress firmness and support core to your needs.",
      options: [
        { id: "light",   label: "Light — under 70 kg (11 stone)" },
        { id: "average", label: "Average — 70–100 kg (11–16 stone)" },
        { id: "heavy",   label: "Heavy — over 100 kg (16 stone+)" },
      ],
    },

    // ── Q3 — Partner sharing ─────────────────────────────────────────────────
    // Shared mattresses need good edge support (so neither partner rolls off)
    // and excellent motion isolation (so one partner's movement doesn't
    // wake the other). Memory foam and hybrid tend to outperform open-coil
    // springs for couples.
    {
      id: "sleep-partner",
      text: "Do you share your mattress with a partner?",
      options: [
        { id: "solo",    label: "No — I sleep alone" },
        { id: "partner", label: "Yes — I share with a partner" },
      ],
    },

    // ── Q4 — Pain points ─────────────────────────────────────────────────────
    // Back pain is the leading purchase driver for new mattresses in the UK.
    // Joint or pressure-point pain typically benefits from pressure-relieving
    // comfort layers (memory foam, latex, soft hybrid). Back pain often needs a
    // firmer lumbar zone. "None" steers toward personal preference signals.
    {
      id: "pain-points",
      text: "Do you experience any discomfort related to how you sleep?",
      helpText: "Select the most relevant option — it helps us prioritise support.",
      options: [
        { id: "none",            label: "No — I generally sleep comfortably" },
        { id: "back-pain",       label: "Back pain — especially lower back" },
        { id: "joint-pain",      label: "Joint or hip pain — pressure points" },
        { id: "pressure-points", label: "Shoulder or neck stiffness on waking" },
      ],
    },

    // ── Q5 — Sleeping temperature ────────────────────────────────────────────
    // Hot sleepers are penalised by dense memory-foam and need cooling gel,
    // open-cell foam, or pocket springs with breathable comfort layers.
    // Cool sleepers can handle denser, cosier foam layers.
    {
      id: "temperature",
      text: "Do you sleep hot or get warm at night?",
      options: [
        { id: "hot",     label: "Yes — I often overheat or throw the covers off" },
        { id: "neutral", label: "No — my temperature is generally fine" },
        { id: "cool",    label: "I tend to run cold and like to feel cosy" },
      ],
    },

    // ── Q6 — Material preference ─────────────────────────────────────────────
    // Soft signal — overrides slightly toward a construction type. Does not
    // hard-block any product, but rewards matching constructions.
    {
      id: "material",
      text: "Do you have a preference for mattress construction?",
      helpText: "Each type has different feel, durability, and temperature trade-offs.",
      options: [
        { id: "no-preference", label: "No preference — just recommend the best fit" },
        { id: "memory-foam",   label: "Memory foam — contouring, motion-absorbing" },
        { id: "spring",        label: "Springs — bouncy, breathable, traditional" },
        { id: "hybrid",        label: "Hybrid — springs plus foam comfort layers" },
        { id: "latex",         label: "Latex — resilient, responsive, natural" },
      ],
    },

    // ── Q7 — Budget ──────────────────────────────────────────────────────────
    // Four tiers for mattress (vs three for pillow) because of the wider
    // price range. Budget is gating, not boosting — a product over budget
    // receives a penalty; one within range receives no extra boost.
    {
      id: "budget",
      text: "What is your budget for a Double mattress?",
      helpText: "All prices are approximate RRP. Discounts apply frequently.",
      options: [
        { id: "budget",    label: "Under £250 — good value options" },
        { id: "mid",       label: "£250–£600 — quality mid-range" },
        { id: "premium",   label: "£600–£1,000 — premium performance" },
        { id: "no-limit",  label: "No budget limit — show me the best fit" },
      ],
    },
  ],
};
