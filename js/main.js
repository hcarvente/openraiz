// main.js — bootstraps each page: loads the data, then renders whichever
// section is present (home page's grid, or a detail page's single opportunity).
// Filtering (M5) and archiving (M6) will slot into the home-page path later.

document.addEventListener("DOMContentLoaded", async () => {
  if (document.querySelector(".opportunity-grid")) {
    // Home page: render every opportunity as a card.
    const opportunities = await loadOpportunities();
    renderOpportunities(opportunities);
  } else if (document.querySelector(".opportunity-detail")) {
    // Detail page: find the one opportunity named by ?id= in the URL.
    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");
    const opportunities = await loadOpportunities();
    const opportunity = opportunities.find((item) => item.id === id);
    renderOpportunityDetail(opportunity);
  }
});
