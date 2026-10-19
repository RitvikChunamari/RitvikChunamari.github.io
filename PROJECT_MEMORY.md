# Project Memory: Ritvik Chunamari Portfolio

## 1. Project Purpose & Architecture
- **Purpose**: High-craftsmanship cinematic design & engineering portfolio for Ritvik Chunamari (Creative Designer & Vibe Coder).
- **Core Visual Identity (Preserved & Polished)**:
  - Dark cinematic atmosphere with subtle film grain and obsidian depth
  - Swiss-inspired architectural and editorial typography (Inter, IBM Plex Mono, Montserrat, Playfair Display)
  - Monochrome black/white palette with signature red accents (`#FF3B30` on dark, `#C62828` on light) and cobalt/blue highlights (`#60A5FA`)
  - Monumental interactive hero typography with responsive mobile scaling and physics
  - Clean hero manifesto typography ("Creative Designer and Vibe Coder crafting digital experiences...") with no redundant buttons
  - Fluid elastic cursor with velocity squash/stretch and contextual state targets
  - Smooth custom virtual scroll with zero-overhead circular progress indicator
  - Pristine project showcase cards with Swiss registration crop marks and smooth parallax
  - Comprehensive, deep case study views (`ProjectDetail.tsx`) with live interactive tools (Figma embed, terminal, logo generator)
  - Minimalist preloader embodying the "Think. Design. Create." triad with returning-visitor session bypass

## 2. Technology Stack & Key Dependencies
- **Core**: React 19.2.0, Vite 6.2.0, TypeScript 5.8.2
- **Animation & Graphics**: GSAP 3.13.0, Three.js 0.185.1
- **Styling**: Tailwind CSS configuration
- **Routing**: URL hash routing (`#work`, `#profile`, `#contact`, `#<ProjectTitle>`) with browser history `popstate` support, scroll restoration, and keyboard Escape navigation.

## 3. Implementation Status & Verified Outcomes

### Clean Aesthetic & Elimination of Redundant UI
- [x] Removed duplicate navigation buttons from Hero (relying solely on the top header navigation for clean, uncluttered visual focus).
- [x] Restored authentic hero manifesto font and phrasing (`Creative Designer and Vibe Coder crafting digital experiences at the intersection of logic and human intuition.`).
- [x] Removed artificial pill badges and CTAs from project cards, restoring pure Swiss registration crop marks.
- [x] Restored unified case study structure in `ProjectDetail.tsx`, removing artificial reading-depth toggles and generic metric blocks.
- [x] Maintained minimalist circular scroll progress ring at bottom-right without intrusive text banners.
- [x] Clean header navigation without pulsating indicator dots.

### Accessibility & Color Contrast (WCAG 2.2 AA)
- [x] Scoped custom cursor strictly to `@media (pointer: fine)` when `body.has-custom-cursor` is active; stripped on keyboard navigation (Tab, Arrow keys) or touch.
- [x] Added accessible Skip to Content link (`<a href="#work" className="sr-only focus:not-sr-only ...">`).
- [x] Added semantic landmarks: `<header>`, `<nav aria-label="Main Navigation">`, `<main id="main-content">`, `<section>`, `<footer>`.
- [x] Made project cards fully keyboard-accessible (`role="button"`, `tabIndex={0}`, Enter/Space keydown triggers, card focus rings).
- [x] Hero `<h1>` accessible screen-reader name: `aria-label="Ritvik Chunamari"` with `aria-hidden="true"` on character splitting spans.
- [x] Contrast remediation:
  - Inverted light backgrounds in `About.tsx` use `#C62828` (5.6:1 contrast ratio against `#FFFFFF`).
  - Dark mode tags and citations upgraded to accessible `#60A5FA` / `#4D88FF`.
- [x] Modal dialog semantics: added `role="dialog"`, `aria-modal="true"`, `Escape` key close listener, and accessible close button names to image lightbox in `ProjectDetail.tsx`.
- [x] **Axe-core WCAG 2.2 AA Audit Results**: **0 Violations, 25 Passes** on Home; **0 Violations, 22 Passes** on ProjectDetail.

### Smooth Scrolling & Navigation Stability
- [x] Respects `prefers-reduced-motion` with instant 1:1 scroll synchronization.
- [x] Integrated `savedHomeScrollY` in `App.tsx` for scroll restoration when switching between Home and ProjectDetail.
- [x] Full browser history support (`popstate` listener and hash navigation) for Back/Forward buttons and direct deep linking.
- [x] Added `focusin` listener on `scrollRef` ensuring keyboard-focused elements automatically scroll smoothly into view.
- [x] Simplified, fluid touch and wheel interaction on mobile and desktop without dual-scroll libraries.

### WebGL & Canvas Optimization
- [x] Wrapped `GlobalFluidCanvas.tsx` Three.js WebGLRenderer in try/catch to safely handle devices without WebGL support.
- [x] Adaptive vertex density: reduced geometry segments from 160x140 (22.4k vertices) to 80x70 on mobile (`<768px`), reducing shader computation by 75% on mobile devices.
- [x] Clamped pixel ratio to `1.5` on mobile and `2.0` on desktop, preventing mobile thermal throttling.
- [x] Added `document.visibilitychange` listener to pause animation loops in background tabs, eliminating wasted CPU/GPU cycles.
- [x] Migrated from deprecated `THREE.Clock` to precise `performance.now()` delta timing with `prefers-reduced-motion` damping.
- [x] In `CinematicBackground.tsx`, adjusted mobile dot spacing from 20 to 32px, reducing mobile dot physics computations from ~990 to ~400 dots.

### Preloader Optimization & Returning Visitor Fast-Track
- [x] Added `sessionStorage.getItem('hasSeenPortfolioLoader')` check: returning visitors within the same session instantly bypass the loader.
- [x] Reduced default duration from 2.8s to a brisk 1.45s for first-time visitors.
- [x] Instant bypass when `prefers-reduced-motion` is active.
- [x] Added `role="progressbar"`, `aria-valuenow`, and `aria-live="polite"` status announcements.
- [x] Silenced unprompted automatic AudioContext sound effects during page load.
- [x] Added Escape key skip and focus-visible button styles.

## 4. Verification Commands
- `npm run build`: Production bundle compilation (passes cleanly)
- `npm run dev`: Local development server (port 3000)
- Playwright MCP / axe-core: Automated WCAG 2.2 AA audit (0 violations)
