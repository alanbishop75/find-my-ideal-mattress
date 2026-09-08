const MATTRESS_PROPERTY = "sc-domain:findyouridealmattress.com";
const DISALLOWED_PROPERTY_TERMS = ["pillow", "golf", "coffee", "solar"];
const ACTION_LABELS = ["Implement now", "Prepare for approval", "Investigate now", "Verify now", "Monitor", "Protect", "Reject"];

function assertMattressProperty(property) {
  if (property !== MATTRESS_PROPERTY || DISALLOWED_PROPERTY_TERMS.some((term) => property.toLowerCase().includes(term))) {
    throw new Error(`Refusing non-Mattress Search Console property: ${property}`);
  }
  return property;
}

function classifyAction(action) {
  if (!ACTION_LABELS.includes(action)) throw new Error(`Unsupported Mattress SEO action: ${action}`);
  return action;
}

module.exports = { ACTION_LABELS, MATTRESS_PROPERTY, assertMattressProperty, classifyAction };