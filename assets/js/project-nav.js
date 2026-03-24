/* =========================================================
   PROJECT SIDE NAVIGATION
   - Auto-builds links from h2.project-section__title
   - Scroll spy highlights active section
   - Mobile toggle open/close
   - Smooth scroll to section on click
   - Works across all project pages
========================================================= */

(function () {
    "use strict";
  
    let navInitialised = false;
  
    function initProjectNav() {
      const sidenav = document.getElementById("project-sidenav");
      const mobilePanel = document.getElementById("project-mobilenav-panel");
      const mobileToggle = document.getElementById("project-mobilenav-toggle");
  
      if (!sidenav || !mobilePanel || !mobileToggle) return;
  
      /* --------------------------------------------------
         1. COLLECT SECTIONS
         Reads every h2.project-section__title and gives
         its parent section an id if it doesn't have one.
      -------------------------------------------------- */
      const headings = document.querySelectorAll(
        ".project-section h2.project-section__title"
      );
  
      if (!headings.length) return;
  
      const sections = [];
  
      headings.forEach((heading, i) => {
        const section = heading.closest(".project-section");
        if (!section) return;
  
        // Generate a slug id from heading text if none exists
        if (!section.id) {
          const slug = heading.textContent
            .trim()
            .toLowerCase()
            .replace(/[^a-z0-9\s-]/g, "")
            .replace(/\s+/g, "-")
            .replace(/-+/g, "-")
            .slice(0, 50);
          section.id = slug || `section-${i}`;
        }
  
        sections.push({ id: section.id, label: heading.textContent.trim() });
      });
  
      /* --------------------------------------------------
         2. BUILD NAV LINKS
      -------------------------------------------------- */
      function buildLinks(container, linkClass) {
        container.querySelectorAll(`.${linkClass}`).forEach(el => el.remove());
  
        sections.forEach(({ id, label }) => {
          const a = document.createElement("a");
          a.href = `#${id}`;
          a.className = linkClass;
          a.textContent = label;
          a.setAttribute("role", "menuitem");
  
          a.addEventListener("click", (e) => {
            e.preventDefault();
            const target = document.getElementById(id);
            if (!target) return;
  
            const headerOffset =
              parseInt(
                getComputedStyle(document.documentElement).getPropertyValue(
                  "--header-height"
                )
              ) || 64;
  
            const top =
              target.getBoundingClientRect().top +
              window.scrollY -
              headerOffset -
              24;
  
            window.scrollTo({ top, behavior: "smooth" });
            closeMobilePanel();
          });
  
          container.appendChild(a);
        });
      }
  
      buildLinks(sidenav, "project-sidenav__link");
      buildLinks(mobilePanel, "project-mobilenav__link");
  
      /* --------------------------------------------------
         3. SCROLL SPY
      -------------------------------------------------- */
      const headerHeight =
        parseInt(
          getComputedStyle(document.documentElement).getPropertyValue(
            "--header-height"
          )
        ) || 64;
  
      function updateActiveLink() {
        let activeId = null;
        const scrollY = window.scrollY;
  
        sections.forEach(({ id }) => {
          const el = document.getElementById(id);
          if (!el) return;
          const top = el.getBoundingClientRect().top + scrollY - headerHeight - 40;
          if (scrollY >= top) activeId = id;
        });
  
        sidenav.querySelectorAll(".project-sidenav__link").forEach((link) => {
          link.classList.toggle("is-active", link.getAttribute("href") === `#${activeId}`);
        });
  
        mobilePanel.querySelectorAll(".project-mobilenav__link").forEach((link) => {
          link.classList.toggle("is-active", link.getAttribute("href") === `#${activeId}`);
        });
  
        const mobileNav = document.getElementById("project-mobilenav");
        if (mobileNav) {
          mobileNav.classList.toggle("scroll-active", scrollY >= 560);
        }
      }
  
      window.addEventListener("scroll", updateActiveLink, { passive: true });
      updateActiveLink();
  
      /* --------------------------------------------------
         4. MOBILE TOGGLE
      -------------------------------------------------- */
      function closeMobilePanel() {
        mobilePanel.classList.remove("is-open");
        mobileToggle.classList.remove("is-open");
        mobileToggle.setAttribute("aria-expanded", "false");
        mobileToggle.querySelector("i").className = "uil uil-list-ul";
        mobileToggle.style.backgroundColor = "var(--first-color)";
      }
  
      // Guard against duplicate listener registration if init fires more than once
      if (!navInitialised) {
        navInitialised = true;
  
        mobileToggle.addEventListener("click", (e) => {
          e.stopPropagation();
          const isOpen = mobilePanel.classList.contains("is-open");
          if (isOpen) {
            closeMobilePanel();
          } else {
            mobileToggle.style.backgroundColor = "";
            mobilePanel.classList.add("is-open");
            mobileToggle.classList.add("is-open");
            mobileToggle.setAttribute("aria-expanded", "true");
            mobileToggle.querySelector("i").className = "uil uil-times";
          }
        });
  
        document.addEventListener("click", (e) => {
          if (!e.target.closest("#project-mobilenav")) {
            closeMobilePanel();
          }
        });
  
        document.addEventListener("keydown", (e) => {
          if (e.key === "Escape") closeMobilePanel();
        });
      }
    }
  
    /* --------------------------------------------------
       INIT
    -------------------------------------------------- */
    document.addEventListener("projectNavReady", initProjectNav);
  })();