/**
 * CSS Variable Refactor Script (CRLF-aware)
 * Converts hardcoded hex colors in the visual refresh section into CSS variables.
 */

const fs = require('fs');
const path = require('path');

const cssPath = path.join(__dirname, '..', 'public', 'styles.css');
let css = fs.readFileSync(cssPath, 'utf8');

// Normalise line endings to LF for matching, restore CRLF at the end
const hasCRLF = css.includes('\r\n');
css = css.replace(/\r\n/g, '\n');

// ─────────────────────────────────────────────────────────────────────────────
// 1. NEW CSS VARIABLE DEFINITIONS
// ─────────────────────────────────────────────────────────────────────────────

const lightVars = `
  /* ── Visual Refresh Semantic Tokens (light) ── */
  --header-bg: rgba(252, 253, 250, 0.96);
  --header-border: rgba(23, 33, 29, 0.1);
  --brand-mark-bg: #0b5f4f;
  --nav-text: #4d5b53;
  --cta-bg: #0b6c59;
  --cta-hover: #075a4b;
  --hero-bg: #0b3d34;
  --hero-visual-bg: #0e5649;
  --hero-text: #fffdf8;
  --lime: #d8f06f;
  --lime-hover: #e4f98a;
  --lime-muted: #d7ef8b;
  --lime-text: #15352d;
  --hero-icon: #6b786f;
  --note-text: #66756c;
  --dot-green: #85a835;
  --dot-halo: #edf5cf;
  --strip-bg: #eef4ef;
  --strip-border: #dbe4dc;
  --strip-text: #4e6056;
  --strip-heading: #1e3930;
  --circle-btn-border: #cedbd1;
  --circle-btn-text: #234238;
  --tile-bg: #fdfefd;
  --tile-border: #e2e9e3;
  --tile-hover-border: #83b9a3;
  --tile-hover-bg: #f5faf6;
  --tile-hover-text: #173d32;
  --icon-border: #dbe8df;
  --icon-bg: #eef6ef;
  --icon-color: #176a59;
  --icon-design-border: #f0d8d1;
  --icon-design-bg: #fff0eb;
  --icon-design-color: #b95b47;
  --icon-tech-border: #d9e4f5;
  --icon-tech-bg: #edf4ff;
  --icon-tech-color: #4268a3;
  --icon-marketing-border: #f2e1bd;
  --icon-marketing-bg: #fff7e7;
  --icon-marketing-color: #a9731e;
  --icon-video-border: #e2d9f2;
  --icon-video-bg: #f4f0fb;
  --icon-video-color: #7863a8;
  --icon-writing-bg: #fff1ed;
  --icon-writing-color: #b65d4d;
  --icon-business-border: #d9e5df;
  --icon-business-bg: #eef6f1;
  --icon-business-color: #407564;
  --icon-ai-border: #d8e6ef;
  --icon-ai-bg: #edf6fa;
  --icon-ai-color: #34748b;
  --filter-bg: #eff4f0;
  --filter-border: #dbe4dc;
  --filter-text: #5f6d64;
  --filter-active-text: #19372d;
  --card-border: #e1e8e2;
  --card-hover-border: #a8cdbc;
  --theme-design-bg: #e4f3ee;
  --theme-design-color: #176a5c;
  --theme-tech-bg: #e8f0fa;
  --theme-tech-color: #3d6498;
  --theme-marketing-bg: #fff0e8;
  --theme-marketing-color: #ae6349;
  --theme-video-bg: #f0ebfb;
  --theme-video-color: #6d58a0;
  --theme-writing-bg: #fff0eb;
  --theme-writing-color: #a75b4c;
  --theme-business-bg: #edf3ef;
  --theme-business-color: #476c60;
  --theme-ai-bg: #e7f1f5;
  --theme-ai-color: #327288;
  --avatar-border: #d8eadc;
  --avatar-bg: #edf7ee;
  --avatar-color: #176a59;
  --dashboard-card-border: #dce5de;
  --dashboard-first-border: #8dc5ae;
  --dashboard-first-bg: #edf8ef;
  --dashboard-first-text: #15352d;
  --mini-btn-border: #d5e1d8;
  --pro-band-bg: #152720;
  --seller-band-bg: #0b4a3f;
  --eyebrow-color: #08735d;
  --footer-h3: #18392f;
  --footer-link: #607067;
  --footer-link-hover: #08735d;
  --dialog-border: #dce5de;
  --input-border: #d6e1d8;
  --meta-border: #eef1ee;
  --meta-text: #607168;
  --meta-icon: #3b7968;
  --price-muted: #74837b;
  --price-text: #15352d;
  --save-btn-border: #e0e7e1;
  --rating-text: #486156;
  --star-fill: #f1b644;
  --star-color: #c68b18;
  --seller-icon: #168064;
  --feature-text: #627067;
  --ledger-accent: #b9df8a;
  --toast-bg: #15352d;`;

const darkVars = `
  /* ── Visual Refresh Semantic Tokens (dark) ── */
  --header-bg: rgba(13, 21, 32, 0.96);
  --header-border: rgba(240, 246, 255, 0.08);
  --brand-mark-bg: #1a4a3a;
  --nav-text: #94a3b8;
  --cta-bg: #1bbf9c;
  --cta-hover: #14a888;
  --hero-bg: #060f1a;
  --hero-visual-bg: #06120e;
  --hero-text: #f0f6ff;
  --lime: #d8f06f;
  --lime-hover: #e4f98a;
  --lime-muted: #d7ef8b;
  --lime-text: #0d1f1a;
  --hero-icon: #94a3b8;
  --note-text: #94a3b8;
  --dot-green: #a0cc44;
  --dot-halo: #1a2e0a;
  --strip-bg: #0f1c14;
  --strip-border: #1e3326;
  --strip-text: #94a3b8;
  --strip-heading: #a0c8bc;
  --circle-btn-border: #2d4a3f;
  --circle-btn-text: #a0c8bc;
  --tile-bg: #111c14;
  --tile-border: #1e3326;
  --tile-hover-border: #2d6e58;
  --tile-hover-bg: #0f2018;
  --tile-hover-text: #a0d4c0;
  --icon-border: #1a3028;
  --icon-bg: #0f2018;
  --icon-color: #34d4b0;
  --icon-design-border: #3d1a14;
  --icon-design-bg: #1f0e0a;
  --icon-design-color: #fc7a8a;
  --icon-tech-border: #0e2840;
  --icon-tech-bg: #061828;
  --icon-tech-color: #60b3fa;
  --icon-marketing-border: #3d2c0a;
  --icon-marketing-bg: #1f1608;
  --icon-marketing-color: #fbbf24;
  --icon-video-border: #2d1f4a;
  --icon-video-bg: #160d2a;
  --icon-video-color: #a78bfa;
  --icon-writing-bg: #1f0e0a;
  --icon-writing-color: #fc7a8a;
  --icon-business-border: #1a3028;
  --icon-business-bg: #0f2018;
  --icon-business-color: #34d4b0;
  --icon-ai-border: #0e2840;
  --icon-ai-bg: #061828;
  --icon-ai-color: #60b3fa;
  --filter-bg: #0f1c14;
  --filter-border: #1e3326;
  --filter-text: #94a3b8;
  --filter-active-text: #e0f0e8;
  --card-border: #1e3326;
  --card-hover-border: #2d6e58;
  --theme-design-bg: #0f2018;
  --theme-design-color: #34d4b0;
  --theme-tech-bg: #061828;
  --theme-tech-color: #60b3fa;
  --theme-marketing-bg: #1f1608;
  --theme-marketing-color: #fc7a8a;
  --theme-video-bg: #160d2a;
  --theme-video-color: #a78bfa;
  --theme-writing-bg: #1f0e0a;
  --theme-writing-color: #fc7a8a;
  --theme-business-bg: #0f2018;
  --theme-business-color: #34d4b0;
  --theme-ai-bg: #061828;
  --theme-ai-color: #60b3fa;
  --avatar-border: #1a3028;
  --avatar-bg: #0f2018;
  --avatar-color: #34d4b0;
  --dashboard-card-border: #1e3326;
  --dashboard-first-border: #2d6e58;
  --dashboard-first-bg: #0a1c10;
  --dashboard-first-text: #c0d8d0;
  --mini-btn-border: #1e3326;
  --pro-band-bg: #060e12;
  --seller-band-bg: #060e12;
  --eyebrow-color: #34d4b0;
  --footer-h3: #c0d8d0;
  --footer-link: #94a3b8;
  --footer-link-hover: #34d4b0;
  --dialog-border: #1e3326;
  --input-border: #2d4a3f;
  --meta-border: #1e3326;
  --meta-text: #94a3b8;
  --meta-icon: #34d4b0;
  --price-muted: #94a3b8;
  --price-text: #e0f0e8;
  --save-btn-border: #1e3326;
  --rating-text: #94a3b8;
  --star-fill: #fbbf24;
  --star-color: #d4a017;
  --seller-icon: #34d4b0;
  --feature-text: #94a3b8;
  --ledger-accent: #4d7c1f;
  --toast-bg: #162030;`;

// ─────────────────────────────────────────────────────────────────────────────
// 2. INJECT VARIABLES INTO :root blocks
// ─────────────────────────────────────────────────────────────────────────────

// Inject into the visual refresh :root (second :root, paper-rgb: 252, 253, 250)
css = css.replace(
  /--paper-rgb: 252, 253, 250;\n\}/,
  `--paper-rgb: 252, 253, 250;${lightVars}\n}`
);

// Inject into the dark override block (after visual refresh)
css = css.replace(
  /--paper-rgb: 13, 21, 32;\n  color-scheme: dark;\n\}/,
  `--paper-rgb: 13, 21, 32;\n  color-scheme: dark;${darkVars}\n}`
);

// ─────────────────────────────────────────────────────────────────────────────
// 3. INLINE REPLACEMENTS (all using \n now that CRLF is normalised)
// ─────────────────────────────────────────────────────────────────────────────

const replacements = [
  // Header
  ['background: rgba(252, 253, 250, 0.96)', 'background: var(--header-bg)'],
  ['border-bottom-color: rgba(23, 33, 29, 0.1)', 'border-bottom-color: var(--header-border)'],

  // Brand mark
  ['background: #0b5f4f;\n  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.16)',
   'background: var(--brand-mark-bg);\n  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.16)'],

  // Nav text - exact line
  ['  color: #4d5b53;\n  font-size: 0.9rem;\n  font-weight: 760;',
   '  color: var(--nav-text);\n  font-size: 0.9rem;\n  font-weight: 760;'],

  // Join button
  ['  background: #0b6c59;\n  box-shadow: 0 8px 18px rgba(8, 115, 93, 0.16)',
   '  background: var(--cta-bg);\n  box-shadow: 0 8px 18px rgba(8, 115, 93, 0.16)'],
  ['  background: #075a4b;\n  box-shadow: 0 12px 24px rgba(8, 115, 93, 0.22)',
   '  background: var(--cta-hover);\n  box-shadow: 0 12px 24px rgba(8, 115, 93, 0.22)'],

  // Hero bg
  ['  background: #0b3d34;\n}\n\n.hero::after',
   '  background: var(--hero-bg);\n}\n\n.hero::after'],

  // Hero content text
  ['  color: #fffdf8;\n  animation: hero-enter',
   '  color: var(--hero-text);\n  animation: hero-enter'],

  // Hero eyebrow
  ['  color: #d7ef8b;\n  font-size: 0.72rem;\n  font-weight: 800;\n  letter-spacing: 0.04em;\n  opacity: 1;\n}\n\nh1 {',
   '  color: var(--lime-muted);\n  font-size: 0.72rem;\n  font-weight: 800;\n  letter-spacing: 0.04em;\n  opacity: 1;\n}\n\nh1 {'],

  // Hero search icon
  ['  color: #6b786f;\n}\n\n.hero-search input',
   '  color: var(--hero-icon);\n}\n\n.hero-search input'],

  // Hero search button
  ['  background: #d8f06f;\n  color: #15352d;\n  font-size: 0.9rem;\n  font-weight: 850;\n}\n\n.hero-search button i',
   '  background: var(--lime);\n  color: var(--lime-text);\n  font-size: 0.9rem;\n  font-weight: 850;\n}\n\n.hero-search button i'],

  // Hero search button hover
  ['  background: #e4f98a;\n}\n\n.trend-row {',
   '  background: var(--lime-hover);\n}\n\n.trend-row {'],

  // Trend row button hover
  ['  border-color: #d8f06f;\n  color: #d8f06f;\n}\n\n.hero-assurances',
   '  border-color: var(--lime);\n  color: var(--lime);\n}\n\n.hero-assurances'],

  // Hero visual bg
  ['  background: #0e5649;\n}\n\n.hero-visual img',
   '  background: var(--hero-visual-bg);\n}\n\n.hero-visual img'],

  // Visual note text color
  ['  color: #15352d;\n}\n\n.visual-note-top',
   '  color: var(--lime-text);\n}\n\n.visual-note-top'],

  // Visual note top icon
  ['  color: #08735d;\n}\n\n.visual-note-bottom {',
   '  color: var(--eyebrow-color);\n}\n\n.visual-note-bottom {'],

  // Visual note bottom muted text
  ['  color: #66756c;\n  font-size: 0.73rem;\n}',
   '  color: var(--note-text);\n  font-size: 0.73rem;\n}'],

  // Note dot
  ['  background: #85a835;\n  box-shadow: 0 0 0 4px #edf5cf;',
   '  background: var(--dot-green);\n  box-shadow: 0 0 0 4px var(--dot-halo);'],

  // Trusted strip
  ['  border-bottom: 1px solid #dbe4dc;\n  background: #eef4ef;\n  color: #4e6056;',
   '  border-bottom: 1px solid var(--strip-border);\n  background: var(--strip-bg);\n  color: var(--strip-text);'],
  ['.trusted-strip .trust-intro {\n  color: #1e3930;',
   '.trusted-strip .trust-intro {\n  color: var(--strip-heading);'],
  ['.trusted-strip i {\n  width: 16px;\n  height: 16px;\n  color: #08735d;',
   '.trusted-strip i {\n  width: 16px;\n  height: 16px;\n  color: var(--eyebrow-color);'],

  // Section eyebrow
  ['.section-heading .eyebrow,\n.feature-copy .eyebrow,\n.pro-band .eyebrow,\n.seller-copy .eyebrow {\n  color: #08735d;',
   '.section-heading .eyebrow,\n.feature-copy .eyebrow,\n.pro-band .eyebrow,\n.seller-copy .eyebrow {\n  color: var(--eyebrow-color);'],

  // Circle button
  ['  border-color: #cedbd1;\n  border-radius: 6px;\n  background: var(--paper);\n  color: #234238;',
   '  border-color: var(--circle-btn-border);\n  border-radius: 6px;\n  background: var(--paper);\n  color: var(--circle-btn-text);'],

  // Category tile
  ['  border-color: #e2e9e3;\n  border-radius: 7px;\n  background: #fdfefd;\n  box-shadow: none;',
   '  border-color: var(--tile-border);\n  border-radius: 7px;\n  background: var(--tile-bg);\n  box-shadow: none;'],

  // Category icon default
  ['  border: 1px solid #dbe8df;\n  border-radius: 7px;\n  background: #eef6ef;\n  color: #176a59;',
   '  border: 1px solid var(--icon-border);\n  border-radius: 7px;\n  background: var(--icon-bg);\n  color: var(--icon-color);'],

  // Category icon: design
  ['  border-color: #f0d8d1;\n  background: #fff0eb;\n  color: #b95b47;\n}\n\n.category-tile[data-category="tech"] .category-icon',
   '  border-color: var(--icon-design-border);\n  background: var(--icon-design-bg);\n  color: var(--icon-design-color);\n}\n\n.category-tile[data-category="tech"] .category-icon'],

  // Category icon: tech
  ['  border-color: #d9e4f5;\n  background: #edf4ff;\n  color: #4268a3;\n}\n\n.category-tile[data-category="marketing"] .category-icon',
   '  border-color: var(--icon-tech-border);\n  background: var(--icon-tech-bg);\n  color: var(--icon-tech-color);\n}\n\n.category-tile[data-category="marketing"] .category-icon'],

  // Category icon: marketing
  ['  border-color: #f2e1bd;\n  background: #fff7e7;\n  color: #a9731e;\n}\n\n.category-tile[data-category="video"] .category-icon',
   '  border-color: var(--icon-marketing-border);\n  background: var(--icon-marketing-bg);\n  color: var(--icon-marketing-color);\n}\n\n.category-tile[data-category="video"] .category-icon'],

  // Category icon: video
  ['  border-color: #e2d9f2;\n  background: #f4f0fb;\n  color: #7863a8;\n}\n\n.category-tile[data-category="writing"] .category-icon',
   '  border-color: var(--icon-video-border);\n  background: var(--icon-video-bg);\n  color: var(--icon-video-color);\n}\n\n.category-tile[data-category="writing"] .category-icon'],

  // Category icon: writing
  ['  border-color: #f0d8d1;\n  background: #fff1ed;\n  color: #b65d4d;\n}\n\n.category-tile[data-category="business"] .category-icon',
   '  border-color: var(--icon-design-border);\n  background: var(--icon-writing-bg);\n  color: var(--icon-writing-color);\n}\n\n.category-tile[data-category="business"] .category-icon'],

  // Category icon: business
  ['  border-color: #d9e5df;\n  background: #eef6f1;\n  color: #407564;\n}\n\n.category-tile[data-category="ai"] .category-icon',
   '  border-color: var(--icon-business-border);\n  background: var(--icon-business-bg);\n  color: var(--icon-business-color);\n}\n\n.category-tile[data-category="ai"] .category-icon'],

  // Category icon: ai
  ['  border-color: #d8e6ef;\n  background: #edf6fa;\n  color: #34748b;',
   '  border-color: var(--icon-ai-border);\n  background: var(--icon-ai-bg);\n  color: var(--icon-ai-color);'],

  // Category tile hover/active
  ['  border-color: #83b9a3;\n  background: #f5faf6;\n  box-shadow: 0 8px 18px rgba(23, 55, 45, 0.06);\n  color: #173d32;',
   '  border-color: var(--tile-hover-border);\n  background: var(--tile-hover-bg);\n  box-shadow: 0 8px 18px rgba(23, 55, 45, 0.06);\n  color: var(--tile-hover-text);'],

  // Service filter
  ['  border-color: #dbe4dc;\n  border-radius: 6px;\n  background: #eff4f0;',
   '  border-color: var(--filter-border);\n  border-radius: 6px;\n  background: var(--filter-bg);'],
  ['.service-filter button {\n  min-height: 34px;\n  padding: 0 11px;\n  border-radius: 4px;\n  color: #5f6d64;',
   '.service-filter button {\n  min-height: 34px;\n  padding: 0 11px;\n  border-radius: 4px;\n  color: var(--filter-text);'],
  ['  background: var(--paper);\n  color: #19372d;\n  box-shadow: 0 2px 8px rgba(23, 33, 29, 0.08);',
   '  background: var(--paper);\n  color: var(--filter-active-text);\n  box-shadow: 0 2px 8px rgba(23, 33, 29, 0.08);'],

  // Service card
  ['.service-card {\n  border-color: #e1e8e2;',
   '.service-card {\n  border-color: var(--card-border);'],
  ['.service-card:hover {\n  border-color: #a8cdbc;',
   '.service-card:hover {\n  border-color: var(--card-hover-border);'],

  // Theme classes
  ['.theme-design {\n  background: #e4f3ee;\n  color: #176a5c;\n}',
   '.theme-design {\n  background: var(--theme-design-bg);\n  color: var(--theme-design-color);\n}'],
  ['.theme-tech {\n  background: #e8f0fa;\n  color: #3d6498;\n}',
   '.theme-tech {\n  background: var(--theme-tech-bg);\n  color: var(--theme-tech-color);\n}'],
  ['.theme-marketing {\n  background: #fff0e8;\n  color: #ae6349;\n}',
   '.theme-marketing {\n  background: var(--theme-marketing-bg);\n  color: var(--theme-marketing-color);\n}'],
  ['.theme-video {\n  background: #f0ebfb;\n  color: #6d58a0;\n}',
   '.theme-video {\n  background: var(--theme-video-bg);\n  color: var(--theme-video-color);\n}'],
  ['.theme-writing {\n  background: #fff0eb;\n  color: #a75b4c;\n}',
   '.theme-writing {\n  background: var(--theme-writing-bg);\n  color: var(--theme-writing-color);\n}'],
  ['.theme-business {\n  background: #edf3ef;\n  color: #476c60;\n}',
   '.theme-business {\n  background: var(--theme-business-bg);\n  color: var(--theme-business-color);\n}'],
  ['.theme-ai {\n  background: #e7f1f5;\n  color: #327288;\n}',
   '.theme-ai {\n  background: var(--theme-ai-bg);\n  color: var(--theme-ai-color);\n}'],

  // Avatar
  ['  border: 1px solid #d8eadc;\n  background: #edf7ee;\n  color: #176a59;\n}',
   '  border: 1px solid var(--avatar-border);\n  background: var(--avatar-bg);\n  color: var(--avatar-color);\n}'],

  // Seller level icon
  ['.seller-level i {\n  width: 13px;\n  height: 13px;\n  color: #168064;\n}',
   '.seller-level i {\n  width: 13px;\n  height: 13px;\n  color: var(--seller-icon);\n}'],

  // Rating
  ['.rating-score {\n  color: #486156;\n}',
   '.rating-score {\n  color: var(--rating-text);\n}'],
  ['  fill: #f1b644;\n  color: #c68b18;',
   '  fill: var(--star-fill);\n  color: var(--star-color);'],

  // Service meta
  ['  border-top: 1px solid #eef1ee;\n  border-bottom: 1px solid #eef1ee;\n  color: #607168;',
   '  border-top: 1px solid var(--meta-border);\n  border-bottom: 1px solid var(--meta-border);\n  color: var(--meta-text);'],
  ['.service-meta i {\n  width: 14px;\n  height: 14px;\n  color: #3b7968;',
   '.service-meta i {\n  width: 14px;\n  height: 14px;\n  color: var(--meta-icon);'],

  // Price row
  ['.price-row > span {\n  color: #74837b;\n}',
   '.price-row > span {\n  color: var(--price-muted);\n}'],
  ['.price-row strong {\n  color: #15352d;',
   '.price-row strong {\n  color: var(--price-text);'],

  // Save button
  ['  height: 34px;\n  border-color: #e0e7e1;',
   '  height: 34px;\n  border-color: var(--save-btn-border);'],

  // Dashboard card border
  ['  border-color: #dce5de;\n  border-radius: 7px;\n  box-shadow: 0 10px 24px rgba(23, 33, 29, 0.06);',
   '  border-color: var(--dashboard-card-border);\n  border-radius: 7px;\n  box-shadow: 0 10px 24px rgba(23, 33, 29, 0.06);'],

  // Dashboard first card
  ['.dashboard-card:first-child {\n  border-color: #8dc5ae;\n  background: #edf8ef;\n}',
   '.dashboard-card:first-child {\n  border-color: var(--dashboard-first-border);\n  background: var(--dashboard-first-bg);\n}'],
  ['.dashboard-card strong {\n  color: #15352d;\n}',
   '.dashboard-card strong {\n  color: var(--dashboard-first-text);\n}'],

  // Mini button
  ['.mini-button {\n  border-color: #d5e1d8;',
   '.mini-button {\n  border-color: var(--mini-btn-border);'],
  ['.mini-button.primary {\n  border-color: #0b6c59;\n  background: #0b6c59;\n}',
   '.mini-button.primary {\n  border-color: var(--cta-bg);\n  background: var(--cta-bg);\n}'],

  // Pro band
  ['  background: #152720;\n  color: #fffdf8;\n}\n\n.pro-band > div',
   '  background: var(--pro-band-bg);\n  color: var(--hero-text);\n}\n\n.pro-band > div'],
  ['.pro-band .eyebrow {\n  color: #d8f06f;\n}',
   '.pro-band .eyebrow {\n  color: var(--lime-muted);\n}'],

  // Dark button
  ['.dark-button {\n  flex: 0 0 auto;\n  background: #d8f06f;\n  color: #15352d;\n}\n\n.dark-button:hover {\n  background: #e4f98a;\n}',
   '.dark-button {\n  flex: 0 0 auto;\n  background: var(--lime);\n  color: var(--lime-text);\n}\n\n.dark-button:hover {\n  background: var(--lime-hover);\n}'],

  // Feature copy
  ['.feature-copy p {\n  color: #627067;\n}',
   '.feature-copy p {\n  color: var(--feature-text);\n}'],

  // Escrow strong
  ['.escrow-card-top strong {\n  color: #15352d;\n}',
   '.escrow-card-top strong {\n  color: var(--dashboard-first-text);\n}'],

  // Mini ledger
  ['.mini-ledger p {\n  border-left: 3px solid #b9df8a;',
   '.mini-ledger p {\n  border-left: 3px solid var(--ledger-accent);'],

  // Seller band
  ['  background: #0b4a3f;\n}\n\n.seller-copy .eyebrow',
   '  background: var(--seller-band-bg);\n}\n\n.seller-copy .eyebrow'],
  ['.seller-copy .eyebrow {\n  color: #d8f06f;\n}',
   '.seller-copy .eyebrow {\n  color: var(--lime-muted);\n}'],

  // Light button
  ['.light-button {\n  background: #fffdf8;\n  color: #15352d;\n}',
   '.light-button {\n  background: var(--hero-text);\n  color: var(--lime-text);\n}'],

  // Footer
  ['.footer-brand h2 {\n  color: #0b5f4f;',
   '.footer-brand h2 {\n  color: var(--brand-mark-bg);'],
  ['.footer-columns h3 {\n  color: #18392f;\n}',
   '.footer-columns h3 {\n  color: var(--footer-h3);\n}'],
  ['.footer-columns a {\n  color: #607067;\n}',
   '.footer-columns a {\n  color: var(--footer-link);\n}'],
  ['.footer-columns a:hover {\n  color: #08735d;\n}',
   '.footer-columns a:hover {\n  color: var(--footer-link-hover);\n}'],

  // Dialog
  ['.market-dialog {\n  border: 1px solid #dce5de;',
   '.market-dialog {\n  border: 1px solid var(--dialog-border);'],

  // Input border
  ['  border-color: #d6e1d8;\n  border-radius: 5px;\n}',
   '  border-color: var(--input-border);\n  border-radius: 5px;\n}'],

  // Toast
  ['  background: #15352d;\n}\n\n@keyframes hero-enter',
   '  background: var(--toast-bg);\n}\n\n@keyframes hero-enter'],
];

// ─────────────────────────────────────────────────────────────────────────────
// 4. APPLY REPLACEMENTS
// ─────────────────────────────────────────────────────────────────────────────

let ok = 0, fail = 0;
for (const [find, replace] of replacements) {
  if (css.includes(find)) {
    css = css.replace(find, replace);
    ok++;
  } else {
    console.warn(`⚠️  NOT FOUND: ${find.substring(0, 70).replace(/\n/g, '\\n')}`);
    fail++;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. RESTORE CRLF & WRITE
// ─────────────────────────────────────────────────────────────────────────────

if (hasCRLF) css = css.replace(/\n/g, '\r\n');
fs.writeFileSync(cssPath, css, 'utf8');
console.log(`\n✅ Done!  ${ok} replacements applied, ${fail} not found.`);
