import type { Region } from "./types";

const HOMEPAGE_INTRO_UK = "Free, personalised pillow recommendations - no sign-up, no faff. Answer a few quick questions and we match you to the best pillow for how you sleep.";
const HOMEPAGE_INTRO_US = "Free, personalized pillow recommendations - no sign-up, no hassle. Answer a few quick questions and we match you to the best pillow for how you sleep.";

const QUESTION_TEXT_US_OVERRIDES: Record<string, string> = {};

const OPTION_LABEL_US_OVERRIDES: Record<string, Record<string, string>> = {
  budget: {
    budget: "Under $35 - good value options",
    mid: "$35-$80 - quality mid-range",
    premium: "$80+ - best-in-class",
  },
};

export function getHomepageIntro(region: Region): string {
  return region === "US" ? HOMEPAGE_INTRO_US : HOMEPAGE_INTRO_UK;
}

export function getQuestionTextForRegion(questionId: string, fallbackText: string, region: Region): string {
  if (region !== "US") return fallbackText;
  return QUESTION_TEXT_US_OVERRIDES[questionId] ?? fallbackText;
}

export function getOptionLabelForRegion(
  questionId: string,
  optionId: string,
  fallbackLabel: string,
  region: Region
): string {
  if (region !== "US") return fallbackLabel;
  return OPTION_LABEL_US_OVERRIDES[questionId]?.[optionId] ?? fallbackLabel;
}
