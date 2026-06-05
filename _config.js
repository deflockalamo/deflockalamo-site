// de-flock Alamo — public site config
// Edit this file to change the site name, area, articles, etc.
// It is loaded by every page via <script src="_config.js"></script>.
// Keep this file as plain JS (not JSON) so it works without a build step.
//
// Private values (contact email, etc.) live in `_config.private.js`.
// A safe placeholder is committed (contains no real data) so the browser
// never sees a 404. To set a real contact email, edit _config.private.js
// in your local clone and redeploy.

window.SITE_CONFIG = {
  // --- Identity ------------------------------------------------------------
  siteName: "de-flock Alamo",
  siteShortName: "de-flock Alamo",
  siteTagline: "Information about Flock ALPRs in Alamogordo, NM — and how to take action.",
  area: "Alamogordo, NM",
  region: "Otero County, New Mexico",
  state: "New Mexico",
  domain: "deflockalamo.org",          // registered
  started: "2026-06-03",               // site launch date (YYYY-MM-DD)
  // Real inbox is loaded from _config.private.js (committed as a no-op
  // placeholder; uncomment + edit locally to set a real address).
  // Pages should treat SITE_CONFIG.contactEmail as a string (could be the
  // placeholder, could be the real address).
  contactEmail: "contact (see privacy page)",
  // --- Hero ----------------------------------------------------------------
  heroEyebrow: "Community information hub",
  heroHeadline: "Flock ALPRs are watching our streets. We deserve to know — and to decide.",
  heroBody:
    "Automatic License Plate Readers made by Flock Safety have been deployed in our community. " +
    "This site collects news, public records, and practical information so Alamogordo residents can " +
    "understand what's happening and make their voices heard.",
  // --- Counts (update manually as the campaign grows) ---------------------
  camerasKnown: 0,                     // number of confirmed cameras
  // --- Curated article links ---------------------------------------------
  articles: {
    // Local
    localMurderCase: {
      title: "Alamogordo murder case: swift arrest of Matthew Weems and expanding crime",
      url:   "https://2ndlifemediaalamogordo.town.news/g/alamogordo-nm/n/350414/alamogordo-murder-case-swift-arrest-matthew-weems-and-expanding-crime",
      source: "2nd Life Media Alamogordo",
      blurb: "Local coverage of an arrest where ALPR data was cited. Included for context on how the system is being used here — not as an endorsement of mass surveillance."
    },
    // Statewide
    nmGuardrails: {
      title: "Privacy first: here's how NM can set guardrails on Flock cameras and surveillance tech",
      url:   "https://progressnownm.org/privacy-first-heres-how-nm-can-set-guardrails-on-flock-cameras-and-surveillance-tech/",
      source: "Progress Now New Mexico",
      blurb: "Statewide policy framing: what guardrails New Mexico could put in place, and what the current legislative landscape looks like."
    },
    // National
    denverAudit: {
      title: "Denver City Council members audit police department license plate camera data usage",
      url:   "https://www.9news.com/article/news/local/denver-city-councilmembers-police-department-audit-license-plate-camera-data-usage/73-3777d34d-7723-4397-af37-716a6db6ebd9",
      source: "9NEWS (Denver)",
      blurb: "Example of a city council auditing ALPR use after the fact — a model Alamogordo residents can ask our own council to follow."
    },
    nprOverview: {
      title: "Why some cities are canceling Flock license plate reader contracts",
      url:   "https://www.npr.org/2026/02/17/nx-s1-5612825/flock-contracts-canceled-immigration-survillance-concerns",
      source: "NPR",
      blurb: "Overview of municipal cancellations in Hillsborough NC, Flagstaff AZ, and elsewhere — and the \"good faith belief\" disclosure language that's fueling them."
    },
    effOverview: {
      title: "EFF's Investigations Expose Flock Safety's Surveillance Abuses: 2025 in Review",
      url:   "https://www.eff.org/deeplinks/2025/12/effs-investigations-expose-flock-safetys-surveillance-abuses-2025-review",
      source: "Electronic Frontier Foundation",
      blurb: "Why Flock's \"privacy enhancements\" (geofencing, retention limits) don't make ALPRs safe."
    },
    acluOverview: {
      title: "Flock's Aggressive Expansions Go Far Beyond Simple Driver Surveillance",
      url:   "https://www.aclu.org/news/privacy-technology/flock-roundup",
      source: "ACLU",
      blurb: "ACLU's Flock roundup — litigation, commentary, and the Nguyen v. State case on Fourth Amendment expectations of privacy."
    },
    berkeleyside: {
      title: "What are Flock cameras, and why are they controversial in Berkeley?",
      url:   "https://www.berkeleyside.org/2025/11/24/flock-safety-cameras-berkeley-license-plate-readers",
      source: "Berkeleyside",
      blurb: "Accessible explainer for a general audience with quotes from ACLU and EFF."
    },
    dayton: {
      title: "Dayton is covering Flock cameras with trash bags after officials found data use violated policy",
      url:   "https://fortune.com/2026/06/03/why-are-ohio-city-workers-covering-flock-cameras-immigration-enforcement-data-sharing-policy-violations/",
      source: "Fortune",
      blurb: "Concrete example of a city discovering data was being shared in ways the contract didn't allow — and the \"contractual trap\" problem with cancellation."
    },
    waPublicRecords: {
      title: "Washington Court Rules That Data Captured on Flock Safety Cameras Are Public Records",
      url:   "https://www.eff.org/deeplinks/2025/11/washington-court-rules-data-captured-flock-safety-cameras-are-public-records",
      source: "Electronic Frontier Foundation",
      blurb: "A Washington court ruled Flock-captured data are public records. Useful precedent for FOIA arguments in New Mexico."
    },
  },
  // --- Resources -----------------------------------------------------------
  resources: {
    forFlock: {
      title: "License Plate Reader Technology (Flock Safety) — NM Legislative Finance Committee handout",
      url:   "https://www.nmlegis.gov/handouts/STTC%20072925%20Item%205%20License%20Plate%20Reader%20Technology%20Flock%20Safety.pdf",
      source: "nmlegis.gov",
      blurb: "The official New Mexico legislative briefing on Flock technology — useful for understanding how the state frames the issue."
    },
    atlasAlamogordo: {
      title: "Alamogordo, NM on the Atlas of Surveillance",
      url:   "https://www.atlasofsurveillance.org/search?location=Alamogordo,+NM",
      source: "Electronic Frontier Foundation — Atlas of Surveillance",
      blurb: "EFF's searchable database of surveillance technologies deployed by local governments, including ALPRs."
    },
    effSlsAlprs: {
      title: "Automated License Plate Readers (ALPRs) — Self-Defense Resources",
      url:   "https://sls.eff.org/technologies/automated-license-plate-readers-alprs",
      source: "Electronic Frontier Foundation — Surveillance Self-Defense",
      blurb: "EFF's practical guide to ALPRs: what they do, what the law says, and what you can do."
    },
  },
  // --- Social / external (legacy aliases, still used by learning.html) ---
  links: {
    nprOverview:  "https://www.npr.org/2026/02/17/nx-s1-5612825/flock-contracts-canceled-immigration-survillance-concerns",
    effOverview:  "https://www.eff.org/deeplinks/2025/12/effs-investigations-expose-flock-safetys-surveillance-abuses-2025-review",
    acluOverview: "https://www.aclu.org/news/privacy-technology/flock-roundup",
  },
};

// Private overrides (committed as a no-op placeholder; edit + redeploy
// to set a real contact email). Loaded after the public config above.
if (typeof window !== "undefined") {
  var s = document.createElement("script");
  s.src = "_config.private.js";
  s.onerror = function () { /* private file not present — that's fine */ };
  document.head.appendChild(s);
}
