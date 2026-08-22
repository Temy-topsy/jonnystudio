/* ============================================================
   animations.js — motion layer (GSAP + ScrollTrigger)
   Progressive enhancement:
   - If GSAP is unavailable, elements are shown via reveal fallback.
   - If reduced motion is requested, animations are skipped and
     content is shown immediately.
   Exposes JStudio.initAnimations({ gsapReady, reduce })
       and JStudio.revealAllStatic().
   ============================================================ */
(function () {
  "use strict";

  const JS = (window.JStudio = window.JStudio || {});
  const { qs, qsa, isFinePointer } = JS.utils;

  /* Reveal fallback: make everything visible with no motion. */
  const revealAllStatic = () => {
    qsa("[data-reveal]").forEach((el) => {
      el.style.opacity = "1";
      el.style.transform = "none";
    });
  };

  /* ---- Scroll reveals ------------------------------------ */
  const initReveals = (gsap, ScrollTrigger) => {
    // Grouped reveals: stagger children as the group enters.
    qsa("[data-reveal-group]").forEach((group) => {
      const items = qsa("[data-reveal]", group);
      if (!items.length) return;
      gsap.set(items, { y: 26, autoAlpha: 0 });
      ScrollTrigger.create({
        trigger: group,
        start: "top 82%",
        once: true,
        onEnter: () =>
          gsap.to(items, {
            y: 0,
            autoAlpha: 1,
            duration: 0.75,
            ease: "power3.out",
            stagger: 0.09,
          }),
      });
    });

    // Ungrouped reveals (section heads, standalone blocks).
    qsa("[data-reveal]").forEach((el) => {
      if (el.closest("[data-reveal-group]")) return;
      gsap.set(el, { y: 28, autoAlpha: 0 });
      ScrollTrigger.create({
        trigger: el,
        start: "top 85%",
        once: true,
        onEnter: () =>
          gsap.to(el, { y: 0, autoAlpha: 1, duration: 0.8, ease: "power3.out" }),
      });
    });
  };

  /* ---- Hero parallax ------------------------------------- */
  const initHeroParallax = (gsap, ScrollTrigger) => {
    const grid = qs("[data-hero-grid]");
    if (grid) {
      gsap.to(grid, {
        yPercent: 12,
        ease: "none",
        scrollTrigger: {
          trigger: "#hero",
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });
    }

    const visual = qs('[data-hero="visual"]');
    if (visual) {
      gsap.to(visual, {
        yPercent: -8,
        ease: "none",
        scrollTrigger: {
          trigger: "#hero",
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });
    }
  };

  /* ---- Differentiators: vertical scroll-progress line ------
     The fill scrubs top→bottom with scroll; each item's node dot
     lights up while it's the active step in the viewport. */
  const initDiffs = (gsap, ScrollTrigger) => {
    const fill = qs("[data-diffs-fill]");
    const diffs = qsa("[data-diff]");
    const wrap = qs(".diffs");
    if (!wrap || !fill) return;

    gsap.to(fill, {
      scaleY: 1,
      ease: "none",
      scrollTrigger: {
        trigger: wrap,
        start: "top 60%",
        end: "bottom 70%",
        scrub: true,
      },
    });

    diffs.forEach((diff) => {
      ScrollTrigger.create({
        trigger: diff,
        start: "top 65%",
        end: "bottom 65%",
        onToggle: (self) => diff.classList.toggle("is-active", self.isActive),
      });
    });
  };

  /* ---- Magnetic buttons (fine pointer only) -------------- */
  const initMagnetic = (gsap) => {
    if (!isFinePointer()) return;
    qsa("[data-magnetic]").forEach((el) => {
      const strength = 0.35;
      const onMove = (e) => {
        const r = el.getBoundingClientRect();
        const x = e.clientX - (r.left + r.width / 2);
        const y = e.clientY - (r.top + r.height / 2);
        gsap.to(el, { x: x * strength, y: y * strength, duration: 0.5, ease: "power3.out" });
      };
      const reset = () =>
        gsap.to(el, { x: 0, y: 0, duration: 0.6, ease: "elastic.out(1, 0.4)" });
      el.addEventListener("mousemove", onMove);
      el.addEventListener("mouseleave", reset);
    });
  };

  /* ---- Custom cursor (fine pointer only) ----------------- */
  const initCursor = (gsap) => {
    if (!isFinePointer()) return;
    const cursor = qs("#cursor");
    if (!cursor) return;

    let x = window.innerWidth / 2;
    let y = window.innerHeight / 2;
    let cx = x;
    let cy = y;

    window.addEventListener(
      "mousemove",
      (e) => {
        x = e.clientX;
        y = e.clientY;
        cursor.classList.add("is-active");
      },
      { passive: true }
    );

    document.addEventListener("mouseleave", () =>
      cursor.classList.remove("is-active")
    );

    gsap.ticker.add(() => {
      cx += (x - cx) * 0.2;
      cy += (y - cy) * 0.2;
      gsap.set(cursor, { x: cx, y: cy });
    });

    const hoverables = "a, button, [data-magnetic], .project__media, .service";
    document.addEventListener("mouseover", (e) => {
      if (e.target.closest(hoverables)) cursor.classList.add("is-hover");
    });
    document.addEventListener("mouseout", (e) => {
      if (e.target.closest(hoverables)) cursor.classList.remove("is-hover");
    });
  };

  /* ---- Public entry -------------------------------------- */
  const initAnimations = (opts) => {
    const gsapReady = opts && opts.gsapReady;
    const reduce = opts && opts.reduce;

    if (!gsapReady || reduce) {
      revealAllStatic();
      return;
    }

    const gsap = window.gsap;
    const ScrollTrigger = window.ScrollTrigger;
    if (ScrollTrigger) gsap.registerPlugin(ScrollTrigger);

    gsap.config({ nullTargetWarn: false });

    if (ScrollTrigger) {
      initReveals(gsap, ScrollTrigger);
      initHeroParallax(gsap, ScrollTrigger);
      initDiffs(gsap, ScrollTrigger);
      window.addEventListener("load", () => ScrollTrigger.refresh());
    }

    initMagnetic(gsap);
    initCursor(gsap);
  };

  JS.revealAllStatic = revealAllStatic;
  JS.initAnimations = initAnimations;
})();
