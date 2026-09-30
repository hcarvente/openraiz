// archive.js — decides which opportunities are active vs. archived, and why.
// No rendering happens here (that's render.js); this file only classifies data.

/**
 * True if the opportunity's deadline has passed. A deadline is inclusive of its
 * whole day (an opportunity due "today" is still active through the end of that
 * day); a null deadline (rolling/ongoing) never expires.
 */
function isExpired(opportunity, today = new Date()) {
  if (!opportunity.deadline) {
    return false;
  }
  const endOfDeadlineDay = new Date(`${opportunity.deadline}T23:59:59`);
  return today > endOfDeadlineDay;
}

/**
 * True if an opportunity should show on the main page. Written as an allow-list
 * (must explicitly be "active" AND not expired) rather than a deny-list, so a
 * future status value (e.g. a "pending" submission awaiting review) is hidden
 * by default instead of accidentally showing up if this code isn't updated
 * the same day that status is introduced.
 */
function isActive(opportunity, today = new Date()) {
  return opportunity.status === "active" && !isExpired(opportunity, today);
}

/**
 * Explains why an inactive opportunity is archived, for grouping on the archive page.
 */
function archiveReason(opportunity, today = new Date()) {
  if (opportunity.status === "filled") {
    return "filled";
  }
  if (opportunity.status === "archived") {
    return "archived";
  }
  if (isExpired(opportunity, today)) {
    return "expired";
  }
  return "archived";
}

/**
 * Splits a full opportunity list into { active, archived } without mutating the source data.
 */
function partitionOpportunities(opportunities, today = new Date()) {
  const active = [];
  const archived = [];
  opportunities.forEach((opportunity) => {
    if (isActive(opportunity, today)) {
      active.push(opportunity);
    } else {
      archived.push(opportunity);
    }
  });
  return { active, archived };
}

/**
 * Groups an already-archived list by why each one is archived, for the archive page.
 */
function groupArchivedByReason(archived, today = new Date()) {
  const groups = { expired: [], filled: [], archived: [] };
  archived.forEach((opportunity) => {
    groups[archiveReason(opportunity, today)].push(opportunity);
  });
  return groups;
}
