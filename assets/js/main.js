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

    // Add micro animation
    themeButton.classList.add("theme-animating");
    setTimeout(() => {
      themeButton.classList.remove("theme-animating");
    }, 600);
  

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
/* =========================================================
   RESPONSIVE TYPING + TIME-BASED GREETING (FINAL VERSION)
========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  const textEl = document.querySelector(".typing-text");
  if (!textEl) return;

  // Time-based greeting
  const hour = new Date().getHours();
  let greeting = "";
  if (hour < 12) greeting = "Morning, 🌅 I'm Rebecca! ";
  else if (hour < 18) greeting = "Afternoon, 🌞 I'm Rebecca!";
  else greeting = "Evening, 🌝 I'm Rebecca! ";

  let i = 0;

  // Reveal text element before typing
  setTimeout(() => {
    textEl.style.opacity = 1;
    type();
  }, 400);

  function type() {
    if (i < greeting.length) {
      textEl.textContent += greeting.charAt(i);

      // Natural typing speed variation
      const speed = 40 + Math.random() * 70;
      i++;

      setTimeout(type, speed);
    } else {
      // Remove the cursor when finished
      textEl.classList.add("done");
    }
  }
});
/* =========================================================
   CLICK-TO-REVEAL FLOATING TOOLTIP
========================================================= */

const testimonialData = {
  "rina-zoff": {
    name: "Rina Sato — Delivery Lead",
    quote: `Rebecca has helped to deliver one of the most important deliverables for the Discovery phase with speed and quality… fast learner, quick task do-er and very efficient designer.`
  },
  "aim-zoff": {
    name: "Aim — Senior Designer",
    quote: `It was delightful to work with Rebecca… screen flows she designed are both user-centric and realistic to implement.`
  },
  "foto-zoff": {
    name: "Foto — Designer",
    quote: `Rebecca is a Figma Wizard… She always brings refreshing solutions and confidence to speak up during discussions.`
  },
  "kimberly-zoff": {
    name: "Kimberly — Designer",
    quote: `Efficient and quick worker… Ownership of her work… Great colleague.`
  },
  "cheryll-msf": {
    name: "Ping Ho — Client",
    quote: `She has shown great initiative, drive, and adaptability… finds grounded, meaningful, and relevant solutions.`
  },
  "jiayu-msf": {
    name: "Jiayu — Designer",
    quote: `You picked things up quickly… your dedication to checking in with stakeholders kept the project on track.`
  },
  "lizhi-nlb": {
    name: "Lizhi — Delivery Lead",
    quote: `Great progress and initiative… strong collaboration skills and willingness to share knowledge.`
  },
  "nlb-main": {
    name: "Grace - Senior Designer",
    quote: `Rebecca’s talent, grit and professionalism shine through her work… contributes meaningfully to product, research and UX.`
  },
  "edma": {
    name: "Guobin — Design Manager",
    quote: `Rebecca understood the complex logic of the tool quickly… her initiative in documentation helped the whole team.`
  },
  "acra-team": {
    name: "Will - Design Manager",
    quote: `Strong ownership and adaptability… flexible, open to communication… constantly improving.`
  },
  "onsns": {
    name: "Jing Kai - Developer",
    quote: `Demonstrated initiative, curiosity, and ability to build strong rapport… strong interaction design thinking.`
  },
  "chinwen-ura": {
    name: "Ao Chin Wen — Client",
    quote: `Remarkable adaptability… research contributions provided clear direction for future development.`
  },
  "clement-ura": {
    name: "Clement — Client",
    quote: `You've been a fantastic addition… Keep up this amazing momentum!`
  }
};

let activeTooltip = null;

/* Create tooltip DOM */
function createTooltip(name, quote) {
  const el = document.createElement("div");
  el.className = "testimonial-tooltip clickable";
  el.innerHTML = `<strong>${name}</strong><p>${quote}</p>`;
  document.body.appendChild(el);
  return el;
}

/* Position tooltip near clicked text */
function positionTooltip(tooltip, rect) {
  const padding = 12;
  let left = rect.left + window.scrollX;
  let top = rect.bottom + window.scrollY + 8;

  const ttRect = tooltip.getBoundingClientRect();

  // Ensure inside viewport
  if (left + ttRect.width + padding > window.innerWidth) {
    left = window.innerWidth - ttRect.width - padding;
  }
  if (top + ttRect.height + padding > document.body.scrollHeight) {
    top = rect.top + window.scrollY - ttRect.height - padding;
  }

  tooltip.style.left = `${left}px`;
  tooltip.style.top = `${top}px`;
}

/* Main click handler */
document.querySelectorAll(".cite").forEach((citeEl) => {
  citeEl.addEventListener("click", (e) => {
    e.stopPropagation();

    const ids = citeEl.dataset.cite.split(",");
    const entry = testimonialData[ids[0]]; // Show first linked testimonial

    // Close old tooltip
    if (activeTooltip) {
      activeTooltip.remove();
      activeTooltip = null;
    }

    // Create new one
    const tooltip = createTooltip(entry.name, entry.quote);
    activeTooltip = tooltip;

    const rect = citeEl.getBoundingClientRect();
    positionTooltip(tooltip, rect);

    tooltip.classList.add("visible");
  });
});

/* Close tooltip when clicking outside */
document.addEventListener("click", () => {
  if (activeTooltip) {
    activeTooltip.remove();
    activeTooltip = null;
  }
});
