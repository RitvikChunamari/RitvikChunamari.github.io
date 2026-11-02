# Technical Design Draft: Individual Project Pages Refinement

**Project**: Ritvik Chunamari Portfolio (`RitvikChunamari.github.io`)  
**Scope**: Individual Project Pages & Case Study Architectures (`components/ProjectDetail.tsx`, `components/FigmaViewerWindow.tsx`, `components/CryptoSimulator.tsx`, `components/MumbaiLogoGenerator.tsx`)  
**Author**: Antigravity Full-Stack Agent & EGM Design Team  
**Status**: Aligned & In Implementation  
**Date**: November 2, 2026  

---

## 1. Context & Aligned Objectives

Following our structured interview (`/grill-me`), the design direction for the individual project pages has been locked:

1. **Holistic Case Study Craft & Interaction Polish**:
   - Refine typographic hierarchy, metadata grids, data tables, and interactive tool framing across all 5 curated case studies:
     1. *Kinetix Quant* (Institutional AI & Quantitative Backtesting)
     2. *Nexus AI* (Homepage UX Design & Interactive Prototype)
     3. *USPS Organization Rebrand* (Visual Identity, Fleet Livery & Brand Architecture)
     4. *Pill Dispenser 3D* (Industrial Design, Pugh Selection Matrix & Mechatronics BOM)
     5. *Mumbai Olympics 2028* (Global Event Identity, Spatial Wayfinding & Dynamic Logo Generator)
   - Preserve 100% of authentic content, citations, copy, metrics, and media assets.

2. **Swiss Architectural Studio Framing**:
   - Razor-sharp square corners (`rounded-none` / `rounded-sm`) on all studio frames.
   - Deep obsidian backdrops (`#09090e`, `#050508`) with subtle hairline borders (`border-white/10`).
   - Monospace telemetry headers, clean status tags (`LIVE PREVIEW`, `ACTIVE SPECIFICATION`, `MODEL READY`), and subtle red active accent lines (`#FF3B30`).

3. **Monumental Navigation & Next Project Transition**:
   - Fixed architectural Swiss header with real-time laser progress line, tactile magnetic "← BACK TO WORKS", and "NEXT PROJECT →".
   - Monumental Next Project transition curtain at the footer of each case study with expanding red laser bar, large display typography (`text-[clamp(2.5rem,7vw,6.5rem)]`), and seamless keyboard/touch navigation.

4. **Swiss Architectural Data Grid & Specs**:
   - Clean tabular layout for BOM specifications, Pugh selection matrices, and morphological charts.
   - Alternating row tinting (`bg-white/[0.015]`), glowing crimson status pills, and keyboard-accessible scroll containers (`tabIndex={0}`).

5. **Strict Portfolio Constraints**:
   - Cinematic monochrome black/white palette with signature red accents (`#FF3B30`).
   - Zero audio context or sound triggers.
   - No generic AI aesthetics or slop text.
   - Full WCAG 2.2 AA accessibility and `prefers-reduced-motion` compliance.

---

## 2. Component Refinements

### A. Case Study Hero & Metadata Grid (`components/ProjectDetail.tsx`)
- Standardize metadata cards (Role, Year, Technologies, Impact) with razor-sharp borders and monospace uppercase labels.
- Calibrate title fluid scaling (`text-[clamp(2.5rem,6.8vw,6.5rem)]`) with zero overflow on 375px mobile viewports.
- Enhance Swiss red accent line expander on scroll.

### B. Interactive Prototype Studio (`components/FigmaViewerWindow.tsx`)
- Clean architectural window header with monospace status and reload/external buttons.
- Tactile tab pills for Figma page switches with smooth opacity transitions.
- Minimum 44px tap targets for all controls on mobile.

### C. Technical Data Tables & Specs (`components/ProjectDetail.tsx`)
- Enhance BOM specs table and Pugh matrix with clear header delineation, high-contrast monospace text (WCAG AAA compliant), and horizontal scroll affordances.
- Upgrade range sliders and controls in `MumbaiLogoGenerator.tsx` and `CryptoSimulator.tsx` with high-visibility Swiss red focus rings and tactile active states.

### D. Monumental Transition Curtain (`components/ProjectDetail.tsx`)
- Smooth GSAP scrubbed unmasking of the Next Project title.
- High-tension spring interaction on the transition trigger button (`active:scale-[0.985]`).

---

## 3. Verification Protocol
1. `npx tsc --noEmit`: 0 TypeScript errors.
2. `npm run build`: Production bundle compilation passes cleanly.
3. Playwright automated end-to-end audit:
   - Navigate to each of the 5 case studies.
   - Verify tool window rendering and interactions.
   - Verify 0 console errors and 0px horizontal overflow across desktop (1440×900) and mobile (375×812).
