// de-flock Alamo — shared layout helper
// Reads window.SITE_CONFIG, renders the header/nav/footer into each page.
// Also marks the current page as active in the nav.

(function () {
  "use strict";

  const C = window.SITE_CONFIG || {};
  const siteName = C.siteName || "de-flock Alamo";

  // Determine current page filename for nav highlighting
  const path = (location.pathname.split("/").pop() || "index.html").toLowerCase();

  // Build primary nav
  const navItems = [
    { href: "home.html",        label: "Home",         match: ["home.html"] },
    { href: "learning.html",    label: "Learning",       match: ["learning.html"] },
    { href: "documents.html",   label: "Documents",     match: ["documents.html"] },
    { href: "take-action.html", label: "Take action",   match: ["take-action.html"] },
    { href: "survey.html",      label: "Have your say", match: ["survey.html"] },
    { href: "about.html",       label: "About",         match: ["about.html"] },
  ];

  const navHtml = navItems.map(item => {
    const active = item.match.includes(path) ? " active" : "";
    return `<a href="${item.href}" class="${active.trim()}">${item.label}</a>`;
  }).join("");

  // Header
  const header = document.getElementById("site-header");
  if (header) {
    header.innerHTML = `
      <a href="index.html" class="brand">${siteName}</a>
      <nav class="primary" aria-label="Primary">${navHtml}</nav>
    `;
  }

  // Footer
  const footer = document.getElementById("site-footer");
  if (footer) {
    const year = new Date().getFullYear();
    const contact = C.contactEmail
      ? `Contact: <a href="mailto:${C.contactEmail}">${C.contactEmail}</a>`
      : "";
    const domain = C.domain ? C.domain : "";
    footer.innerHTML = `
      <p>${contact}</p>
      <p>${siteName} &middot; independent, community-run, no affiliation with any local government or vendor.</p>
      <p>This site does not collect analytics, cookies, or personal data. See <a href="privacy.html">privacy</a>.</p>
      <p class="small">&copy; ${year} &middot; ${domain}</p>
    `;
  }

  // Apply the tagline to <title> for any page that hasn't set its own
  const titleEl = document.querySelector("title[data-default]");
  if (titleEl && C.siteTagline) {
    const pageTitle = titleEl.getAttribute("data-default");
    document.title = `${pageTitle} — ${siteName}`;
  }
})();
