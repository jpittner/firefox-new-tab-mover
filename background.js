/**
 * Tab Mover Background Script (background.js)
 *
 * This script runs continuously in the background and listens for new tabs being created.
 * When a new tab is created (via Ctrl+T, middle-click on a link, or API call),
 * it immediately moves that tab to the first position (index 0) in its window.
 */

async function getPinnedTabCount() {
  try {
    // 1. Define the query to filter only pinned tabs
    let queryInfo = {
      pinned: true
    };

    // 2. Use browser.tabs.query() which returns a Promise that resolves 
    //    with an array of tabs (tabs.Tab objects) matching the query.
    let tabs = await browser.tabs.query(queryInfo);

    // 3. The count is simply the length of the returned array
    let pinnedCount = tabs.length;

    console.log(`Number of pinned tabs: ${pinnedCount}`);
    return pinnedCount;

  } catch (error) {
    console.error(`Error querying tabs: ${error}`);
    return 0;
  }
}

// Listener function called whenever a new tab is created
async function handleTabCreated(tab) {
  // Use browser.tabs.move() to relocate the new tab.
  // We specify:
  // 1. tab.id: The ID of the tab we want to move.
  // 2. { index: 0 }: The target position (0 is the very first tab).

  // We also check if the tab is already in position 0 just in case,
  // although usually a newly created tab won't be index 0 unless it's the only tab.

  window.setTimeout(async () => {

    if (tab.index !== 0) {
      const pinnedTabsLength = await getPinnedTabCount()
      browser.tabs.move(tab.id, { index: pinnedTabsLength })
        .then(() => {
          // Optional: Log the action for debugging
          console.log(`Tab ID ${tab.id} moved to the first position (index 0).`);
        })
        .catch(error => {
          console.error(`Error moving tab ${tab.id}: ${error}`);
        });
    }
  }, 0)

}

// Attach the handler to the onCreated event
browser.tabs.onCreated.addListener(handleTabCreated);

console.log("New Tab Mover extension active. Listening for tab creation events.");
