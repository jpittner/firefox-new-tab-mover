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

  window.setTimeout(async () => {

    if (tab.index !== 0) {
      const pinnedTabsLength = await getPinnedTabCount()
      await browser.tabs.move(tab.id, { index: pinnedTabsLength })
    }
  }, 0)

}

// Attach the handler to the onCreated event
browser.tabs.onCreated.addListener(handleTabCreated);

console.log("New Tab Mover extension active. Listening for tab creation events.");
