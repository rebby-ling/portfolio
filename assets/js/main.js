/* =========================================================
   CLEAN MAIN.JS (NO MOBILE NAV TOGGLE)
========================================================= */

/* =========================================================
   CUSTOM CURSOR — FIXED VERSION (prevents ghost cursor)
========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  let cursors = document.querySelectorAll(".custom-cursor");

  /* Remove any duplicate cursor elements */
  if (cursors.length > 1) {
    cursors.forEach((c, i) => {
      if (i > 0) c.remove();
    });
  }

  const cursor = document.querySelector(".custom-cursor");
  if (!cursor) return;

  /* Hide cursor off-screen before activation */
  cursor.style.left = "-100px";
  cursor.style.top = "-100px";

  document.body.classList.add("custom-cursor--enabled");

  /* Move cursor */
  document.addEventListener("mousemove", (e) => {
    cursor.style.left = `${e.clientX}px`;
    cursor.style.top = `${e.clientY}px`;
  });

  /* Hover grow selectors */
  const hoverSelectors = [
    "a",
    "button",
    ".button",
    ".nav__link",
    ".project-card",
    ".footer__social-link",
    ".about-gallery__item",
    ".cite"
  ];

  hoverSelectors.forEach((selector) => {
    document.querySelectorAll(selector).forEach((el) => {
      el.addEventListener("mouseenter", () =>
        cursor.classList.add("cursor-hover")
      );
      el.addEventListener("mouseleave", () =>
        cursor.classList.remove("cursor-hover")
      );
    });
  });
});

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
  if (!scrollUpBtn) return;
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

  themeButton.classList.add("theme-animating");
  setTimeout(() => themeButton.classList.remove("theme-animating"), 600);

  localStorage.setItem("selected-theme", getCurrentTheme());
  localStorage.setItem("selected-icon", getCurrentIcon());
});

/* =========================================================
   ABOUT / WORK TABS (HOMEPAGE ONLY)
========================================================= */

if (document.body.classList.contains("js-tabs-page")) {
  const tabLinks = document.querySelectorAll("[data-tab-target]");
  const aboutPage = document.getElementById("about");
  const workPage = document.getElementById("work");

  const pages = { about: aboutPage, work: workPage };

  function moveHighlight() {
    const active = document.querySelector(".nav__link.active-link");
    const highlight = document.querySelector(".nav__highlight");
    if (!active || !highlight) return;

    const rect = active.getBoundingClientRect();
    const parentRect = active.parentElement.parentElement.getBoundingClientRect();

    highlight.style.width = `${rect.width}px`;
    highlight.style.transform = `translateX(${rect.left - parentRect.left}px)`;
  }

  const activateTab = (target) => {
    Object.keys(pages).forEach((key) => {
      const page = pages[key];
      const isTarget = key === target;

      if (isTarget) {
        page.classList.add("hidden-transition");
        page.classList.remove("page--hidden");
        requestAnimationFrame(() => page.classList.remove("hidden-transition"));
      } else {
        if (!page.classList.contains("page--hidden")) {
          page.classList.add("hidden-transition");
          setTimeout(() => page.classList.add("page--hidden"), 280);
        } else {
          page.classList.add("page--hidden");
          page.classList.add("hidden-transition");
        }
      }
    });

    tabLinks.forEach((link) =>
      link.classList.toggle("active-link", link.getAttribute("data-tab-target") === target)
    );

    setTimeout(moveHighlight, 20);
  };

  tabLinks.forEach((link) =>
    link.addEventListener("click", (e) => {
      e.preventDefault();
      activateTab(link.getAttribute("data-tab-target"));
    })
  );

  window.addEventListener("load", () => {
    aboutPage.classList.remove("page--hidden", "hidden-transition");
    if (workPage.classList.contains("page--hidden")) {
      workPage.classList.add("hidden-transition");
    }
    moveHighlight();
  });

  window.addEventListener("resize", moveHighlight);
}

/* =========================================================
   SWIPER INIT
========================================================= */
if (document.querySelector(".img__container")) {
  new Swiper(".img__container", {
    cssMode: true,
    loop: true,
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
    pagination: { el: ".swiper-pagination", clickable: true },
  });
}

/* =========================================================
   MASONRY STAGGER
========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  const items = document.querySelectorAll(".about-gallery__item");
  const grid = document.querySelector(".about-gallery__grid");
  if (!grid) return;

  const gridWidth = grid.offsetWidth;
  const columnWidth = 240;
  const columnCount = Math.max(1, Math.round(gridWidth / columnWidth));

  items.forEach((item, index) => {
    const col = index % columnCount;
    item.dataset.col = col;

    const baseDelay = 70 * col;
    const randomExtra = Math.random() * 120;
    const finalDelay = baseDelay + randomExtra;

    item.setAttribute("data-aos-delay", finalDelay);
    item.setAttribute("data-aos-duration", 600 + Math.random() * 300);
  });
});

/* =========================================================
   TYPING GREETING
========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  const textEl = document.querySelector(".typing-text");
  if (!textEl) return;

  const hour = new Date().getHours();
  let greeting = hour < 12
    ? "Morning, 🌅 I'm Rebecca! "
    : hour < 18
    ? "Afternoon, 🌞 I'm Rebecca!"
    : "Evening, 🌝 I'm Rebecca! ";

  let i = 0;

  setTimeout(() => {
    textEl.style.opacity = 1;
    type();
  }, 400);

  function type() {
    if (i < greeting.length) {
      textEl.textContent += greeting.charAt(i);
      setTimeout(type, 40 + Math.random() * 70);
      i++;
    } else {
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

/* =========================================================
   BEFORE/AFTER SLIDER — Only run on pages that use it
========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  const wrappers = document.querySelectorAll(".project-slider__wrapper");
  if (!wrappers.length) return; // no sliders on this page

  wrappers.forEach(wrapper => {
    const beforeImg = wrapper.querySelector(".project-slider__before");
    const handle = wrapper.querySelector(".project-slider__handle");
    
    if (!beforeImg || !handle) return;

    let dragging = false;

    const updateSlider = (x) => {
      const rect = wrapper.getBoundingClientRect();
      let offset = Math.min(Math.max(0, x - rect.left), rect.width);
      const percent = (offset / rect.width) * 100;

      beforeImg.style.clipPath = `inset(0 ${100 - percent}% 0 0)`;
      handle.style.left = `${percent}%`;
    };

    const startDrag = (e) => {
      dragging = true;
      const clientX = e.touches?.[0]?.clientX || e.clientX;
      updateSlider(clientX);
    };

    const stopDrag = () => (dragging = false);

    const onMove = (e) => {
      if (!dragging) return;
      const clientX = e.touches?.[0]?.clientX || e.clientX;
      updateSlider(clientX);
    };

    handle.addEventListener("mousedown", startDrag);
    handle.addEventListener("touchstart", startDrag);

    window.addEventListener("mouseup", stopDrag);
    window.addEventListener("touchend", stopDrag);

    window.addEventListener("mousemove", onMove);
    window.addEventListener("touchmove", onMove);
  });
});

/* =========================================================
   PROJECT CAROUSEL — clean swipe + button navigation
========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  const carousels = document.querySelectorAll(".project-carousel");
  if (!carousels.length) return;

  carousels.forEach(carousel => {
    const track = carousel.querySelector(".project-carousel__track");
    const items = carousel.querySelectorAll(".project-carousel__item");
    const btnPrev = carousel.querySelector(".project-carousel__btn--prev");
    const btnNext = carousel.querySelector(".project-carousel__btn--next");
    const dotsContainer = carousel.querySelector(".project-carousel__dots");

    let currentIndex = 0;

    /* Create dots */
    items.forEach((_, i) => {
      const dot = document.createElement("span");
      if (i === 0) dot.classList.add("active");
      dotsContainer.appendChild(dot);
    });

    const dots = dotsContainer.querySelectorAll("span");

    const updateCarousel = () => {
      track.style.transform = `translateX(-${currentIndex * 100}%)`;
      dots.forEach(d => d.classList.remove("active"));
      dots[currentIndex].classList.add("active");
    };

    btnPrev.addEventListener("click", () => {
      currentIndex = currentIndex === 0 ? items.length - 1 : currentIndex - 1;
      updateCarousel();
    });

    btnNext.addEventListener("click", () => {
      currentIndex = currentIndex === items.length - 1 ? 0 : currentIndex + 1;
      updateCarousel();
    });

    /* Swipe Support */
    let startX = 0;
    track.addEventListener("touchstart", e => {
      startX = e.touches[0].clientX;
    });

    track.addEventListener("touchend", e => {
      let endX = e.changedTouches[0].clientX;
      if (endX - startX > 50) {
        // swipe right
        currentIndex = currentIndex === 0 ? items.length - 1 : currentIndex - 1;
      } else if (startX - endX > 50) {
        // swipe left
        currentIndex = currentIndex === items.length - 1 ? 0 : currentIndex + 1;
      }
      updateCarousel();
    });
  });
});
