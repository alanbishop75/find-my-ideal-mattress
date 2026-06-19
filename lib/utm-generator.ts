export function generateUTM({
  creativeId,
  hookId,
  campaignId,
  source,
}: {
  creativeId: string;
  hookId: string;
  campaignId: string;
  source: string;
}) {
  return `utm_source=${encodeURIComponent(source)}&utm_campaign=${encodeURIComponent(campaignId)}&utm_content=${encodeURIComponent(creativeId)}&utm_term=${encodeURIComponent(hookId)}`;
}