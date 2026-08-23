/* ============================================================
   projects.js â€” portfolio data + renderer
   Single source of truth for the work section. Add real projects
   by replacing the placeholders below â€” no markup changes needed.

   To swap a generated cover for a real screenshot, set:
     image: "assets/images/your-shot.jpg"
   and the renderer will use it instead of the generated canvas.
   ============================================================ */
(function () {
  "use strict";

  const JS = (window.JStudio = window.JStudio || {});
  const { qs } = JS.utils;

  const projects = [
    {
      id: "grand-homes",
      index: "01",
      name: "Grand Homes",
      industry: "Real Estate",
      description:
        "A premium real estate website built to show off luxury property with the clarity and confidence serious buyers expect.",
      role: "Web Design / Frontend Development",
      tech: "HTML Â· CSS Â· JavaScript",
      href: "https://john-realestate.netlify.app/",
      status: "flagship", // flagship | live | placeholder
      accent: "#2f6f5e",
      image: "assets/images/grand-homes.png",
    },
    {
      id: "excess-energy",
      index: "02",
      name: "Excess Energy",
      industry: "Solar Company",
      description:
        "A modern solar energy website designed to present reliable power solutions clearly and turn interest into assessment requests.",
      role: "Web Design / Frontend Development",
      tech: "HTML Â· CSS Â· JavaScript",
      href: "https://excessenergy.app",
      status: "live",
      accent: "#fbbf24",
      image: "assets/images/excess-energy.png",
    },
    {
      id: "ayshot-portfolio",
      index: "03",
      name: "Ayshot Portfolio",
      industry: "Creative Portfolio",
      description:
        "A cinematic portfolio website for a videographer and editor, built to showcase visual work, communicate a distinct creative identity, and turn interest into session bookings.",
      role: "Web Design / Frontend Development",
      tech: "HTML Â· CSS Â· JavaScript",
      href: "https://ayshot-portfolio.vercel.app/",
      status: "live",
      accent: "#b91c1c",
      image: "assets/images/ayshot-portfolio.png",
    },
    {
      id: "wakabout",
      index: "04",
      name: "Wakabout",
      industry: "Mobility & Transportation",
      description:
        "A modern waitlist landing page for a mobility platform, designed to introduce a simpler way to move, build early interest, and turn visitors into launch-ready users.",
      role: "Web Design / Frontend Development",
      tech: "HTML Â· CSS Â· JavaScript",
      href: "https://new-wakabout-waitlist.onrender.com/?ref=WAKAJM94",
      status: "live",
      accent: "#fdeb8c",
      image: "assets/images/wakabout.png",
    },
    {
      id: "shine-restaurant",
      index: "05",
      name: "Shine Restaurant",
      industry: "Restaurant & Hospitality",
      description:
        "An immersive restaurant website designed to showcase Shine's menu, atmosphere, and dining experience while guiding guests toward a visit.",
      role: "Web Design / Frontend Development",
      tech: "HTML Â· CSS Â· JavaScript",
      href: "https://shiny-restaurant.vercel.app/",
      status: "live",
      accent: "#d89b32",
      image: "assets/images/shine-restaurant.png",
    },
  ];

  /* ---- Cover markup -------------------------------------- */

  const silhouette = () =>
    `<span class="cover-canvas__silhouette" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i><i></i></span>`;

  const coverFor = (p) => {
    if (p.image) {
      return `<span class="project__cover"><img src="${p.image}" alt="Preview of the ${p.name} website" loading="lazy" decoding="async" /></span>`;
    }
    if (p.status === "placeholder") {
      return `
        <span class="project__cover">
          <span class="cover-canvas cover-canvas--empty" style="--proj-accent:${p.accent}">
            <span class="cover-plus" aria-hidden="true">
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none">
                <path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>
              </svg>
            </span>
            <span class="cover-canvas__label">Project slot<span>Open â€” coming soon</span></span>
          </span>
        </span>`;
    }
    // live / flagship generated cover
    return `
      <span class="project__cover">
        <span class="cover-canvas" style="--proj-accent:${p.accent}">
          ${silhouette()}
          <span class="cover-canvas__label">${p.name}<span>${p.industry} â€” Live</span></span>
        </span>
      </span>`;
  };

  const badgeFor = (p) => {
    return "";
  };

  const mediaFor = (p) => {
    const inner = `${badgeFor(p)}${coverFor(p)}`;
    if (p.href) {
      return `<a class="project__media" href="${p.href}" target="_blank" rel="noopener" aria-label="View the ${p.name} live website">${inner}</a>`;
    }
    return `<div class="project__media" aria-hidden="true">${inner}</div>`;
  };

  const linkFor = (p) => {
    if (p.href) {
      return `
        <a class="link link--accent project__link" href="${p.href}" target="_blank" rel="noopener">
          View this project
          <svg class="link__arrow" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M7 17 17 7M9 7h8v8" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </a>`;
    }
    return `<span class="link project__link project__link--muted">Coming soon</span>`;
  };

  const topFor = (p) => {
    const tag =
      p.status === "flagship"
        ? `${p.index} / Flagship`
        : p.status === "placeholder"
        ? `${p.index} / Slot`
        : p.index;
    return `
      <div class="project__top">
        <span class="project__index">${tag}</span>
        <span class="dot"></span>
        <span>${p.industry}</span>
      </div>`;
  };

  const cardFor = (p) => {
    const flagship = p.status === "flagship";
    const article = document.createElement("article");
    article.className = "project" + (flagship ? " project--flagship" : "");
    article.setAttribute("data-reveal", "");
    article.innerHTML = `
      ${mediaFor(p)}
      <div class="project__body">
        ${topFor(p)}
        <h3 class="project__name">${p.name}</h3>
        <p class="project__desc">${p.description}</p>
        ${linkFor(p)}
      </div>`;
    return article;
  };

  /**
   * Render all projects into #work-grid, replacing the static
   * flagship (kept for no-JS/SEO) with the full data-driven set.
   */
  const renderProjects = () => {
    const grid = qs("#work-grid");
    if (!grid) return;
    const frag = document.createDocumentFragment();
    projects.forEach((p) => frag.appendChild(cardFor(p)));
    grid.replaceChildren(frag);
  };

  JS.projects = projects;
  JS.renderProjects = renderProjects;
})();

