/* ============================================================
   main.js — application entry point
   Boots the site in a robust order. There is no loading overlay;
   content is visible immediately and enhancements layer on top.
   Classic script (not a module) so it works from file:// too.
   ============================================================ */
(function () {
  "use strict";

  const JS = (window.JStudio = window.JStudio || {});
  const { qs, onReady, prefersReducedMotion, waitForGlobal } = JS.utils;

  const setYear = () => {
    const el = qs("#year");
    if (el) el.textContent = new Date().getFullYear();
  };

  const boot = async () => {
    try {
      JS.initTheme();
      JS.renderProjects(); // build work grid before animations bind to it
      JS.initNavigation();
      setYear();

      const reduce = prefersReducedMotion();

      if (reduce) {
        JS.revealAllStatic();
      } else {
        const gsapReady = await waitForGlobal("gsap", 3000);
        JS.initAnimations({ gsapReady: gsapReady, reduce: reduce });
      }
    } catch (err) {
      console.error("[JONNY STUDIO] init error:", err);
      JS.revealAllStatic();
    }
  };

  onReady(boot);
})();
