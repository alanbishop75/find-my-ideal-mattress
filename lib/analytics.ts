/**
 * Lightweight browser-side analytics store.
 * Writes aggregated event counts to localStorage so the admin can review
 * SEO source attribution and question drop-off from same-device sessions.
 *
 * Data is keyed under "fmi_analytics" in localStorage.
 */

export interface FmiAnalytics {
  /** quiz starts keyed by seo_source slug (or "direct") */
  seo_starts: Record<string, number>;
  /** quiz completions keyed by seo_source slug (or "direct") */
  seo_completes: Record<string, number>;
  /** how many times each question was the LAST answered (i.e. user stopped here) */
  question_dropoffs: Record<string, number>;
  /** answer distribution per question */
  question_answers: Record<string, Record<string, number>>;
  /** total events recorded */
  total_events: number;
}

const KEY = "fmi_analytics";

function load(): FmiAnalytics {
  if (typeof window === "undefined") return empty();
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as FmiAnalytics) : empty();
  } catch {
    return empty();
  }
}

function save(data: FmiAnalytics) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(KEY, JSON.stringify(data));
  } catch {
    // localStorage may be unavailable (private mode, quota exceeded) — fail silently
  }
}

function empty(): FmiAnalytics {
  return { seo_starts: {}, seo_completes: {}, question_dropoffs: {}, question_answers: {}, total_events: 0 };
}

export function trackQuizStart(source: string) {
  const data = load();
  data.seo_starts[source] = (data.seo_starts[source] ?? 0) + 1;
  data.total_events += 1;
  save(data);
}

export function trackQuizComplete(source: string) {
  const data = load();
  data.seo_completes[source] = (data.seo_completes[source] ?? 0) + 1;
  data.total_events += 1;
  save(data);
}

export function trackQuizAbandoned(source: string, lastQuestionId: string) {
  const data = load();
  data.question_dropoffs[lastQuestionId] = (data.question_dropoffs[lastQuestionId] ?? 0) + 1;
  data.total_events += 1;
  save(data);
}

export function trackQuestionAnswered(questionId: string, answerId: string) {
  const data = load();
  if (!data.question_answers[questionId]) data.question_answers[questionId] = {};
  data.question_answers[questionId][answerId] = (data.question_answers[questionId][answerId] ?? 0) + 1;
  data.total_events += 1;
  save(data);
}

export function getAnalytics(): FmiAnalytics {
  return load();
}

export function clearAnalytics() {
  if (typeof window !== "undefined") localStorage.removeItem(KEY);
}
