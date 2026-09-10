/* ============================================================
   theme.js — locks the site to its dark (black) theme
   The dark theme is the only theme. The initial value is set
   pre-paint by an inline script in <head>; this simply enforces
   it and keeps the browser UI color in sync.
   ============================================================ */
(function () {
  "use strict";

  const JS = (window.JStudio = window.JStudio || {});
  const { qs } = JS.utils;

  const initTheme = () => {
    document.documentElement.setAttribute("data-theme", "dark");
    const meta = qs('meta[name="theme-color"]');
    if (meta) meta.setAttribute("content", "#0a0a0c");
  };

  JS.initTheme = initTheme;
})();
