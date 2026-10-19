# Changelog
**Ritvik Chunamari Portfolio — Awwwards-Caliber Elevation**
*All notable changes to this project are documented in this file.*

---

## [Unreleased] — 2026-10-19

### 1. Build Pipeline & Modernization
- **Tailwind Production Integration:** Replaced the legacy browser-runtime Tailwind CDN (`https://cdn.tailwindcss.com`) with a production PostCSS build pipeline (`tailwindcss@^3.4.17`, `postcss`, `autoprefixer`).
- **Configuration:** Created `tailwind.config.js` with Swiss palette tokens (`cinema-black`, `cinema-white`, `accent-red`, `warm-white`), custom cubic-bezier timing curves (`ease-expo`), and typography presets.
- **Entry Stylesheet:** Created `src/index.css` importing Tailwind directives, custom scrollbars, and high-contrast `:focus-visible` keyboard rings.
- **Code-Splitting Architecture:** Configured Vite Rollup chunking (`vendor-three`, `vendor-gsap`, `vendor-lenis`) in `vite.config.ts`.
- **Bundle Optimization:** Lazy-loaded `ProjectDetail` via `React.lazy` and `React.Suspense`, dropping initial JavaScript payload from 1.2 MB to 459 kB (-62%).

### 2. Branding, Positioning & SEO
- **Brand Positioning:** Repositioned Ritvik Chunamari to "Product Designer & Creative Technologist" across all titles, headers, and metadata.
- **Brand Manifesto:** Added the unifying statement: *"Design for humans. Build for wonder."*
- **SEO & Metadata:** Updated `index.html` with accurate Open Graph tags, canonical URL, Twitter card specs, and JSON-LD schema (`Person` + `CollegeOrUniversity` ATLAS Institute, CU Boulder).
- **Public Assets:** Created `public/robots.txt`, `public/sitemap.xml`, and redesigned `public/og-thumbnail.svg` to Swiss Obsidian + Signature Red `#FF3B30`.

### 3. Atmospheric Rendering & Stability
- **Background Consolidation:** Eliminated redundant 2D canvas `CinematicBackground` (thousands of dot loops) in favor of the single dominant `GlobalFluidCanvas` (Three.js WebGL fluid shader with ACESFilmic tone mapping).
- **Lenis RAF Memory Leak Fix:** Resolved infinite requestAnimationFrame loop bug in `App.tsx` where unmounting failed to track the dynamic `frameId`.
- **Mobile Touch Physics Fix:** Disabled synthetic `touchmove` coordinate overrides in `Hero.tsx` on touchscreens to restore native iOS/Android momentum scrolling.

### 4. Navigation & Cursor Ergonomics
- **Custom Cursor Audit:** Removed global `cursor: none` from `index.html`. Retained native OS cursor across all devices for accessibility; custom follower ring is activated purely as an enhancement on fine-pointer desktop viewports.
- **Deep Linking & Hash Routing:** Implemented native hash routing in `App.tsx` (`#impact-events`, `#kinetix-quant`, `#nexus-ai`, `#usps-organization-rebrand`, `#security-agency-ux`, `#pill-dispenser-3d`, `#mumbai-olympics-2028`) with popstate and hashchange listeners.
- **404 Fallback State:** Added in-situ Swiss 404 state with "PROJECT NOT FOUND" indicator and `← Return to Exhibition` recovery button.
- **Keyboard Navigation:** Added Escape key listener to close case studies and lightboxes.

### 5. Human Interface Lab
- **New Component (`components/HumanInterfaceLab.tsx`):** Built 3 interactive creative technology sandboxes:
  - *Exp 01: The Feel of an Interface* (Linear vs. Kinetic Spring dynamics with live Canvas plotting).
  - *Exp 02: Universal Ergonomics* (24px vs. 48px touch targets, AAA contrast modes, keyboard focus rings).
  - *Exp 03: Token Synthesizer* (Real-time design token adjustments with Swiss, Editorial, and Cyber presets).

### 6. Project Exhibition & Case Study Elevation
- **Top Featured Project:** Created `public/impact-events-cover.svg` and featured *Impact Events* (Enterprise Event Platform) as the top UX case study.
- **Dual Exhibition Modes:** Added Mode A (Editorial Exhibition) and Mode B (Compact Index) with category filter chips (All, Product & UX, Experiments).
- **30-Second Executive Summary:** Added executive brief modules immediately following Section 01 Overview across all 7 projects with 4-card Swiss friction/intervention/impact/ownership matrices.
- **Design Retrospective:** Added critical self-reflection sections before the Next Project curtain across all 7 projects (Architectural Successes, V2 Re-Engineering Targets, Human-Interface Takeaways).

### 7. Zero Audio Policy & Media Hardening
- **Zero Audio Compliance:** Completely removed legacy `<audio>` element and sitar playback toggle from `components/MumbaiLogoGenerator.tsx`.
- **Asset Cleanup:** Removed broken external font `@font-face Samarkan` from `src/index.css`.
- **Clean Console:** Verified zero runtime console errors across all routes and interactions.

### 8. Testing & Documentation
- **Automated QA Suite (`verify_awwwards_portfolio.cjs`):** Playwright automated test suite covering 5 viewports (1920x1080, 1440x900, 768x1024, 390x844, 375x812), deep links, 404 state, and zero audio verification.
- **Documentation:** Created `DESIGN_DECISIONS.md`, `QA_REPORT.md`, `CHANGELOG.md`, and updated `PROJECT_MEMORY.md`.

### 9. Skeptical Audit, Test Integrity & Polish
- **Test Integrity Overhaul:** Removed dead selectors and silent test bypasses in `verify_awwwards_portfolio.cjs`. Added explicit interactive assertions for Exp 01 (switchers, actuation counter, slider value), Exp 02 (target size, focus ring suppression, accuracy hit rate, full WCAG 2.2 AA audit badge), Exp 03 (token synthesizer active tokens manifest), and category dividers. Total tests increased to 39/39 passing.
- **Project Hierarchy & Separation:** Reordered `data.ts` to guarantee all 4 featured Product & UX case studies precede the 3 Technology Experiments. Added dedicated category division banners in both Editorial and Index view modes.
- **GPU Throttling & Power Preservation:** Wired `paused={currentView !== 'home'}` in `App.tsx` and `GlobalFluidCanvas.tsx` to stop Three.js animation loops when reading case studies or viewing error pages, and during `document.hidden`. Added single-frame fallback for `prefers-reduced-motion`.
- **History Popstate Scroll Reset:** Fixed scroll retention bug in `App.tsx` so navigating backwards/forwards between case studies and exhibition floor always resets scroll to top and refreshes ScrollTrigger.
- **Elevated 404 Archive Radar:** Replaced generic error panel with an art-directed trajectory recovery radar providing deep-link recovery buttons for all 7 registered case studies.
- **Social Media Crawler Compatibility:** Generated a genuine 1200x630 PNG open-graph thumbnail (`public/og-thumbnail.png`) using Playwright headless Chromium and updated metadata in `index.html`.
- **Accessible Focus Ring Selector:** Refined focus ring CSS rule to ignore elements flagged with `[data-suppress-focus="true"]` so interactive accessibility experiments can demonstrate non-conforming states without breaking site-wide WCAG 2.2 AA conformance.
