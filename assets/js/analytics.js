/* =========================================================
   GA4 Portfolio Tracking Script
   Author: Rebecca Ling's Portfolio
   Purpose: Track tab views, outbound clicks, resume downloads,
            project opens, and scroll depth.
========================================================= */

/* ------------------------------
   Safe GA4 event sender
------------------------------ */
function sendGA(eventName, params = {}) {
    if (typeof gtag === "function") {
      gtag("event", eventName, params);
    }
  }
  
  /* =========================================================
     1. OUTBOUND LINK TRACKING (LinkedIn, GitHub, YouTube, etc.)
  ========================================================= */
  
  function trackOutboundLinks() {
    document.querySelectorAll('a[target="_blank"]').forEach(link => {
      link.addEventListener("click", () => {
        sendGA("outbound_click", {
          link_url: link.href,
          link_text: link.innerText || "(icon)",
          page_path: window.location.pathname
        });
      });
    });
  }
  
  /* =========================================================
     2. RESUME DOWNLOAD TRACKING (PDF)
  ========================================================= */
  
  function trackResumeDownloads() {
    document.querySelectorAll('a[href$=".pdf"]').forEach(pdfLink => {
      pdfLink.addEventListener("click", () => {
        sendGA("resume_download", {
          file_name: pdfLink.href.split("/").pop(),
          url: pdfLink.href
        });
      });
    });
  }
  
  /* =========================================================
     3. PROJECT CARD CLICKS (Work → Featured Projects)
  ========================================================= */
  
  function trackProjectCardClicks() {
    document.querySelectorAll(".project-card").forEach(card => {
      card.addEventListener("click", () => {
        const title = card.querySelector("strong")?.innerText || "Unknown project";
        sendGA("project_opened", {
          project_title: title,
          project_url: card.href,
          page_path: window.location.pathname
        });
      });
    });
  }
  
  /* =========================================================
     4. TAB VIEW TRACKING (About / Work virtual pageviews)
  ========================================================= */
  
  function trackTabViews() {
    document.querySelectorAll("[data-tab-target]").forEach(tab => {
      tab.addEventListener("click", () => {
        const target = tab.dataset.tabTarget; // "about" or "work"
        sendGA("page_view", {
          page_title: target.charAt(0).toUpperCase() + target.slice(1),
          page_path: "/" + target
        });
      });
    });
  }
  
  /* =========================================================
     5. SCROLL DEPTH TRACKING
     Fires at 25%, 50%, 75%, and 100%
  ========================================================= */
  
  const scrollLevels = [25, 50, 75, 100];
  let scrollTriggered = {};
  
  function trackScrollDepth() {
    const scrollPercent =
      (window.scrollY /
        (document.body.scrollHeight - window.innerHeight)) * 100;
  
    scrollLevels.forEach(level => {
      if (scrollPercent >= level && !scrollTriggered[level]) {
        scrollTriggered[level] = true;
  
        sendGA("scroll_depth", {
          percent_scrolled: level,
          page_path: window.location.pathname
        });
      }
    });
  }
  
  /* =========================================================
     INIT — Run everything once DOM content is loaded
  ========================================================= */
  
  document.addEventListener("DOMContentLoaded", () => {
    trackOutboundLinks();
    trackResumeDownloads();
    trackProjectCardClicks();
    trackTabViews();
    window.addEventListener("scroll", trackScrollDepth);
  });
  