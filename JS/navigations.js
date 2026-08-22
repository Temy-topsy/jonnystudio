/* ============================================================
   navigations.js — navigation behavior
   - Sticky nav background/blur/border transition on scroll
   - Active section indicator (scroll spy)
   - Smooth anchor scrolling with sticky-header offset
   - Mobile menu open/close + focus handling
   Works without GSAP; animations.js layers extra polish on top.
   ============================================================ */
(function () {
  "use strict";

  const JS = (window.JStudio = window.JStudio || {});
  const { qs, qsa, rafThrottle } = JS.utils;

  const root = document.documentElement;
  const nav = qs("#nav");

  /* ---- Sticky nav appearance ----------------------------- */
  const initStickyNav = () => {
    if (!nav) return;
    const update = () => {
      nav.classList.toggle("is-scrolled", window.scrollY > 24);
    };
    update();
    window.addEventListener("scroll", rafThrottle(update), { passive: true });
  };

  /* ---- Smooth scrolling to sections ---------------------- */
  const navHeight = () => (nav ? nav.offsetHeight : 76);

  const scrollToTarget = (target) => {
    const top =
      target.getBoundingClientRect().top + window.scrollY - navHeight() + 1;
    window.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
  };

  const initSmoothScroll = () => {
    qsa('a[href^="#"]').forEach((link) => {
      link.addEventListener("click", (e) => {
        const id = link.getAttribute("href");
        if (!id || id === "#") return;
        const target = qs(id);
        if (!target) return;
        e.preventDefault();
        scrollToTarget(target);
        history.replaceState(null, "", id);
      });
    });
  };

  /* ---- Scroll spy: highlight the section in view --------- */
  const initScrollSpy = () => {
    const links = qsa(".nav__link[data-nav]");
    if (!links.length || !("IntersectionObserver" in window)) return;

    const spySections = [
      "hero",
      "work",
      "services",
      "studio",
      "contact",
    ]
      .map((id) => qs("#" + id))
      .filter(Boolean);

    const setActive = (id) => {
      links.forEach((l) =>
        l.classList.toggle("is-active", l.getAttribute("href") === "#" + id)
      );
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      {
        rootMargin: `-${navHeight() + 40}px 0px -55% 0px`,
        threshold: 0,
      }
    );

    spySections.forEach((s) => observer.observe(s));
  };

  /* ---- Mobile menu --------------------------------------- */
  const initMobileMenu = () => {
    const burger = qs("#burger");
    const menu = qs("#menu");
    if (!burger || !menu) return;

    const links = qsa("[data-menu-link]", menu);
    let open = false;

    const setOpen = (state) => {
      open = state;
      menu.classList.toggle("is-open", state);
      burger.classList.toggle("is-open", state);
      burger.setAttribute("aria-expanded", String(state));
      burger.setAttribute("aria-label", state ? "Close menu" : "Open menu");
      menu.setAttribute("aria-hidden", String(!state));
      root.style.overflow = state ? "hidden" : "";
      if (state && links[0]) links[0].focus({ preventScroll: true });
    };

    burger.addEventListener("click", () => setOpen(!open));
    links.forEach((l) => l.addEventListener("click", () => setOpen(false)));

    const back = qs("#menu-back", menu);
    if (back) {
      back.addEventListener("click", () => {
        setOpen(false);
        burger.focus({ preventScroll: true });
      });
    }

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && open) {
        setOpen(false);
        burger.focus();
      }
    });

    window.addEventListener("resize", () => {
      if (open && window.innerWidth > 900) setOpen(false);
    });
  };

  const initNavigation = () => {
    initStickyNav();
    initSmoothScroll();
    initScrollSpy();
    initMobileMenu();
  };

  JS.initNavigation = initNavigation;
})();
