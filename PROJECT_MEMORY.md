# Project Memory: Ritvik Chunamari Portfolio

## 1. Project Purpose & Architecture
- **Purpose**: High-craftsmanship cinematic design & engineering portfolio for Ritvik Chunamari (Creative Designer & Vibe Coder).
- **Core Visual Identity**:
  - Dark cinematic atmosphere with subtle film grain and obsidian depth
  - Swiss-inspired architectural and editorial typography (Inter, IBM Plex Mono, Montserrat, Playfair Display)
  - Monochrome black/white palette with signature red accents (`#FF3B30` on dark, `#C62828` on light) and cobalt/blue highlights (`#60A5FA`)
  - Monumental interactive hero typography with responsive mobile scaling and physics
  - Clean hero manifesto typography ("Creative Designer and Vibe Coder crafting digital experiences...") with no redundant buttons
  - Fluid elastic cursor with velocity squash/stretch and contextual state targets
  - Smooth custom virtual scroll with zero-overhead circular progress indicator
  - Pristine project showcase cards with Swiss registration crop marks and smooth parallax
  - Comprehensive, deep case study views (`ProjectDetail.tsx`) with live interactive tools (Figma embed, terminal, logo generator)

## 2. Technology Stack & Key Dependencies
- **Core**: React 19.2.0, Vite 6.2.0, TypeScript 5.8.2
- **Animation & Graphics**: GSAP 3.13.0, Three.js 0.185.1, Lenis 1.1.20
- **Styling**: Tailwind CSS configuration
- **Routing**: URL hash routing (`#work`, `#profile`, `#contact`, `#<ProjectTitle>`) with browser history `popstate` support, scroll restoration, and keyboard Escape navigation.
- **Audio Engine**: 100% Silenced stubs (strict compliance: no Web Audio context, synthesis, or acoustic triggers).

## 3. Awwwards-Caliber Scroll Animations Architecture
1. **Butter-Smooth Momentum (Lenis)**:
   - Native DOM flow preserved with smooth momentum scroll via `Lenis` (`v1.1.20`).
   - Zero layout collapse or virtual scroll calculation fragility; fully compatible with keyboard, native search, and Playwright automation.
2. **Hero Kinetic Differential Dispersal (`components/Hero.tsx`)**:
   - Split-word horizontal kinetic drift: "Ritvik" drifts left (`-x * drift`) and "Chunamari" drifts right (`+x * drift`) as the user scrolls, snapping seamlessly back into place on scroll up.
   - Swiss red accent line expands (`scaleX`) as scroll velocity increases.
   - Direct hardware-accelerated `translate3d` transforms driven via RAF without React state re-rendering overhead.
3. **Synchronized Header Obsidian Glass & Progress Line (`components/Header.tsx`)**:
   - High-contrast obsidian glass bar (`bg-[#050508]/85 backdrop-blur-md border-b border-white/10`) eliminating blend-mode text collisions.
   - Continuous 1.5px gradient micro-line (`#FF3B30` via `white/80` to `#FF3B30`) tracking scroll progress across the header base.
4. **Scrubbed Reading Word Illumination (`components/About.tsx`)**:
   - Personal summary paragraph words scrub continuously from subtle ghost white (`rgba(255,255,255,0.22)`) to pure crisp white (`#FFFFFF`) in direct sync with the user's scroll position through the bio section.
5. **Cinematic Curtain Reveal & 3D Specular Tilt (`components/ProjectList.tsx`)**:
   - Cards reveal with an elegant `clip-path: inset(0% 0% 0% 0% round 4px)` curtain wipe.
   - 3D perspective mouse tilt (`rotateX`, `rotateY`) and reactive specular cursor spotlight sheen.
   - Center-focus telemetry ignition: when a project aligns with the center 45% of the viewport, the Swiss red bar expands and the corner registration brackets illuminate.
6. **Vertical Swiss Guide Rail & Milestone Node Ignition (`components/Experience.tsx`)**:
   - Dark obsidian background (`bg-[#050508]`) with vertical 2px guide rail on desktop and continuous red laser beam (`scaleY(progress)`).
   - Milestone node dots at each company ignite to crimson red (`#FF3B30`) with micro-glow when the laser beam touches each job role.
7. **Monumental Reveal & Direct Intake in Footer (`components/Footer.tsx`)**:
   - Velocity-weighted scrub that lifts the massive "Let's Talk" (11vw) heading out of its overflow mask with cubic easing directly tethered to scroll progress.
   - Click-to-copy email microinteraction with instant visual state feedback and resilient fallback.
8. **Accessibility & Reduced Motion**:
   - Full support for `prefers-reduced-motion: reduce`: static fallbacks with 100% opacity, 1:1 scroll, zero kinetic displacement.
   - Zero layout thrashing: all transforms run on GPU compositor (`translate3d`, `scaleX`, `scaleY`, `opacity`).

## 4. Case Study & Project Detail Architecture (`components/ProjectDetail.tsx`)
- **Aesthetic**: Unified Swiss brutalist dark obsidian aesthetic matching the homepage.
- **Palette**: Deep obsidian backgrounds (`#09090e`, `#050508`), hairline borders (`border-white/10`), signature Swiss Red accents (`#FF3B30`), high-contrast display typography, and uppercase monospace telemetry.
- **Fixed Swiss Navigation Header**: Full-width bar with real-time laser scroll progress line (`laserLineRef`), magnetic `← RETURN TO INDEX`, telemetry breadcrumb with pulsing `#FF3B30` active node, and `NEXT PROJECT →`.
- **Monumental Display Hero**: High-contrast uppercase title (`leading-[0.88] tracking-[-0.04em]`), Swiss red accent bar (`w-12 h-[2px] bg-[#FF3B30]`), rectangular badges (`rounded-sm`), and 4-column metadata grid (`ROLE`, `YEAR`, `TECH STACK`).
- **Showcase Stage**: Obsidian media card wrapped in `bg-[#09090e]/85 backdrop-blur-md border border-white/10 rounded-sm` with corner registration brackets (`corner-brackets`).
- **Interactive Tools**:
  - `FigmaViewerWindow.tsx`: Sharp architectural window frame (`bg-[#09090e] border border-white/10 rounded-sm`), monochrome active page tabs, `#FF3B30` indicator.
  - `SecurityUXSection.tsx`: Deep-dive security switchers, objectives, and telemetry metrics.
  - `MumbaiLogoGenerator.tsx` & `CryptoSimulator.tsx`: Interactive studios aligned with obsidian aesthetics.
- **Monumental Next Case Transition Curtain**: Architectural full-width transition curtain featuring telemetry badge (`TRANSITION // 0X OF 0Y`), category subtitle, massive display title (`text-9xl`), Swiss red expanding laser bar, and directional indicator.

## 5. Verification Commands
- `npm run build`: Production bundle compilation (passes cleanly in ~1.4s)
- `node verify_portfolio.cjs`: Playwright automation test suite (passes with 0 errors across 1440x900 and 375x812, 0 audio context instances)
- `npm run dev`: Local development server (port 3000)

