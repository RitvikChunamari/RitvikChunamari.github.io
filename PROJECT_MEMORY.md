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

## 4. Phase 1 Verification & Polish Enhancements (2026-10-20)
- **Reverse-Scroll Stability (`components/ProjectList.tsx`)**: Replaced `toggleActions: 'play reverse play reverse'` with `'play none none reverse'`, ensuring cards remain stably in view throughout downward reading while cleanly resetting when scrolling back to the top above `#work`.
- **Scroll Jitter Elimination (`components/Hero.tsx`, `components/Header.tsx`)**: Directly synchronized scroll progress to `lenis.on('scroll')` in the GSAP ticker frame, eliminating 1-frame RAF desynchronization and jitter.
- **Visual Continuity Cleanup (`components/Hero.tsx`)**: Removed redundant duplicate `01 / SELECTED WORKS` text above the section header, preserving the sleek vertical gradient guide line (`w-px h-12 bg-gradient-to-b from-[#FF3B30] via-white/20 to-transparent`) for seamless transition into the work exhibition.
- **Mobile Drift Clamping (`components/Hero.tsx`)**: Clamped kinetic drift on mobile (`drift = 0.03`, `maxDrift = 12px`) to ensure 0 horizontal overflow across 375px/390px viewports.
- **Keyboard Focus & Microinteractions (`components/Header.tsx`, `components/ProjectList.tsx`)**: Added Swiss red focus rings (`focus-visible:ring-2 focus-visible:ring-[#FF3B30]`) across all navigation items and project cards; added spring physics on magnetic nav exit.
- **Contrast & Telemetry Scrim (`App.tsx`)**: Wrapped circular scroll progress indicator in an obsidian backdrop (`bg-[#050508]/80 backdrop-blur-md rounded-full border border-white/10 shadow-2xl`) for guaranteed 7:1 contrast across all content.
- **Timeline Integrity (`components/ProjectList.tsx`)**: Transitioned center-focus card telemetry (brackets and Swiss red line) to smooth GSAP tweens (`overwrite: 'auto'`), preventing transform collision with the entry timeline. Softened cursor spotlight sheen to `rgba(255,255,255,0.045)`.

## 5. Phase 2 Implementation & Verification (2026-10-20)
- **About Section Word Illumination (`components/About.tsx`)**: Synchronized word progression directly to Lenis scroll progress (`lenis.on('scroll')`); words in active focal zone illuminate to `#FFFFFF` with micro-lift (-1.5px), preceding words settle to `#EDEDED` (AAA 7:1 contrast on obsidian), upcoming words remain subtle (`0.28`). Added section header laser line reveal.
- **Experience Timeline Guide Rail (`components/Experience.tsx`)**: Replaced one-off listeners with unified Lenis scroll tracking. Added continuous laser progress with luminous micro-glow on the laser tip; milestone nodes smoothly ignite (`scale(1.35)`, `#FF3B30`, glowing halo) with reverse de-ignition on scroll up.
- **Case-Study Detail Synchronization (`components/ProjectDetail.tsx`)**: Synchronized case-study header laser micro-line directly with Lenis scroll progress; added Swiss red focus rings to navigation buttons; updated hero image scrub with buttery momentum (`scrub: 0.6`).
- **Footer Headline Scrub & Microinteractions (`components/Footer.tsx`)**: Replaced cubic scroll math with Lenis-synchronized scrub; "Let's Talk" rises gracefully out of its container mask with micro letter-spacing settling; added tactile spring squeeze (`scale(0.96)`) on email copy with state morph to `✓ COPIED TO CLIPBOARD // READY TO WRITE`.
- **Accessibility & Reduced Motion**: Full bypass for `prefers-reduced-motion` across About, Experience, Case Study, and Footer with immediate 100% visible static presentation.

## 6. Phase 3 Implementation & Verification (2026-10-20)
- **WCAG 2.2 AA Accessible Skip Link (`App.tsx`)**: Implemented high-contrast Swiss Red landmark bypass link (`<a href="#work">Skip to Exhibition /// [Enter]</a>`) accessible as the first focusable element via keyboard `Tab`.
- **Architectural Cursor Pill Morphing (`App.tsx`)**: Enhanced cursor morphing when hovering `[data-cursor-text]` targets ("VIEW CASE", "READ", "DOWNLOAD", "SAY HELLO", "COPY", "INDEX", "NEXT", "TOP", "OPEN"), transforming the ring into a frosted obsidian pill with bold monospace uppercase lettering (`bg-[#050508]/90`, `border-white/80`).
- **Damped Spring Magnetic Physics (`components/MagneticWrapper.tsx`, `components/Header.tsx`)**: Replaced abrupt transform snaps with smooth GSAP spring physics (`gsap.to(ref.current, { x: 0, y: 0, duration: 0.45, ease: 'power2.out' })`) on mouse leave.
- **Tactile Active Press States**: Added uniform micro-scale response (`active:scale-95` / `active:scale-[0.99]`) across all navigation items, project cards, and buttons.
- **Mobile Touch Engine Optimization (`App.tsx`, `components/ProjectList.tsx`, `components/Header.tsx`, `components/Footer.tsx`)**: Completely disabled custom cursor DOM and mouse tracking on touch devices; disabled 3D perspective card tilt on mobile viewports `< 768px`; cushioned mobile touch targets to strictly meet or exceed WCAG 2.2 AA guidelines ($\ge 44 \times 44\text{px}$).

## 7. Case Study & Project Detail Architecture (`components/ProjectDetail.tsx`)
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

## 8. Phase 4 Implementation & Verification (2026-10-20)
- **Three.js GPU Lifecycle & Tab Inactivity Pausing (`components/GlobalFluidCanvas.tsx`)**:
  - Attached `visibilitychange` event listener pausing the Three.js RAF render loop whenever document is hidden, reclaiming 100% idle GPU resources.
  - Added native scroll event listener cleanup.
  - Implemented `prefers-reduced-motion` detection in Three.js canvas: performs an immediate static render and halts continuous hydrodynamic vertex wave loops, respecting accessibility preferences and eliminating background battery drain.
- **Semantic HTML5 Landmark & WCAG 2.2 AA Compliance (`App.tsx`)**:
  - Enclosed active router views within `<main id="main-content" className="relative w-full z-10">`, resolving landmark accessibility requirements.
  - Synchronized skip link targeting `#work` / `#main-content`.
- **Accessible Name & Label Alignment (`components/Hero.tsx`)**:
  - Resolved WCAG 2.5.3 (Label in Name) by updating Hero scroll button accessible name to `aria-label="Scroll to Explore Selected Works"`, matching visible text.
- **Enhanced Micro-Typography Contrast (WCAG 2.2 AAA)**:
  - Upgraded muted uppercase monospace metadata and telemetry classes from `text-white/40` (3.71:1) to `text-white/60` (7.23:1) across `ProjectList.tsx`, `About.tsx`, `Experience.tsx`, and `Footer.tsx`.
- **Comprehensive Verification & Audits**:
  - **Axe-core Automated Audit**: 0 violations across WCAG 2.0, 2.1, 2.2 AA.
  - **Lighthouse Audits**:
    - Best Practices: 100
    - Accessibility: 96
    - SEO: 92
    - CLS: 0.029 (rock-solid layout stability)
  - **Zero AudioContext Invocations**: 0 audio context instances initialized (strict zero-sound constraint verified).
  - **Horizontal Overflows**: 0px across all 6 viewports (1920×1080, 1440×900, 1024×768, 768×1024, 390×844, 375×812).
  - **Production Build**: `npm run build` passes in 1.24s with 0 errors.

## 9. Verification Commands
- `npm run build`: Production bundle compilation (passes cleanly in ~1.2s)
- `node scratch/phase4_inspection.cjs`: Full automated Playwright + Axe-core + AudioContext suite across 6 viewports
- `npm run dev`: Local development server (port 3000)

