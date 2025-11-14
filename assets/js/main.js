/* =========================================================
   MAIN NAV MENU (FOR PROJECT DETAIL PAGES ONLY)
========================================================= */

const navMenu = document.getElementById("nav-menu"),
  navToggle = document.getElementById("nav-toggle"),
  navClose = document.getElementById("nav-close"),
  navBtn = document.getElementById("nav-btns");

const isTabbedHome = document.body.classList.contains("js-tabs-page");

/* ===== SHOW MENU (only on detail pages) ===== */
if (!isTabbedHome && navToggle) {
  navToggle.addEventListener("click", () => {
    navMenu.classList.add("show-menu");
    navBtn.classList.add("hide");
  });
}

/* ===== HIDE MENU (only on detail pages) ===== */
if (!isTabbedHome && navClose) {
  navClose.addEventListener("click", () => {
    navMenu.classList.remove("show-menu");
    navBtn.classList.remove("hide");
  });
}

/* ===== CLOSE MENU ON LINK CLICK (detail pages only) ===== */
if (!isTabbedHome) {
  document.querySelectorAll(".nav__link").forEach((n) =>
    n.addEventListener("click", () => {
      navMenu.classList.remove("show-menu");
      navBtn.classList.remove("hide");
    })
  );
}

/* =========================================================
   HEADER SCROLL EFFECT
========================================================= */
function scrollHeader() {
  const header = document.getElementById("header");
  if (window.scrollY >= 80) header.classList.add("scroll-header");
  else header.classList.remove("scroll-header");
}
window.addEventListener("scroll", scrollHeader);

/* =========================================================
   SCROLL-UP BUTTON
========================================================= */
function scrollUp() {
  const scrollUpBtn = document.getElementById("scroll-up");
  if (window.scrollY >= 560) scrollUpBtn.classList.add("show-scroll");
  else scrollUpBtn.classList.remove("show-scroll");
}
window.addEventListener("scroll", scrollUp);

/* =========================================================
   DARK / LIGHT THEME
========================================================= */

const themeButton = document.getElementById("theme-button");
const darkTheme = "dark-theme";
const iconTheme = "uil-sun";

const savedTheme = localStorage.getItem("selected-theme");
const savedIcon = localStorage.getItem("selected-icon");

if (savedTheme) {
  document.body.classList[savedTheme === "dark" ? "add" : "remove"](darkTheme);
  themeButton.classList[savedIcon === "bx-moon" ? "add" : "remove"](iconTheme);
}

const getCurrentTheme = () =>
  document.body.classList.contains(darkTheme) ? "dark" : "light";
const getCurrentIcon = () =>
  themeButton.classList.contains(iconTheme) ? "bx-moon" : "bx-sun";

themeButton.addEventListener("click", () => {
  document.body.classList.toggle(darkTheme);
  themeButton.classList.toggle(iconTheme);

  localStorage.setItem("selected-theme", getCurrentTheme());
  localStorage.setItem("selected-icon", getCurrentIcon());
});

/* =========================================================
   ABOUT / WORK TABS (HOMEPAGE ONLY)
========================================================= */

if (isTabbedHome) {
  const tabLinks = document.querySelectorAll("[data-tab-target]");
  const aboutPage = document.getElementById("about");
  const workPage = document.getElementById("work");
  const viewWorkBtn = document.querySelector(".js-go-work");

  const pages = {
    about: aboutPage,
    work: workPage,
  };

  /* =========================================================
     MOVING HIGHLIGHT PILL (Under About / Work)
  ========================================================= */
  function moveHighlight() {
    const active = document.querySelector(".nav__link.active-link");
    const highlight = document.querySelector(".nav__highlight");
    if (!active || !highlight) return;

    const rect = active.getBoundingClientRect();
    const parentRect = active.parentElement.parentElement.getBoundingClientRect();

    highlight.style.width = `${rect.width}px`;
    highlight.style.transform = `translateX(${rect.left - parentRect.left}px)`;
  }

  /* ---------- Animated Tab Switch (both directions) ---------- */
  const activateTab = (target) => {
    Object.keys(pages).forEach((key) => {
      const page = pages[key];
      const isTarget = key === target;

      if (isTarget) {
        // Prepare target for fade-in
        page.classList.add("hidden-transition"); // start hidden style
        page.classList.remove("page--hidden"); // ensure it's rendered

        // Next frame -> remove hidden-transition to animate in
        requestAnimationFrame(() => {
          page.classList.remove("hidden-transition");
        });
      } else {
        // Fade out only if currently visible
        if (!page.classList.contains("page--hidden")) {
          page.classList.add("hidden-transition"); // animate to hidden
          setTimeout(() => {
            page.classList.add("page--hidden");
          }, 280); // match CSS transition duration
        } else {
          // Ensure fully hidden state
          page.classList.add("page--hidden");
          page.classList.add("hidden-transition");
        }
      }
    });

    // Update tab active state
    tabLinks.forEach((link) => {
      link.classList.toggle(
        "active-link",
        link.getAttribute("data-tab-target") === target
      );
    });

    // Move highlight pill
    setTimeout(moveHighlight, 20);
  };

  /* ---------- Click Events on Tabs ---------- */
  tabLinks.forEach((link) =>
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const target = link.getAttribute("data-tab-target");
      if (!target) return;
      activateTab(target);
    })
  );

  /* ---------- Button: View Work ---------- */
  if (viewWorkBtn) {
    viewWorkBtn.addEventListener("click", (e) => {
      e.preventDefault();
      activateTab("work");
    });
  }

  /* ---------- On Load + Resize ---------- */
  window.addEventListener("load", () => {
    // Ensure initial state is consistent with classes in HTML
    // About is visible, Work starts hidden
    if (aboutPage) {
      aboutPage.classList.remove("page--hidden");
      aboutPage.classList.remove("hidden-transition");
    }
    if (workPage && workPage.classList.contains("page--hidden")) {
      workPage.classList.add("hidden-transition");
    }
    moveHighlight();
  });

  window.addEventListener("resize", moveHighlight);
}

/* =========================================================
   SWIPER (if image carousels used)
========================================================= */
if (document.querySelector(".img__container")) {
  new Swiper(".img__container", {
    cssMode: true,
    loop: true,
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
    pagination: {
      el: ".swiper-pagination",
      clickable: true,
    },
  });
}

/* =========================================================
   ADVANCED MASONRY STAGGER SYSTEM
   ========================================================= */

   document.addEventListener("DOMContentLoaded", () => {
    const items = document.querySelectorAll(".about-gallery__item");
  
    // Detect how many columns exist dynamically
    const grid = document.querySelector(".about-gallery__grid");
    const gridWidth = grid.offsetWidth;
  
    // Based on your column-width rule (240px)
    const columnWidth = 240;
    const columnCount = Math.max(1, Math.round(gridWidth / columnWidth));
  
    // Assign each item a column index
    items.forEach((item, index) => {
      const col = index % columnCount;
      
      // Add as attribute for CSS parallax
      item.dataset.col = col;
  
      // Organic random stagger
      const baseDelay = 70 * col;           // cascade down the column
      const randomExtra = Math.random() * 120; // randomize within the column
  
      const finalDelay = baseDelay + randomExtra;
  
      item.setAttribute("data-aos-delay", finalDelay);
      item.setAttribute("data-aos-duration", 600 + Math.random() * 300);
    });
  });
  