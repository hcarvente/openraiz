// data.js — loads the opportunity dataset from the static JSON file.
// Requires a local server (not file://) because fetch() is blocked by
// CORS when loading local files directly from disk.

/**
 * Fetches data/opportunities.json and returns the parsed array.
 */
async function loadOpportunities() {
  const response = await fetch("data/opportunities.json");
  if (!response.ok) {
    throw new Error(`Failed to load opportunities: ${response.status}`);
  }
  return response.json();
}
