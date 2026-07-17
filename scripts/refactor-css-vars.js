/**
 * CSS Variable Refactor Script
 * Converts hardcoded hex colors in the visual refresh section into CSS variables
 * with proper light and dark mode values.
 *
 * Run: node scripts/refactor-css-vars.js
 */

const fs = require('fs');
const path = require('path');

const cssPath = path.join(__dirname, '..', 'public', 'styles.css');
let css = fs.readFileSync(cssPath, 'utf8');

// ─────────────────────────────────────────────────────────────────────────────
// 1. NEW CSS VARIABLE DEFINITIONS (injected into :root and [data-theme="dark"])
// ─────────────────────────────────────────────────────────────────────────────

const lightVars = `
  /* ── Visual Refresh Semantic Tokens (light) ── */
  /* Header */
  --header-bg: rgba(252, 253, 250, 0.96);
  --header-border: rgba(23, 33, 29, 0.1);
  /* Brand */
  --brand-mark-bg: #0b5f4f;
  /* Nav */
  --nav-text: #4d5b53;
  /* CTA buttons */
  --cta-bg: #0b6c59;
  --cta-hover: #075a4b;
  /* Hero (always dark bg – text stays light in both modes) */
  --hero-bg: #0b3d34;
  --hero-visual-bg: #0e5649;
  --hero-text: #fffdf8;
  --lime: #d8f06f;
  --lime-hover: #e4f98a;
  --lime-muted: #d7ef8b;
  --lime-text: #15352d;
  --hero-icon: #6b786f;
  --note-text: #66756c;
  /* Note dot */
  --dot-green: #85a835;
  --dot-halo: #edf5cf;
  /* Trusted strip */
  --strip-bg: #eef4ef;
  --strip-border: #dbe4dc;
  --strip-text: #4e6056;
  --strip-heading: #1e3930;
  /* Circle button */
  --circle-btn-border: #cedbd1;
  --circle-btn-text: #234238;
  /* Category tiles */
  --tile-bg: #fdfefd;
  --tile-border: #e2e9e3;
  --tile-hover-border: #83b9a3;
  --tile-hover-bg: #f5faf6;
  --tile-hover-text: #173d32;
  /* Category icon defaults (writing/general) */
  --icon-border: #dbe8df;
  --icon-bg: #eef6ef;
  --icon-color: #176a59;
  /* Category icon: design */
  --icon-design-border: #f0d8d1;
  --icon-design-bg: #fff0eb;
  --icon-design-color: #b95b47;
  /* Category icon: tech */
  --icon-tech-border: #d9e4f5;
  --icon-tech-bg: #edf4ff;
  --icon-tech-color: #4268a3;
  /* Category icon: marketing */
  --icon-marketing-border: #f2e1bd;
  --icon-marketing-bg: #fff7e7;
  --icon-marketing-color: #a9731e;
  /* Category icon: video */
  --icon-video-border: #e2d9f2;
  --icon-video-bg: #f4f0fb;
  --icon-video-color: #7863a8;
  /* Category icon: writing */
  --icon-writing-bg: #fff1ed;
  --icon-writing-color: #b65d4d;
  /* Category icon: business */
  --icon-business-border: #d9e5df;
  --icon-business-bg: #eef6f1;
  --icon-business-color: #407564;
  /* Category icon: ai */
  --icon-ai-border: #d8e6ef;
  --icon-ai-bg: #edf6fa;
  --icon-ai-color: #34748b;
  /* Service filter */
  --filter-bg: #eff4f0;
  --filter-border: #dbe4dc;
  --filter-text: #5f6d64;
  --filter-active-text: #19372d;
  /* Service card */
  --card-border: #e1e8e2;
  --card-hover-border: #a8cdbc;
  /* Service theme classes */
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
  /* Avatar */
  --avatar-border: #d8eadc;
  --avatar-bg: #edf7ee;
  --avatar-color: #176a59;
  /* Dashboard card */
  --dashboard-card-border: #dce5de;
  --dashboard-first-border: #8dc5ae;
  --dashboard-first-bg: #edf8ef;
  --dashboard-first-text: #15352d;
  /* Mini button */
  --mini-btn-border: #d5e1d8;
  /* Pro / Seller bands */
  --pro-band-bg: #152720;
  --seller-band-bg: #0b4a3f;
  /* Eyebrow color */
  --eyebrow-color: #08735d;
  /* Footer */
  --footer-h3: #18392f;
  --footer-link: #607067;
  --footer-link-hover: #08735d;
  /* Dialog / form */
  --dialog-border: #dce5de;
  --input-border: #d6e1d8;
  /* Service meta */
  --meta-border: #eef1ee;
  --meta-text: #607168;
  --meta-icon: #3b7968;
  /* Price row */
  --price-muted: #74837b;
  --price-text: #15352d;
  /* Save button */
  --save-btn-border: #e0e7e1;
  /* Rating */
  --rating-text: #486156;
  --star-fill: #f1b644;
  --star-color: #c68b18;
  /* Seller level icon */
  --seller-icon: #168064;
  /* Feature copy */
  --feature-text: #627067;
  /* Ledger */
  --ledger-accent: #b9df8a;
  /* Toast */
  --toast-bg: #15352d;`;

const darkVars = `
  /* ── Visual Refresh Semantic Tokens (dark) ── */
  /* Header */
  --header-bg: rgba(13, 21, 32, 0.96);
  --header-border: rgba(240, 246, 255, 0.08);
  /* Brand */
  --brand-mark-bg: #1a4a3a;
  /* Nav */
  --nav-text: #94a3b8;
  /* CTA buttons */
  --cta-bg: #1bbf9c;
  --cta-hover: #14a888;
  /* Hero (always dark bg – text stays light in both modes) */
  --hero-bg: #060f1a;
  --hero-visual-bg: #06120e;
  --hero-text: #f0f6ff;
  --lime: #d8f06f;
  --lime-hover: #e4f98a;
  --lime-muted: #d7ef8b;
  --lime-text: #0d1f1a;
  --hero-icon: #94a3b8;
  --note-text: #94a3b8;
  /* Note dot */
  --dot-green: #a0cc44;
  --dot-halo: #1a2e0a;
  /* Trusted strip */
  --strip-bg: #0f1c14;
  --strip-border: #1e3326;
  --strip-text: #94a3b8;
  --strip-heading: #a0c8bc;
  /* Circle button */
  --circle-btn-border: #2d4a3f;
  --circle-btn-text: #a0c8bc;
  /* Category tiles */
  --tile-bg: #111c14;
  --tile-border: #1e3326;
  --tile-hover-border: #2d6e58;
  --tile-hover-bg: #0f2018;
  --tile-hover-text: #a0d4c0;
  /* Category icon defaults (writing/general) */
  --icon-border: #1a3028;
  --icon-bg: #0f2018;
  --icon-color: #34d4b0;
  /* Category icon: design */
  --icon-design-border: #3d1a14;
  --icon-design-bg: #1f0e0a;
  --icon-design-color: #fc7a8a;
  /* Category icon: tech */
  --icon-tech-border: #0e2840;
  --icon-tech-bg: #061828;
  --icon-tech-color: #60b3fa;
  /* Category icon: marketing */
  --icon-marketing-border: #3d2c0a;
  --icon-marketing-bg: #1f1608;
  --icon-marketing-color: #fbbf24;
  /* Category icon: video */
  --icon-video-border: #2d1f4a;
  --icon-video-bg: #160d2a;
  --icon-video-color: #a78bfa;
  /* Category icon: writing */
  --icon-writing-bg: #1f0e0a;
  --icon-writing-color: #fc7a8a;
  /* Category icon: business */
  --icon-business-border: #1a3028;
  --icon-business-bg: #0f2018;
  --icon-business-color: #34d4b0;
  /* Category icon: ai */
  --icon-ai-border: #0e2840;
  --icon-ai-bg: #061828;
  --icon-ai-color: #60b3fa;
  /* Service filter */
  --filter-bg: #0f1c14;
  --filter-border: #1e3326;
  --filter-text: #94a3b8;
  --filter-active-text: #e0f0e8;
  /* Service card */
  --card-border: #1e3326;
  --card-hover-border: #2d6e58;
  /* Service theme classes */
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
  /* Avatar */
  --avatar-border: #1a3028;
  --avatar-bg: #0f2018;
  --avatar-color: #34d4b0;
  /* Dashboard card */
  --dashboard-card-border: #1e3326;
  --dashboard-first-border: #2d6e58;
  --dashboard-first-bg: #0a1c10;
  --dashboard-first-text: #c0d8d0;
  /* Mini button */
  --mini-btn-border: #1e3326;
  /* Pro / Seller bands */
  --pro-band-bg: #060e12;
  --seller-band-bg: #060e12;
  /* Eyebrow color */
  --eyebrow-color: #34d4b0;
  /* Footer */
  --footer-h3: #c0d8d0;
  --footer-link: #94a3b8;
  --footer-link-hover: #34d4b0;
  /* Dialog / form */
  --dialog-border: #1e3326;
  --input-border: #2d4a3f;
  /* Service meta */
  --meta-border: #1e3326;
  --meta-text: #94a3b8;
  --meta-icon: #34d4b0;
  /* Price row */
  --price-muted: #94a3b8;
  --price-text: #e0f0e8;
  /* Save button */
  --save-btn-border: #1e3326;
  /* Rating */
  --rating-text: #94a3b8;
  --star-fill: #fbbf24;
  --star-color: #d4a017;
  /* Seller level icon */
  --seller-icon: #34d4b0;
  /* Feature copy */
  --feature-text: #94a3b8;
  /* Ledger */
  --ledger-accent: #4d7c1f;
  /* Toast */
  --toast-bg: #162030;`;

// ─────────────────────────────────────────────────────────────────────────────
// 2. INLINE REPLACEMENT MAP: hardcoded value → var(--name)
//    Order matters: more specific / longer strings first.
// ─────────────────────────────────────────────────────────────────────────────

const replacements = [
  // Header
  ['background: rgba(252, 253, 250, 0.96)', 'background: var(--header-bg)'],
  ['border-bottom-color: rgba(23, 33, 29, 0.1)', 'border-bottom-color: var(--header-border)'],
  ['box-shadow: 0 1px 0 rgba(23, 33, 29, 0.02)', 'box-shadow: 0 1px 0 var(--header-border)'],

  // Brand mark
  ['background: #0b5f4f;\n  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.16)', 
   'background: var(--brand-mark-bg);\n  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.16)'],

  // Nav text
  ['  color: #4d5b53;\n  font-size: 0.9rem;\n  font-weight: 760;',
   '  color: var(--nav-text);\n  font-size: 0.9rem;\n  font-weight: 760;'],

  // Join / CTA button
  ['  background: #0b6c59;\n  box-shadow: 0 8px 18px rgba(8, 115, 93, 0.16)',
   '  background: var(--cta-bg);\n  box-shadow: 0 8px 18px rgba(8, 115, 93, 0.16)'],
  ['  background: #075a4b;\n  box-shadow: 0 12px 24px rgba(8, 115, 93, 0.22)',
   '  background: var(--cta-hover);\n  box-shadow: 0 12px 24px rgba(8, 115, 93, 0.22)'],

  // Hero background
  ['  background: #0b3d34;\n}', '  background: var(--hero-bg);\n}'],

  // Hero content text color
  ['  color: #fffdf8;\n  animation: hero-enter', '  color: var(--hero-text);\n  animation: hero-enter'],

  // Hero eyebrow
  ['  color: #d7ef8b;\n  font-size: 0.72rem;\n  font-weight: 800;\n  letter-spacing: 0.04em;\n  opacity: 1;\n}\n\nh1',
   '  color: var(--lime-muted);\n  font-size: 0.72rem;\n  font-weight: 800;\n  letter-spacing: 0.04em;\n  opacity: 1;\n}\n\nh1'],

  // Hero search icon
  ['  color: #6b786f;\n}', '  color: var(--hero-icon);\n}'],

  // Hero search button (lime)
  ['  background: #d8f06f;\n  color: #15352d;\n  font-size: 0.9rem;\n  font-weight: 850;',
   '  background: var(--lime);\n  color: var(--lime-text);\n  font-size: 0.9rem;\n  font-weight: 850;'],

  // Hero search button hover
  ['  background: #e4f98a;\n}\n\n.trend-row',
   '  background: var(--lime-hover);\n}\n\n.trend-row'],

  // Trend row button hover
  ['  border-color: #d8f06f;\n  color: #d8f06f;',
   '  border-color: var(--lime);\n  color: var(--lime);'],

  // Hero visual background slab
  ['  background: #0e5649;\n}\n\n.hero-visual img',
   '  background: var(--hero-visual-bg);\n}\n\n.hero-visual img'],

  // Visual note text
  ['  color: #15352d;\n}\n\n.visual-note-top',
   '  color: var(--lime-text);\n}\n\n.visual-note-top'],

  // Visual note top icon
  ['  color: #08735d;\n}\n\n.visual-note-bottom {',
   '  color: var(--eyebrow-color);\n}\n\n.visual-note-bottom {'],

  // Visual note bottom muted text
  ['  color: #66756c;\n  font-size: 0.73rem;',
   '  color: var(--note-text);\n  font-size: 0.73rem;'],

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

  // Category tile bg/border
  ['  border-color: #e2e9e3;\n  border-radius: 7px;\n  background: #fdfefd;\n  box-shadow: none;',
   '  border-color: var(--tile-border);\n  border-radius: 7px;\n  background: var(--tile-bg);\n  box-shadow: none;'],

  // Category icon default
  ['  border: 1px solid #dbe8df;\n  border-radius: 7px;\n  background: #eef6ef;\n  color: #176a59;',
   '  border: 1px solid var(--icon-border);\n  border-radius: 7px;\n  background: var(--icon-bg);\n  color: var(--icon-color);'],

  // Category icon: design
  ['  border-color: #f0d8d1;\n  background: #fff0eb;\n  color: #b95b47;\n}\n\n.category-tile[data-category="tech"]',
   '  border-color: var(--icon-design-border);\n  background: var(--icon-design-bg);\n  color: var(--icon-design-color);\n}\n\n.category-tile[data-category="tech"]'],

  // Category icon: tech
  ['  border-color: #d9e4f5;\n  background: #edf4ff;\n  color: #4268a3;\n}\n\n.category-tile[data-category="marketing"]',
   '  border-color: var(--icon-tech-border);\n  background: var(--icon-tech-bg);\n  color: var(--icon-tech-color);\n}\n\n.category-tile[data-category="marketing"]'],

  // Category icon: marketing
  ['  border-color: #f2e1bd;\n  background: #fff7e7;\n  color: #a9731e;',
   '  border-color: var(--icon-marketing-border);\n  background: var(--icon-marketing-bg);\n  color: var(--icon-marketing-color);'],

  // Category icon: video
  ['  border-color: #e2d9f2;\n  background: #f4f0fb;\n  color: #7863a8;',
   '  border-color: var(--icon-video-border);\n  background: var(--icon-video-bg);\n  color: var(--icon-video-color);'],

  // Category icon: writing (border same as design)
  ['  border-color: #f0d8d1;\n  background: #fff1ed;\n  color: #b65d4d;',
   '  border-color: var(--icon-design-border);\n  background: var(--icon-writing-bg);\n  color: var(--icon-writing-color);'],

  // Category icon: business
  ['  border-color: #d9e5df;\n  background: #eef6f1;\n  color: #407564;',
   '  border-color: var(--icon-business-border);\n  background: var(--icon-business-bg);\n  color: var(--icon-business-color);'],

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

  ['.service-filter button.active {\n  background: var(--paper);\n  color: #19372d;',
   '.service-filter button.active {\n  background: var(--paper);\n  color: var(--filter-active-text);'],

  // Service card border
  ['.service-card {\n  border-color: #e1e8e2;',
   '.service-card {\n  border-color: var(--card-border);'],

  ['.service-card:hover {\n  border-color: #a8cdbc;',
   '.service-card:hover {\n  border-color: var(--card-hover-border);'],

  // Service theme classes
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
  ['.avatar {\n  width: 34px;\n  height: 34px;\n  border: 1px solid #d8eadc;\n  background: #edf7ee;\n  color: #176a59;\n}',
   '.avatar {\n  width: 34px;\n  height: 34px;\n  border: 1px solid var(--avatar-border);\n  background: var(--avatar-bg);\n  color: var(--avatar-color);\n}'],

  // Seller level icon
  ['.seller-level i {\n  width: 13px;\n  height: 13px;\n  color: #168064;\n}',
   '.seller-level i {\n  width: 13px;\n  height: 13px;\n  color: var(--seller-icon);\n}'],

  // Rating score text
  ['.rating-score {\n  color: #486156;\n}',
   '.rating-score {\n  color: var(--rating-text);\n}'],

  // Star fill
  ['.rating-score i {\n  width: 15px;\n  height: 15px;\n  fill: #f1b644;\n  color: #c68b18;\n}',
   '.rating-score i {\n  width: 15px;\n  height: 15px;\n  fill: var(--star-fill);\n  color: var(--star-color);\n}'],

  // Service meta borders/text
  ['.service-meta {\n  justify-content: space-between;\n  padding: 10px 0;\n  border-top: 1px solid #eef1ee;\n  border-bottom: 1px solid #eef1ee;\n  color: #607168;\n}',
   '.service-meta {\n  justify-content: space-between;\n  padding: 10px 0;\n  border-top: 1px solid var(--meta-border);\n  border-bottom: 1px solid var(--meta-border);\n  color: var(--meta-text);\n}'],

  ['.service-meta i {\n  width: 14px;\n  height: 14px;\n  color: #3b7968;\n}',
   '.service-meta i {\n  width: 14px;\n  height: 14px;\n  color: var(--meta-icon);\n}'],

  // Price row
  ['.price-row > span {\n  color: #74837b;\n}',
   '.price-row > span {\n  color: var(--price-muted);\n}'],

  ['.price-row strong {\n  color: #15352d;',
   '.price-row strong {\n  color: var(--price-text);'],

  // Save button
  ['.save-button {\n  width: 34px;\n  height: 34px;\n  border-color: #e0e7e1;',
   '.save-button {\n  width: 34px;\n  height: 34px;\n  border-color: var(--save-btn-border);'],

  // Dashboard card border
  ['.dashboard-card,\n.orders-panel,\n.seller-tools,\n.order-item,\n.escrow-card {\n  border-color: #dce5de;',
   '.dashboard-card,\n.orders-panel,\n.seller-tools,\n.order-item,\n.escrow-card {\n  border-color: var(--dashboard-card-border);'],

  // Dashboard card first-child
  ['.dashboard-card:first-child {\n  border-color: #8dc5ae;\n  background: #edf8ef;\n}',
   '.dashboard-card:first-child {\n  border-color: var(--dashboard-first-border);\n  background: var(--dashboard-first-bg);\n}'],

  // Dashboard card strong
  ['.dashboard-card strong {\n  color: #15352d;\n}',
   '.dashboard-card strong {\n  color: var(--dashboard-first-text);\n}'],

  // Mini button
  ['.mini-button {\n  border-color: #d5e1d8;',
   '.mini-button {\n  border-color: var(--mini-btn-border);'],

  // Mini button primary
  ['.mini-button.primary {\n  border-color: #0b6c59;\n  background: #0b6c59;\n}',
   '.mini-button.primary {\n  border-color: var(--cta-bg);\n  background: var(--cta-bg);\n}'],

  // Pro band
  ['.pro-band {\n  width: 100%;\n  min-height: 300px;\n  margin: 0;\n  padding: 64px max(22px, calc((100vw - 1260px) / 2));\n  border-radius: 0;\n  background: #152720;\n  color: #fffdf8;\n}',
   '.pro-band {\n  width: 100%;\n  min-height: 300px;\n  margin: 0;\n  padding: 64px max(22px, calc((100vw - 1260px) / 2));\n  border-radius: 0;\n  background: var(--pro-band-bg);\n  color: var(--hero-text);\n}'],

  // Pro band eyebrow (already handled by section eyebrow rule above)
  ['.pro-band .eyebrow {\n  color: #d8f06f;\n}',
   '.pro-band .eyebrow {\n  color: var(--lime-muted);\n}'],

  // Dark button (on lime bg - text stays dark)
  ['.dark-button {\n  flex: 0 0 auto;\n  background: #d8f06f;\n  color: #15352d;\n}\n\n.dark-button:hover {\n  background: #e4f98a;\n}',
   '.dark-button {\n  flex: 0 0 auto;\n  background: var(--lime);\n  color: var(--lime-text);\n}\n\n.dark-button:hover {\n  background: var(--lime-hover);\n}'],

  // Feature copy text
  ['.feature-copy p {\n  color: #627067;\n}',
   '.feature-copy p {\n  color: var(--feature-text);\n}'],

  // Escrow card strong
  ['.escrow-card-top strong {\n  color: #15352d;\n}',
   '.escrow-card-top strong {\n  color: var(--price-text);\n}'],

  // Ledger border
  ['.mini-ledger p {\n  border-left: 3px solid #b9df8a;',
   '.mini-ledger p {\n  border-left: 3px solid var(--ledger-accent);'],

  // Seller band
  ['.seller-band {\n  gap: clamp(28px, 7vw, 86px);\n  min-height: 440px;\n  padding: 70px max(22px, calc((100vw - 1260px) / 2));\n  background: #0b4a3f;\n}',
   '.seller-band {\n  gap: clamp(28px, 7vw, 86px);\n  min-height: 440px;\n  padding: 70px max(22px, calc((100vw - 1260px) / 2));\n  background: var(--seller-band-bg);\n}'],

  // Seller copy eyebrow
  ['.seller-copy .eyebrow {\n  color: #d8f06f;\n}',
   '.seller-copy .eyebrow {\n  color: var(--lime-muted);\n}'],

  // Light button (on dark bg - text stays dark on lime)
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

  // Dialog border
  ['.market-dialog {\n  border: 1px solid #dce5de;',
   '.market-dialog {\n  border: 1px solid var(--dialog-border);'],

  // Form input border
  ['  border-color: #d6e1d8;\n  border-radius: 5px;\n}',
   '  border-color: var(--input-border);\n  border-radius: 5px;\n}'],

  // Toast
  ['.toast {\n  right: 18px;\n  bottom: 18px;\n  border-radius: 6px;\n  background: #15352d;\n}',
   '.toast {\n  right: 18px;\n  bottom: 18px;\n  border-radius: 6px;\n  background: var(--toast-bg);\n}'],
];

// ─────────────────────────────────────────────────────────────────────────────
// 3. INJECT VARIABLES INTO :root blocks
// ─────────────────────────────────────────────────────────────────────────────

// Find the second :root (visual refresh) and inject light vars before its closing brace
// Pattern: the visual refresh root ends with "--paper-rgb: 252, 253, 250;\n}"
css = css.replace(
  /--paper-rgb: 252, 253, 250;\r?\n\}/,
  `--paper-rgb: 252, 253, 250;${lightVars}\n}`
);

// Find the dark override block right after the visual refresh (which ends with "color-scheme: dark;\n}")
// and inject dark vars before its closing brace
css = css.replace(
  /--paper-rgb: 13, 21, 32;\r?\n  color-scheme: dark;\r?\n\}/,
  `--paper-rgb: 13, 21, 32;\n  color-scheme: dark;${darkVars}\n}`
);

// ─────────────────────────────────────────────────────────────────────────────
// 4. APPLY INLINE REPLACEMENTS
// ─────────────────────────────────────────────────────────────────────────────

let replacedCount = 0;
for (const [find, replace] of replacements) {
  if (css.includes(find)) {
    css = css.replace(find, replace);
    replacedCount++;
  } else {
    console.warn(`⚠️  NOT FOUND: ${find.substring(0, 60).replace(/\n/g, '\\n')}...`);
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. WRITE OUTPUT
// ─────────────────────────────────────────────────────────────────────────────

fs.writeFileSync(cssPath, css, 'utf8');
console.log(`✅ Done! Applied ${replacedCount}/${replacements.length} replacements.`);
console.log(`   CSS file: ${cssPath}`);
