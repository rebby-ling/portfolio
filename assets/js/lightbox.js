/* =========================================================
   LIGHTBOX — expand button on each image
========================================================= */
document.addEventListener("DOMContentLoaded", () => {
  const overlay = document.createElement("div");
  overlay.className = "lightbox";
  const lbImg = document.createElement("img");
  lbImg.className = "lightbox__img";
  overlay.appendChild(lbImg);
  document.body.appendChild(overlay);

  const openLightbox = src => {
    lbImg.src = src;
    overlay.classList.add("is-open");
  };

  const expandIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/></svg>`;

  const addExpandButton = (wrapper, imgEl) => {
    const btn = document.createElement("button");
    btn.className = "project-lightbox-btn";
    btn.setAttribute("aria-label", "Expand image");
    btn.innerHTML = expandIcon;
    wrapper.appendChild(btn);
    btn.addEventListener("click", e => {
      e.stopPropagation();
      openLightbox(imgEl.src);
    });
  };

  document.querySelectorAll(".project-image, .project-doc__full img:not(.project-carousel__item)").forEach(el => {
    const wrapper = document.createElement("div");
    wrapper.className = "project-lightbox-wrap";
    el.parentNode.insertBefore(wrapper, el);
    wrapper.appendChild(el);
    addExpandButton(wrapper, el);
  });

  document.querySelectorAll(".project-carousel__item").forEach(el => {
    const wrapper = document.createElement("div");
    wrapper.className = "project-lightbox-wrap project-lightbox-wrap--slide";
    el.parentNode.insertBefore(wrapper, el);
    wrapper.appendChild(el);
    addExpandButton(wrapper, el);
  });

  lbImg.addEventListener("click", e => e.stopPropagation());
  overlay.addEventListener("click", () => overlay.classList.remove("is-open"));
  document.addEventListener("keydown", e => {
    if (e.key === "Escape") overlay.classList.remove("is-open");
  });
});
