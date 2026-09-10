/* ============================================================
   utils.js — small shared helpers
   No dependencies. Attaches to the global JStudio namespace so
   the site works when opened directly from the filesystem
   (file://) as well as over a server — no ES-module CORS issues.
   ============================================================ */
(function () {
  "use strict";

  const JS = (window.JStudio = window.JStudio || {});

  /** querySelector shorthand */
  const qs = (sel, ctx = document) => ctx.querySelector(sel);

  /** querySelectorAll -> real array */
  const qsa = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

  /** Run a callback once the DOM is parsed */
  const onReady = (fn) => {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", fn, { once: true });
    } else {
      fn();
    }
  };

  /** True when the user asked for reduced motion */
  const prefersReducedMotion = () =>
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /** True on fine-pointer (mouse) devices — gates cursor/magnetic FX */
  const isFinePointer = () =>
    window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  /** requestAnimationFrame-throttled wrapper for scroll/mouse handlers */
  const rafThrottle = (fn) => {
    let ticking = false;
    return (...args) => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        fn(...args);
        ticking = false;
      });
    };
  };

  /** Clamp a number between min and max */
  const clamp = (n, min, max) => Math.min(Math.max(n, min), max);

  /** Linear interpolation */
  const lerp = (a, b, t) => a + (b - a) * t;

  /** Wait for a global to appear (e.g. the GSAP CDN) or resolve false */
  const waitForGlobal = (name, timeout = 3000) =>
    new Promise((resolve) => {
      if (window[name]) return resolve(true);
      const start = performance.now();
      const tick = () => {
        if (window[name]) return resolve(true);
        if (performance.now() - start > timeout) return resolve(false);
        requestAnimationFrame(tick);
      };
      tick();
    });

  JS.utils = {
    qs,
    qsa,
    onReady,
    prefersReducedMotion,
    isFinePointer,
    rafThrottle,
    clamp,
    lerp,
    waitForGlobal,
  };
})();
