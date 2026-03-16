// ── Temporary diagnostic function ──
// Invoke via: https://api-access.netlify.app/.netlify/functions/newsletter-diag
// DELETE THIS FILE after testing

const { getStore } = require("@netlify/blobs");

exports.handler = async (event) => {
  const results = {};

  // 1. Check if Blobs package loaded
  results.blobsPackage = "loaded OK";

  // 2. Try to read the lastSentUrl from the store
  try {
    const store = getStore({
      name: "newsletter",
      siteID: process.env.SITE_ID,
      token: process.env.NETLIFY_API_TOKEN,
    });
    const lastSentUrl = await store.get("lastSentUrl");
    results.lastSentUrl = lastSentUrl || "(empty/null)";
    results.blobsRead = "OK";
  } catch (err) {
    results.blobsRead = "FAILED: " + err.message;
    results.lastSentUrl = "N/A";
  }

  // 3. Check what the featured story would be
  try {
    const response = await fetch("https://api-access.netlify.app/newsletter-content.json?v=" + Date.now());
    const data = await response.json();
    const sorted = data.stories.sort((a, b) => new Date(b.date) - new Date(a.date));
    results.featuredTitle = sorted[0].title;
    results.featuredUrl = sorted[0].url;
    results.featuredDate = sorted[0].date;
    results.totalStories = sorted.length;
  } catch (err) {
    results.contentFetch = "FAILED: " + err.message;
  }

  // 4. Compare: would next Monday send or skip?
  if (results.lastSentUrl === results.featuredUrl) {
    results.nextMondayAction = "SKIP (same URL — already sent)";
  } else if (results.lastSentUrl === "(empty/null)") {
    results.nextMondayAction = "SEED + SKIP (first run — will store URL without sending)";
  } else {
    results.nextMondayAction = "SEND (new content detected)";
  }

  // 5. Check Resend contacts count
  try {
    const RESEND_API_KEY = process.env.RESEND_API_KEY;
    const RESEND_AUDIENCE_ID = process.env.RESEND_AUDIENCE_ID;
    if (RESEND_API_KEY && RESEND_AUDIENCE_ID) {
      const resp = await fetch(
        `https://api.resend.com/audiences/${RESEND_AUDIENCE_ID}/contacts`,
        { headers: { Authorization: `Bearer ${RESEND_API_KEY}` } }
      );
      const data = await resp.json();
      const active = data.data.filter(c => !c.unsubscribed);
      results.resendActiveContacts = active.length;
      results.resendTotalContacts = data.data.length;
    } else {
      results.resend = "Missing API key or audience ID";
    }
  } catch (err) {
    results.resend = "FAILED: " + err.message;
  }

  return {
    statusCode: 200,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(results, null, 2),
  };
};
