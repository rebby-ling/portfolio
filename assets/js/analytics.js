/* =========================================================
   GA4 Portfolio Tracking Script — Brave-Safe Version
   Author: Rebecca Ling
   Purpose: Track tab views, outbound clicks, resume downloads,
            project opens, and scroll depth — without ever
            breaking the site if GA is blocked.
========================================================= */

/* ------------------------------
   Safe GA4 event sender
------------------------------ */
function sendGA(eventName, params = {}) {
    try {
      if (typeof gtag === "function") {
        gtag("event", eventName, params);
      }
    } catch (e) {
      // GA blocked or unavailable — fail silently
    }
  }
  
  /* =========================================================
     1. OUTBOUND LINK TRACKING
  ========================================================= */
  
  function trackOutboundLinks() {
    try {
      document.querySelectorAll('a[target="_blank"]').forEach(link => {
        link.addEventListener("click", () => {
          sendGA("outbound_click", {
            link_url: link.href,
            link_text: link.innerText || "(icon)",
            page_path: window.location.pathname
          });
        });
      });
    } catch (e) {}
  }
  
  /* =========================================================
     2. RESUME DOWNLOAD TRACKING
  ========================================================= */
  
  function trackResumeDownloads() {
    try {
      document.querySelectorAll('a[href$=".pdf"]').forEach(pdfLink => {
        pdfLink.addEventListener("click", () => {
          sendGA("resume_download", {
            file_name: pdfLink.href.split("/").pop(),
            url: pdfLink.href
          });
        });
      });
    } catch (e) {}
  }
  
  /* =========================================================
     3. PROJECT CARD CLICKS
  ========================================================= */
  
  function trackProjectCardClicks() {
    try {
      document.querySelectorAll(".project-card").forEach(card => {
        card.addEventListener("click", () => {
          const title =
            card.querySelector("strong")?.innerText || "Unknown project";
  
          sendGA("project_opened", {
            project_title: title,
            project_url: card.href,
            page_path: window.location.pathname
          });
        });
      });
    } catch (e) {}
  }
  
  /* =========================================================
     4. TAB VIEW TRACKING (Virtual pageviews)
  ========================================================= */
  
  function trackTabViews() {
    try {
      document.querySelectorAll("[data-tab-target]").forEach(tab => {
        tab.addEventListener("click", () => {
          const target = tab.dataset.tabTarget; // "about" or "work"
          sendGA("page_view", {
            page_title: target.charAt(0).toUpperCase() + target.slice(1),
            page_path: "/" + target
          });
        });
      });
    } catch (e) {}
  }
  
  /* =========================================================
     5. SCROLL DEPTH TRACKING
  ========================================================= */
  
  const scrollLevels = [25, 50, 75, 100];
  let scrollTriggered = {};
  
  function trackScrollDepth() {
    try {
      const scrollPercent =
        (window.scrollY /
          (document.body.scrollHeight - window.innerHeight)) *
        100;
  
      scrollLevels.forEach(level => {
        if (scrollPercent >= level && !scrollTriggered[level]) {
          scrollTriggered[level] = true;
  
          sendGA("scroll_depth", {
            percent_scrolled: level,
            page_path: window.location.pathname
          });
        }
      });
    } catch (e) {}
  }
  
  /* =========================================================
     INIT — Safe initialisation
  ========================================================= */
  
  document.addEventListener("DOMContentLoaded", () => {
    try {
      trackOutboundLinks();
      trackResumeDownloads();
      trackProjectCardClicks();
      trackTabViews();
      window.addEventListener("scroll", trackScrollDepth);
    } catch (e) {
      // If analytics fails, do not block the rest of the site
      console.warn("Analytics disabled or blocked:", e);
    }
  });
  