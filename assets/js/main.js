/*===========================================================
=                       NAV MENU                            =
===========================================================*/
const navMenu = document.getElementById("nav-menu");
const navToggle = document.getElementById("nav-toggle");
const navClose = document.getElementById("nav-close");
const navBtn = document.getElementById("nav-btns");

/*===== CLASSIC MOBILE MENU (CASE STUDY PAGES ONLY) =====*/
const isTabbedHome = document.body.classList.contains("js-tabs-page");

/* Show mobile menu — only for NON-homepage pages */
if (!isTabbedHome && navToggle) {
  navToggle.addEventListener("click", () => {
    navMenu.classList.add("show-menu");
    navBtn.classList.add("hide");
  });
}

/* Hide mobile menu — only for NON-homepage pages */
if (!isTabbedHome && navClose) {
  navClose.addEventListener("click", () => {
    navMenu.classList.remove("show-menu");
    navBtn.classList.remove("hide");
  });
}

/* Close menu on link click (case-study pages only) */
const navLink = document.querySelectorAll(".nav__link");
if (!isTabbedHome) {
  navLink.forEach((n) =>
    n.addEventListener("click", () => {
      navMenu.classList.remove("show-menu");
      navBtn.classList.remove("hide");
    })
  );
}

/* Hide mobile menu buttons on homepage */
if (isTabbedHome) {
  if (navToggle) navToggle.style.display = "none";
  if (navClose) navClose.style.display = "none";
  if (navMenu) navMenu.classList.remove("show-menu");
}

/*===========================================================
=               SCROLL SECTION ACTIVE LINK                  =
===========================================================*/

/* Enable only on case-study pages */
const sections = document.querySelectorAll("section[id]");

function scrollActive() {
  const scrollY = window.pageYOffset;

  sections.forEach((current) => {
    const sectionHeight = current.offsetHeight;
    const sectionTop = current.offsetTop - 50;
    const id = current.getAttribute("id");

    const link = document.querySelector(`.nav__menu a[href="#${id}"]`);
    if (!link) return;

    if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
      link.classList.add("active-link");
    } else {
      link.classList.remove("active-link");
    }
  });
}

if (!isTabbedHome) {
  window.addEventListener("scroll", scrollActive);
}

/*===========================================================
=                     SCROLL HEADER                         =
===========================================================*/
function scrollHeader() {
  const header = document.getElementById("header");
  if (window.scrollY >= 80) header.classList.add("scroll-header");
  else header.classList.remove("scroll-header");
}
window.addEventListener("scroll", scrollHeader);

/*===========================================================
=                    SCROLL UP BUTTON                       =
===========================================================*/
function scrollUp() {
  const scrollBtn = document.getElementById("scroll-up");
  if (window.scrollY >= 560) scrollBtn.classList.add("show-scroll");
  else scrollBtn.classList.remove("show-scroll");
}
window.addEventListener("scroll", scrollUp);

/*===========================================================
=                 ABOUT / WORK TAB SYSTEM                   =
===========================================================*/
if (isTabbedHome) {
  const tabLinks = document.querySelectorAll("[data-tab-target]");
  const aboutPage = document.getElementById("about");
  const workPage = document.getElementById("work");
  const viewWorkBtn = document.querySelector(".js-go-work");

  const pages = { about: aboutPage, work: workPage };

  const activateTab = (target) => {
    Object.keys(pages).forEach((key) => {
      pages[key].classList.toggle("page--hidden", key !== target);
    });

    tabLinks.forEach((link) => {
      link.classList.toggle(
        "active-link",
        link.getAttribute("data-tab-target") === target
      );
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  tabLinks.forEach((link) =>
    link.addEventListener("click", (e) => {
      const target = link.getAttribute("data-tab-target");
      if (!target) return;
      e.preventDefault();
      activateTab(target);
    })
  );

  if (viewWorkBtn) {
    viewWorkBtn.addEventListener("click", (e) => {
      e.preventDefault();
      activateTab("work");
    });
  }
}

/*===========================================================
=                      DARK LIGHT THEME                     =
===========================================================*/
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

/*===========================================================
=                    SWIPER INITIALIZATION                  =
===========================================================*/
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

/* ================================
   SUBNAV ACTIVE ON SCROLL
   ================================ */
   const subnavLinks = document.querySelectorAll(".subnav__link");

   function updateSubnavActive() {
     subnavLinks.forEach((link) => {
       const target = document.querySelector(link.getAttribute("href"));
       if (!target) return;
   
       const rect = target.getBoundingClientRect();
       const offset = 120; // header + subnav height
   
       if (rect.top <= offset && rect.bottom >= offset) {
         subnavLinks.forEach((l) => l.classList.remove("active"));
         link.classList.add("active");
       }
     });
   }
   
   window.addEventListener("scroll", updateSubnavActive);
   