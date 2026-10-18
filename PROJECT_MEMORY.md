# Project Memory: Ritvik Chunamari Portfolio

## 1. Project Purpose & Architecture
- **Purpose**: High-craftsmanship cinematic design & engineering portfolio for Ritvik Chunamari (Product Designer & Creative Developer).
- **Core Visual Identity (Preserved & Polished)**:
  - Dark cinematic atmosphere with subtle film grain and obsidian depth
  - Swiss-inspired architectural and editorial typography (Inter, IBM Plex Mono, Montserrat, Playfair Display)
  - Monochrome black/white palette with signature red accents (`#FF3B30` on dark, `#C62828` on light) and cobalt/blue highlights (`#60A5FA`)
  - Monumental interactive hero typography with responsive mobile scaling and physics
  - Fluid elastic cursor with velocity squash/stretch and contextual state targets
  - Smooth custom virtual scroll with zero-overhead circular progress indicator and Chapter HUD
  - Layered WebGL fluid surface (`GlobalFluidCanvas.tsx`) and interactive 2D canvas antigravity lattice (`CinematicBackground.tsx`)
  - Minimalist preloader embodying the "Think. Design. Create." triad with returning-visitor bypass
  - In-depth interactive case study views (`ProjectDetail.tsx`) with Dual-Depth Reading Mode

## 2. Technology Stack & Key Dependencies
- **Core**: React 19.2.0, Vite 6.2.0, TypeScript 5.8.2
- **Animation & Graphics**: GSAP 3.13.0, Three.js 0.185.1
- **Styling**: Tailwind CSS configuration
- **Routing**: URL hash routing (`#work`, `#profile`, `#contact`, `#<ProjectTitle>`) with browser history `popstate` support, scroll restoration, and keyboard Escape navigation.

## 3. Implementation Status & Verified Outcomes

### Phase 1: Hero Section Positioning & Continuity
- [x] Refined positioning headline: `"PRODUCT DESIGNER & CREATIVE DEVELOPER"` in signature red tracking.
- [x] Grounded narrative: `"I turn complex ideas into intuitive, accessible products and memorable digital experiences at the intersection of logic and human intuition."`
- [x] Four keyboard-accessible quick-action pills in Hero: `Selected Work ↓`, `Profile & About`, `Résumé ↗`, `Contact`.
- [x] Editorial Chapter Continuity bridge at the base of Hero introducing `02 // CHAPTER 02 • SELECTED WORK`.
- [x] Responsive layout adjustments: `md:mr-32` on "Scroll to Explore" to prevent HUD overlap on desktop and tablet.

### Phase 2: Four Visual Chapters & Chapter HUD
- [x] Structured narrative progression across 4 distinct chapters:
  - `01 // CHAPTER 01 • IDENTITY`
  - `02 // CHAPTER 02 • SELECTED WORK`
  - `03 // CHAPTER 03 • PROFILE & ARCHITECTURE`
  - `04 // CHAPTER 04 • TRANSMISSION & INQUIRY`
- [x] Dynamic Chapter HUD positioned in bottom-right corner alongside circular progress indicator.
- [x] Zero-React-render DOM ref synchronization (`chapterNumRef`, `chapterNameRef`) inside the main RAF scroll loop, eliminating wasteful state recalculations.
- [x] Header navigation synchronized with active chapter dot indicator (`#FF3B30`).

### Phase 3: Project Editorial Badges & Interaction Polish
- [x] Added curated editorial category badges to all project cards in `components/ProjectList.tsx`:
  - `Flagship Institutional AI`
  - `Universal Design System`
  - `Enterprise SOC & Operations`
  - `High-Frequency Trading Architecture`
  - `Strategic UI/UX Architecture`
- [x] Added clear interactive affordances: `VIEW CASE STUDY ↗` on project cards.
- [x] Maintained high-contrast badge styling with signature red status dots.

### Phase 4: Dual-Depth Reading Mode in Case Studies
- [x] Implemented Dual-Depth Reader in `components/ProjectDetail.tsx`:
  - `⚡ Quick Overview (1-Minute Scan)`: Designed for executive/recruiter review with Problem & Solution bullet highlights, and a 4-metric Quantifiable Outcomes Matrix.
  - `📖 Deep Dive (Full Spec)`: Complete design journey with problem space, system architecture, research personas, user journeys, live AI terminal, Figma canvas viewer, interactive logo generator, and academic citations.
- [x] Grounded quantifiable metrics derived from real project artifacts:
  - Kinetix: `+0.97%` Strategy Profit Factor, `12` Macro Dimensions, `100%` Explainability Audit, `<20ms` P99 Latency.
  - Caelum: `48+` Reusable Components, `4` Production Platforms, `100%` WCAG 2.1 AA Compliance, `40%` Dev Velocity Gain.
  - CyberShield: `-68%` Mean Time to Detect, `99.98%` Ingestion Uptime, `10k+` Daily Threat Events, `Zero` Critical Blindspots.
  - Pulse Trade: `99.999%` Execution Reliability, `<1.2ms` Tick-to-Trade Latency, `10M+` Daily Order Book Events, `Zero` Trade Drops.
  - Mumbai City FC: `250-Year` Club Heritage, `3` Identity Iterations, `100%` Vector Geometry, `80k+` Global Reach.

### Phase 5: Accessibility & Color Contrast (WCAG 2.2 AA)
- [x] Scoped custom cursor strictly to `@media (pointer: fine)` when `body.has-custom-cursor` is active; stripped on keyboard navigation (Tab, Arrow keys) or touch.
- [x] Added accessible Skip to Content link (`<a href="#work" className="sr-only focus:not-sr-only ...">`).
- [x] Added semantic landmarks: `<header>`, `<nav aria-label="Main Navigation">`, `<main id="main-content">`, `<section>`, `<footer>`.
- [x] Made project cards fully keyboard-accessible (`role="button"`, `tabIndex={0}`, Enter/Space keydown triggers, card focus rings).
- [x] Hero `<h1>` accessible screen-reader name: `aria-label="Ritvik Chunamari"` with `aria-hidden="true"` on character splitting spans.
- [x] High-contrast color fixes:
  - Converted red accents on white backgrounds to `#C62828` (5.6:1 contrast ratio).
  - Badge text renders bold white `#FFFFFF` with red bullet on dark backgrounds.
  - Case study tags and accents use accessible `#60A5FA` (8.2:1 contrast ratio) instead of low-contrast cobalt.
- [x] Modal dialog semantics: added `role="dialog"`, `aria-modal="true"`, `Escape` key close listener, and accessible close button names to image lightbox in `ProjectDetail.tsx`.
- [x] **Axe-core WCAG 2.2 AA Audit Results**: **0 Violations, 25 Passes** on Home; **0 Violations, 22 Passes** on ProjectDetail.

### Phase 6: Smooth Scrolling & Navigation Stability
- [x] Respects `prefers-reduced-motion` with instant 1:1 scroll synchronization.
- [x] Integrated `savedHomeScrollY` in `App.tsx` for scroll restoration when switching between Home and ProjectDetail.
- [x] Full browser history support (`popstate` listener and hash navigation) for Back/Forward buttons and direct deep linking.
- [x] Added `focusin` listener on `scrollRef` ensuring keyboard-focused elements automatically scroll smoothly into view.
- [x] Simplified, fluid touch and wheel interaction on mobile and desktop without dual-scroll libraries.

### Phase 7: WebGL & Canvas Optimization
- [x] Wrapped `GlobalFluidCanvas.tsx` Three.js WebGLRenderer in try/catch to safely handle devices without WebGL support.
- [x] Adaptive vertex density: reduced geometry segments from 160x140 (22.4k vertices) to 80x70 on mobile (`<768px`), reducing shader computation by 75% on mobile devices.
- [x] Clamped pixel ratio to `1.5` on mobile and `2.0` on desktop, preventing mobile thermal throttling.
- [x] Added `document.visibilitychange` listener to pause animation loops in background tabs, eliminating wasted CPU/GPU cycles.
- [x] Migrated from deprecated `THREE.Clock` to precise `performance.now()` delta timing with `prefers-reduced-motion` damping.
- [x] In `CinematicBackground.tsx`, adjusted mobile dot spacing from 20 to 32px, reducing mobile dot physics computations from ~990 to ~400 dots.

### Phase 8: Preloader Optimization & Returning Visitor Fast-Track
- [x] Added `sessionStorage.getItem('hasSeenPortfolioLoader')` check: returning visitors within the same session instantly bypass the loader.
- [x] Reduced default duration from 2.8s to a brisk 1.45s for first-time visitors.
- [x] Instant bypass when `prefers-reduced-motion` is active.
- [x] Added `role="progressbar"`, `aria-valuenow`, and `aria-live="polite"` status announcements.
- [x] Silenced unprompted automatic AudioContext sound effects during page load.
- [x] Added Escape key skip and focus-visible button styles.

### Phase 9: Multi-Device Responsive QA
- [x] 1440px Desktop: Verified (`desktop_1440_after.png`, `desktop_1440_projects.png`, `desktop_1440_chapters.png`).
- [x] 1024px Tablet: Verified (`tablet_1024_fixed.png`).
- [x] 768px Tablet: Verified (`tablet_768_final.png`).
- [x] 390px Mobile: Verified (`mobile_390_final.png`).
- [x] 375px Mobile: Verified (`mobile_375_final.png`).
- [x] Keyboard navigation: verified tab order, focus ring visibility, Enter/Space card trigger, and Escape key return from project detail.

## 4. Verification Commands
- `npm run build`: Production bundle compilation (passes cleanly in ~1.10s)
- `npm run dev`: Local development server (port 3000)
- Playwright MCP / axe-core: Automated WCAG 2.2 AA audit (0 violations)
