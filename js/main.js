// main.js — bootstraps the home page: loads the data, then renders it.
// Filtering (M5) and archiving (M6) will slot in between these two steps later.

document.addEventListener("DOMContentLoaded", async () => {
  const opportunities = await loadOpportunities();
  renderOpportunities(opportunities);
});
