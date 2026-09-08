const DAY_MS = 24 * 60 * 60 * 1000;

function isoDate(date) {
  return date.toISOString().slice(0, 10);
}

function shiftDays(date, days) {
  return new Date(date.getTime() + days * DAY_MS);
}

function calculateGscWindows(referenceDate = isoDate(new Date())) {
  const excludedNewestDays = 3;
  const latestEnd = shiftDays(new Date(`${referenceDate}T00:00:00Z`), -excludedNewestDays);
  const latestStart = shiftDays(latestEnd, -27);
  const previousEnd = shiftDays(latestStart, -1);
  const previousStart = shiftDays(previousEnd, -27);
  const discoveryStart = shiftDays(latestEnd, -89);

  return {
    excludedNewestDays,
    latest: { startDate: isoDate(latestStart), endDate: isoDate(latestEnd) },
    previous: { startDate: isoDate(previousStart), endDate: isoDate(previousEnd) },
    discovery: { startDate: isoDate(discoveryStart), endDate: isoDate(latestEnd) },
  };
}

module.exports = { calculateGscWindows };