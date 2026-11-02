# Technical Design Draft: Full-Site Craft & Interaction Refinement

**Project**: Ritvik Chunamari Portfolio (`RitvikChunamari.github.io`)  
**Author**: Antigravity Full-Stack Agent & EGM Design Team  
**Status**: Aligned & Ready for Implementation  
**Date**: November 2, 2026  

---

## 1. Context & Aligned Objectives

Following our structured interview (`/grill-me`), the design direction and refinement scope have been locked into the project's design tree:

1. **Scope**: Full-Site Craft & Interaction Refinement — Polish typography hierarchy, fine-tune GSAP/Lenis motion physics, elevate card multi-plane parallax, and enhance mobile ergonomics across all existing sections.
2. **Motion Personality**: Damped Spring & Tactile Physics (Emil Kowalski / Apple standard) — Natural spring tension on magnetic buttons, velocity-damped 3D card tilt, buttery scrubbed layer parallax, and subtle active press depths (`active:scale-[0.985]`).
3. **Surface Depth & Atmospheric Lighting**: Deep Obsidian with Specular Micro-Reflections — Deep obsidian atmosphere (`#050507` baseline) where specular sheen and laser edge sweeps illuminate on active/hovered focus while preserving 7:1 AAA reading contrast.
4. **Mobile & Touch Ergonomics**: Tactile Native-Feel Mobile Tuning — High-precision tap targets ($\ge 44 \times 44\text{px}$), instant touch feedback (`active:scale-[0.985]`), balanced fluid type scaling with clean line breaks, and unpinned vertical momentum scrolling with zero horizontal slip.
5. **Strict Portfolio Constraints**:
   - Preserve cinematic black-and-white identity.
   - Preserve existing signature red accents (`#FF3B30`) and typography direction.
   - Preserve all 5 curated projects, case studies, images, and text content.
   - Do not add new sections, impact events, or achievements.
   - Do not generate or add visual assets.
   - Do not replace the existing design system.
   - Do not change backend functionality.

---

## 2. Component-by-Component Refinement Architecture

### A. Magnetic Physics & Elastic Snap (`components/MagneticWrapper.tsx`, `components/Header.tsx`)
- **Current State**: Uses standard cubic easing (`power3.out`, `duration: 0.42s`) on mouse exit.
- **Refinement**:
  - Implement Emil Kowalski damped spring physics (`ease: 'elastic.out(1, 0.42)'` or damped spring curve) for a natural, tactile mechanical snap-back.
  - Apply uniform active press feedback (`active:scale-[0.985]`) for immediate tactile acknowledgment.
  - Ensure all navigation targets in `Header.tsx` strictly satisfy the $\ge 44 \times 44\text{px}$ touch target requirement on mobile viewports.

### B. Monumental Hero Typography & Proximity Dynamics (`components/Hero.tsx`)
- **Current State**: Horizontal drift separates "RITVIK" and "CHUNAMARI"; character hover elevation lifts individual characters.
- **Refinement**:
  - Fine-tune character elevation spring physics to eliminate micro-jitter and enhance spring return damping (`duration: 0.5s, ease: 'back.out(2)'`).
  - Optimize mobile typography scaling (`clamp(...)`) to ensure monumental presence without awkward word wraps on narrow 375px/390px viewports.
  - Enhance subtitle and manifesto contrast to strict WCAG 2.2 AAA standard (7:1 contrast on obsidian background).

### C. 3D Spatial Stacking Deck & Multi-Plane Parallax (`components/ProjectList.tsx`)
- **Current State**: Pinned desktop stage scrubbed by Lenis with 5 opaque cards stacking in 3D perspective.
- **Refinement**:
  - Refine multi-plane parallax depth offsets: incoming artwork parallax glide (`yPercent: -20 → 0`), outer plate depth descent (`z: -80 → 0`), and floating title unmasking.
  - Enhance specular edge laser sweep (`scaleX: 0 → 1` with `#FF3B30` tip) so it locks with razor-sharp timing at the focal center.
  - Add tactile active press state (`active:scale-[0.99]`) and preserve unpinned vertical layout for mobile devices with $\ge 44\text{px}$ hit targets for card CTAs.

### D. Scrubbed Reading Word Illumination (`components/About.tsx`)
- **Current State**: Words in the bio scrub from ghost grey to pure white based on scroll position.
- **Refinement**:
  - Smooth the illumination threshold curve in the GSAP timeline to prevent perceptible stepping on rapid wheel flicks.
  - Upgrade skills badge tags and credential links with tactile hover states (`scale: 1.02` with subtle red accent indicator) and active press states (`active:scale-95`).

### E. Laser Guide Rail & Milestone Node Ignition (`components/Experience.tsx`)
- **Current State**: Continuous laser beam tracks scroll, igniting company milestone nodes.
- **Refinement**:
  - Calibrate the milestone node ignition glow radius (`box-shadow: 0 0 12px rgba(255, 59, 48, 0.6)`) to render crisply on high-DPI displays.
  - Refine the text rag and typography contrast of ATS bullet points for effortless readability.

### F. Kinetic Rolling Letter Headline & Contact Intake (`components/Footer.tsx`)
- **Current State**: Slot-machine rolling letter animation on "LET'S TALK", live Mountain Time clock, email copy-to-clipboard.
- **Refinement**:
  - Calibrate the rolling letter wave delay to a buttery $22\text{ms}$ stagger with `cubic-bezier(0.16, 1, 0.3, 1)`.
  - Enhance copy feedback animation with an elastic spring pop (`scale: 1.05 → 1.0`) when copied.
  - Ensure Mountain Time clock and navigation links maintain pristine alignment across all screen widths.

### G. Deep Case Study & Tool Windows (`components/ProjectDetail.tsx`)
- **Current State**: Case studies for all 5 works with Figma viewer, CryptoSimulator, MumbaiLogoGenerator, and CAD specs.
- **Refinement**:
  - Ensure interactive tool headers and action buttons have consistent Swiss red focus states and tactile click depths.
  - Calibrate "RETURN TO INDEX" transition to restore exact deck card state and scroll position.

---

## 3. Verification & Quality Gates

To approve the changes:
1. **TypeScript Type Safety**: `npx tsc --noEmit` must pass with 0 errors.
2. **Production Bundle Compilation**: `npm run build` must compile cleanly in Vite with 0 errors.
3. **Playwright Automated Testing**:
   - Desktop audit (1440×900): verify card stacking deck, header progress line, and 0 console errors.
   - Mobile audit (375×812): verify 0px horizontal overflow, touch target sizes $\ge 44\text{px}$, and fluid scroll stream.
4. **WCAG 2.2 AA / AAA Accessibility Audit**:
   - Zero violations on axe-core.
   - Keyboard tab order and skip link validation.
   - `prefers-reduced-motion: reduce` verification.
5. **EGM Quality Review**: Multi-persona review assessing code health, no-slop adherence, and architectural restraint.
