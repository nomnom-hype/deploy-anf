const body = document.body;
const header = document.querySelector("[data-header]");
const menuToggle = document.querySelector(".menu-toggle");
const menuOverlay = document.querySelector(".menu-overlay");
const menuLinks = document.querySelectorAll(".menu-overlay__nav a");
const reveals = document.querySelectorAll(".reveal");
const parallaxItems = document.querySelectorAll(".parallax");

const syncHeader = () => {
  if (!header) return;
  header.classList.toggle("is-scrolled", window.scrollY > 28);
};

const setMenuState = (open) => {
  body.classList.toggle("menu-open", open);
  menuToggle?.classList.toggle("is-open", open);
  menuOverlay?.classList.toggle("is-open", open);
  menuToggle?.setAttribute("aria-expanded", String(open));
  menuToggle?.setAttribute("aria-label", open ? "Close navigation menu" : "Open navigation menu");
  menuOverlay?.setAttribute("aria-hidden", String(!open));
};

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.18,
  }
);

reveals.forEach((item) => revealObserver.observe(item));

const updateParallax = () => {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const offset = window.scrollY;
  const viewportHeight = window.innerHeight || document.documentElement.clientHeight || 0;
  parallaxItems.forEach((item) => {
    const section = item.closest("[data-parallax-section]");
    const range = Number(item.dataset.parallaxRange || 0);

    if (section && range > 0) {
      const rect = section.getBoundingClientRect();
      const sectionTop = offset + rect.top;
      const sectionHeight = section.offsetHeight || viewportHeight;
      const maxScroll = Math.max(1, sectionHeight - viewportHeight);
      const progress = Math.min(1, Math.max(0, (offset - sectionTop) / maxScroll));
      const translate = (0.5 - progress) * range;
      item.style.transform = `translate3d(0, ${translate}%, 0) scale(1.16)`;
      return;
    }

    const speed = Number(item.dataset.speed || 0.15);
    item.style.transform = `translate3d(0, ${offset * speed}px, 0) scale(1.06)`;
  });
};

menuToggle?.addEventListener("click", () => {
  const open = !menuOverlay?.classList.contains("is-open");
  setMenuState(open);
});

menuLinks.forEach((link) => {
  link.addEventListener("click", () => setMenuState(false));
});

window.addEventListener("scroll", () => {
  syncHeader();
  updateParallax();
});

window.addEventListener("keydown", (event) => {
  if (event.key === "Escape") setMenuState(false);
});

syncHeader();
updateParallax();
