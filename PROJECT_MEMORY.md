# Project Memory: Ritvik Chunamari Portfolio

## 1. Project Purpose & Positioning Architecture
- **Purpose**: Awwwards-caliber digital experience and portfolio for **Ritvik Chunamari**.
- **Primary Positioning**: **Product Designer & Creative Technologist**
  - Secondary Competencies: UX/UI Design, Product Architecture, Creative Technology, AI-Assisted Development, Visual Identity Systems.
  - Vibe Coding Stance: Retained strictly as an accelerated creative prototyping capability, grounded by rigorous human-centered UX heuristics, design tokens, and production engineering.
- **Brand Statement**: *"Design for humans. Build for wonder."*
- **Visual Design Identity**:
  - Swiss architectural minimalism and high-density telemetry.
  - Palette: Obsidian `#050507`, Elevated Cards `#08080C`, Soft White `#EDEDED`, Signature Red `#FF3B30`, subtle translucent borders (`border-white/10`).
  - Strict WCAG 2.2 AA accessibility: minimum 44×44px touch targets (48px standard), high contrast text (>= 16:1 on primary body), visible keyboard focus rings (`outline: 2px solid #FF3B30`).
  - Universal cursor accessibility: native OS cursor preserved across all devices; custom follower ring is activated purely as an enhancement on fine-pointer desktop viewports (`@media (hover: hover) and (pointer: fine)`).
- **Audio Engine**: Strict Zero Audio Policy (zero audio files, zero Web Audio context, zero acoustic triggers).

---

## 2. Technology Stack & Key Dependencies
- **Core Framework**: React 19.2.0, TypeScript 5.8.2, Vite 6.4.3
- **CSS Architecture**: Local Tailwind CSS 3.4.17 + PostCSS + Autoprefixer build pipeline (no runtime CDN scripts). Entrypoint: `src/index.css`.
- **Animation & Graphics**:
  - Three.js 0.185.1 (Single dominant `GlobalFluidCanvas` WebGL fluid shader with ACESFilmic tone mapping).
  - GSAP 3.13.0 (Precision typographic reveals and telemetry triggers).
  - Lenis 1.1.20 (Momentum scrolling with strictly managed RAF lifecycle).
- **Code-Splitting Architecture**:
  - Vite Rollup chunking: `vendor-three`, `vendor-gsap`, `vendor-lenis`.
  - Lazy-loaded `ProjectDetail` via `React.lazy` and `React.Suspense`.
  - Initial entry JavaScript bundle reduced by 62% (from 1.2 MB to 459 kB).
- **Deep Linking & Routing**:
  - Native `window.location.hash` routing with `popstate` and `hashchange` listeners in `App.tsx`.
  - Deep-linkable routes for all 7 projects: `#impact-events`, `#kinetix-quant`, `#nexus-ai`, `#usps-organization-rebrand`, `#security-agency-ux`, `#pill-dispenser-3d`, `#mumbai-olympics-2028`.
  - In-situ Swiss 404 state with "PROJECT NOT FOUND" indicator and `← Return to Exhibition` recovery button.
  - Keyboard Escape key returns to exhibition index.

---

## 3. Core Modules & Component Architecture

### 3.1 Hero & Atmospheric WebGL (`components/Hero.tsx`, `components/GlobalFluidCanvas.tsx`)
- Title: "RITVIK CHUNAMARI" with kinetic differential horizontal dispersal on scroll.
- Subtitle: "PRODUCT DESIGNER / CREATIVE TECHNOLOGIST".
- Brand manifesto: "Design for humans. Build for wonder." with "Explore Selected Work ↓" CTA.
- Single dominant WebGL fluid simulation with pointer velocity tracking. Decommissioned redundant 2D canvas `CinematicBackground`.
- Mobile touch physics: Synthetic mouse overrides on `touchmove` disabled to restore native mobile scrolling.

### 3.2 Human Interface Lab (`components/HumanInterfaceLab.tsx`)
Interactive creative technology section with 3 live sandboxes:
1. **Exp 01: The Feel of an Interface** (Kinetic spring vs. linear physics with real-time Canvas trajectory graphing).
2. **Exp 02: Universal Ergonomics** (24px vs. 48px touch targets, AAA contrast modes, keyboard focus rings).
3. **Exp 03: Token Synthesizer** (Real-time design token adjustments with Swiss, Editorial, and Cyber presets).

### 3.3 Project Exhibition (`components/ProjectList.tsx`, `data.ts`)
- **Ordering & Categorization:** Strictly presents all 4 featured Product & UX case studies first (`impact-events`, `nexus-ai`, `security-agency-ux`, `usps-organization-rebrand`), followed by 3 Technology Experiments (`kinetix-quant`, `pill-dispenser-3d`, `mumbai-olympics-2028`).
- **Category Division Telemetry:** Dedicated category dividers in Mode A (`01.2 /// CREATIVE COMPUTING & EXPERIMENTS`) and Mode B with dynamic filtering support.
- **Mode A: Editorial Exhibition:** Monumental cover imagery, typographic reveal animations, category tags, and primary metric highlights.
- **Mode B: Compact Index:** High-density monospace tabular format displaying project year, client/domain, role, and technologies.
- **Filter Chips:** Instant filtering between "All", "Product & UX" (Featured), and "Experiments".
- Top Featured Project: *Impact Events* (Enterprise Event Platform) with custom cover asset `public/impact-events-cover.svg`.

### 3.4 Deep Modular Case Studies (`components/ProjectDetail.tsx`)
- **30-Second Executive Summary Module (Section 01.1):**
  - Strategic thesis banner.
  - 4-card Swiss friction/intervention/impact/ownership matrix.
  - Rapid-scan metric tickers.
- **Design Retrospective & Reflection Module (Section 09):**
  - *What Held Up in Validation:* Architectural successes and system coherence.
  - *What Would Be Re-Engineered in V2:* Critical self-critique and technical debt analysis.
  - *Core Human-Interface Takeaways:* Foundational design philosophy and token scalability.
- **Monumental Next Project Curtain:** Full-width transition curtain featuring telemetry indicator and massive title.

### 3.5 Elevated 404 Archive Radar (`App.tsx`)
- In-situ Swiss dark-mode panel with `SYSTEM NOTIFICATION // ARCHIVE COORDINATE UNRESOLVED` indicator and `Trajectory Lost` title.
- Direct recovery matrix with click-through navigation pills for all 7 case studies.
- "Return to Exhibition" button resets scroll, URL hash, and refreshes GSAP ScrollTrigger.
- `GlobalFluidCanvas` pauses rendering (`paused={currentView !== 'home'}`) when outside home to preserve GPU battery.

---

## 4. Quality Assurance & Verification
- **Automated QA Script**: `verify_awwwards_portfolio.cjs`
  - Automated Playwright suite testing across 5 viewports:
    - Desktop Large (1920 × 1080)
    - Desktop Standard (1440 × 900)
    - Tablet Portrait (768 × 1024)
    - Mobile Standard (390 × 844)
    - Mobile Compact (375 × 812)
  - Tests category dividers in Editorial and Index modes.
  - Tests deep interactions in Human Interface Lab Exp 01, 02, and 03 without skips.
  - Tests deep linking across all 7 project routes.
  - Tests 404 state navigation, archive radar launch, and clean reset.
  - Tests `prefers-reduced-motion` instant emulation.
  - Asserts zero unhandled console errors.
  - Asserts strict Zero Audio compliance via `AudioContext` runtime proxies.
- **Verification Commands**:
  - Production Build: `npm run build` (~1.7s build time, exit code 0)
  - Playwright QA Suite: `node verify_awwwards_portfolio.cjs` (39/39 tests passing)
  - Local Preview: `npm run preview`
  - Local Dev: `npm run dev`
