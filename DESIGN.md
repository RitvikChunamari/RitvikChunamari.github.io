---
name: "Ritvik Chunamari Portfolio"
description: "Creative Designer & Vibe Coder. Swiss architectural minimalism meets sensory digital interfaces."
colors:
  cinema-black: "#050507"
  surface-elevated: "#09090E"
  surface-card: "#08080C"
  cinema-white: "#EDEDED"
  cinema-gray: "#8E8E93"
  pure-white: "#FFFFFF"
  brand-red: "#FF3B30"
  grid-border: "rgba(255, 255, 255, 0.07)"
  hairline-border: "rgba(255, 255, 255, 0.10)"
  subtle-border: "rgba(255, 255, 255, 0.20)"
typography:
  display:
    fontFamily: "Inter, -apple-system, BlinkMacSystemFont, sans-serif"
    fontSize: "clamp(3.5rem, 11vw, 10.5rem)"
    fontWeight: 900
    lineHeight: 0.88
    letterSpacing: "-0.04em"
  headline:
    fontFamily: "Inter, -apple-system, BlinkMacSystemFont, sans-serif"
    fontSize: "clamp(2rem, 5vw, 4.5rem)"
    fontWeight: 800
    lineHeight: 1.05
    letterSpacing: "-0.03em"
  title:
    fontFamily: "Inter, -apple-system, BlinkMacSystemFont, sans-serif"
    fontSize: "clamp(1.25rem, 2.5vw, 2.25rem)"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "-0.02em"
  body:
    fontFamily: "Inter, -apple-system, BlinkMacSystemFont, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: "normal"
  label:
    fontFamily: "IBM Plex Mono, monospace"
    fontSize: "0.75rem"
    fontWeight: 500
    lineHeight: 1.2
    letterSpacing: "0.2em"
  telemetry:
    fontFamily: "IBM Plex Mono, monospace"
    fontSize: "0.625rem"
    fontWeight: 400
    lineHeight: 1.2
    letterSpacing: "0.25em"
  micro:
    fontFamily: "IBM Plex Mono, monospace"
    fontSize: "0.5625rem"
    fontWeight: 400
    lineHeight: 1.2
    letterSpacing: "0.2em"
rounded:
  none: "0px"
  xs: "2px"
  sm: "4px"
  md: "8px"
  full: "9999px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "32px"
  2xl: "48px"
  3xl: "64px"
  4xl: "96px"
  5xl: "128px"
components:
  button-primary:
    backgroundColor: "{colors.pure-white}"
    textColor: "{colors.cinema-black}"
    rounded: "{rounded.full}"
    padding: "8px 20px"
  button-primary-hover:
    backgroundColor: "{colors.cinema-white}"
    textColor: "{colors.cinema-black}"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.cinema-white}"
    rounded: "{rounded.full}"
    padding: "6px 16px"
  badge-tag:
    backgroundColor: "{colors.surface-elevated}"
    textColor: "{colors.cinema-gray}"
    rounded: "{rounded.xs}"
    padding: "4px 10px"
---

# Design System: Ritvik Chunamari Portfolio

## Overview

**Creative North Star: "The Swiss Telemetry Atelier"**

The design system of Ritvik Chunamari's portfolio is built upon the disciplined aesthetics of the International Typographic Style (Swiss Design) infused with high-performance computational telemetry. It balances architectural restraint with tactile, sensory digital interactions.

Surfaces exist in a deep obsidian atmosphere (`#050507`), unified by an organic 3.5% film-grain noise overlay and precise hairline grid matrices (`rgba(255, 255, 255, 0.07)`). Monumental display typography commands the hero and project titles, while ultra-fine uppercase monospace coordinates (`01 /// SELECTED WORKS`, `FOLIO // REF-01`, `16:30 MST`) ground the interface with computational rigor. Interactive elements feature subtle magnetic physical pull, responsive 3D card tilts, and smooth kinetic state reveals.

**Key Characteristics:**
- **Monumental Typography & Asymmetric Spatial Balance:** Giant, tightly tracked display letterforms paired with delicate, widely tracked monospace data markers.
- **Surgical Telemetry Accent:** Signature Swiss Red (`#FF3B30`) applied sparingly on less than 5% of viewport area for status pulses, active underlines, and interaction cues.
- **Architectural Registration:** 16px corner registration brackets (`s-border-tl`), hairline structural dividers, and blueprint grid lines.
- **Tactile Magnetic Motion:** Velocity-reactive cursor following, magnetic navigation anchors, and smooth momentum scrolling via Lenis.
- **Strict Zero-Audio Architecture:** Absolute silent interaction—feedback is delivered exclusively through refined kinetic physics, lighting sheens, and typographic transitions.

## Colors

The palette is rooted in cinematic obsidian, crisp editorial whites, and a high-visibility signature Swiss red reserved exclusively for focal states.

### Primary
- **Signature Swiss Red** (`#FF3B30`): The primary telemetry accent. Reserved for active status pulses, laser underline accents, selection text highlights (`::selection`), and interactive state indicators. Never used for large surface fills.

### Neutral
- **Cinema Black** (`#050507`): The core canvas background across all pages. Deep, immersive, and avoids harsh 100% black clipping.
- **Surface Elevated** (`#09090E` / `#08080C`): Elevated showcase card backgrounds with frosted 75% opacity and backdrop blur.
- **Cinema White** (`#EDEDED`): Primary readable text, body copy, and high-visibility titles. Eliminates high-glare eye strain while maintaining 16:1 contrast ratio.
- **Pure White** (`#FFFFFF`): Highlighted typography emphasis, active hover states, and primary button fills.
- **Cinema Gray** (`#8E8E93`): Secondary descriptions, technology tags, and metadata annotations.
- **Dim Gray** (`rgba(255, 255, 255, 0.40)` to `rgba(255, 255, 255, 0.20)`): Telemetry separators, inactive indicators, and technical footnotes.
- **Grid Hairline** (`rgba(255, 255, 255, 0.07)` / `border-white/10`): Structural layout divisions, card boundaries, and coordinate crosshairs.

### Named Rules
**The Rarity of Red Rule.** Signature Red (`#FF3B30`) must never exceed 5% of any viewport's visual weight. Its impact depends entirely on its rarity as an interactive signal.
**The True Obsidian Rule.** Primary canvas backgrounds must always use `#050507` rather than `#000000` to allow the film-grain overlay and WebGL fluid atmosphere to blend organically.

## Typography

The typographic system contrasts monumental display letterforms with high-legibility sans-serif editorial copy and fine industrial monospace telemetry.

**Display Font:** Inter (`sans-serif`), Playfair Display (`serif` for editorial contrast touches)
**Body Font:** Inter (`sans-serif`)
**Label / Telemetry Font:** IBM Plex Mono (`monospace`), Montserrat (`sans-serif` for selected architectural markers)

**Character:** Technical, confident, and Swiss-inspired. Large letterforms act as structural graphic architecture, while wide-tracked monospace tags provide computational telemetry.

### Hierarchy
- **Display** (Bold 900, `clamp(3.5rem, 11vw, 10.5rem)`, `lineHeight: 0.88`, `tracking-tight` / `-0.04em`): Monumental hero name ("RITVIK CHUNAMARI"), responsive edge-to-edge mobile title scaling, and major transition titles.
- **Headline** (ExtraBold 800 / Bold 700, `clamp(2rem, 5vw, 4.5rem)`, `lineHeight: 1.05`, `tracking-tight`): Project titles ("KINETIX QUANT", "NEXUS AI", "USPS ORGANIZATION REBRAND"), section titles, and modal headers.
- **Title** (Bold 700, `clamp(1.25rem, 2.5vw, 2.25rem)`, `lineHeight: 1.2`): Case study subsection headers, modal titles, and experience role titles.
- **Body** (Regular 400 / Light 300, `1rem / 1.125rem`, `lineHeight: 1.6`, `max-width: 68ch`): Manifesto paragraphs, case study problem/solution narratives, and experience bullet points.
- **Label** (Medium 500, `0.75rem / 12px`, `tracking-widest` / `0.2em`, uppercase): Navigation links (`WORK`, `PROFILE`, `CONTACT`), discipline tags, and button text.
- **Telemetry** (Regular 400, `0.625rem / 10px`, `tracking-[0.25em]`, uppercase): Chapter markers (`01 /// SELECTED WORKS`), index counters (`INDEX 001 — 006`), location/time HUD (`Arvada, CO`, `16:30 MST`).
- **Micro** (Regular 400, `0.5625rem / 9px`, `tracking-[0.2em]`, uppercase): Corner registration tags (`FOLIO // REF-01`), education sub-bars, and technology taxonomy labels.

### Named Rules
**The Monospace Telemetry Rule.** Every chapter index, date, coordinate, status badge, and tech stack tag must be rendered in uppercase `IBM Plex Mono` with minimum `0.2em` letter-spacing.
**The Reading Comfort Rule.** Editorial body copy must never exceed `68ch` in line length or drop below `1.6` line-height for optimal scanability and comfort.

## Layout

The spatial model employs a modular 12-column Swiss grid coordinated with smooth momentum scrolling:
- **Desktop (>= 1024px):** 12-column architectural grid with generous asymmetrical negative space, fixed HUD header, and deep project card stream.
- **Tablet (768px – 1023px):** Adaptive 6–8 column grid, scaling card heights and maintaining edge margins.
- **Mobile (< 768px):** 4-column stack with 24px side gutters, full-bleed card frames, and dynamically computed edge-to-edge hero typography.

**Container Max Widths:**
- Main Section Container: `container mx-auto px-6 md:px-12` (max ~1280px)
- Editorial Reading Column: `max-w-2xl` / `max-w-3xl`
- Case Study Gallery Viewport: `w-full h-[50vh] md:h-[68vh]`

**Scroll & Spacing Rhythm:**
- Lenis momentum scroll (`duration: 1.2`, `easing: exponential`) with central RAF coordination.
- Inter-project vertical rhythm: `gap-28` to `gap-36` (112px–144px) between project cards to create museum-grade exhibition pacing.

## Elevation & Depth

Spatial hierarchy is achieved through tonal luminosity steps, hairline boundaries, and reactive lighting rather than conventional drop shadows.

Surfaces feel flat and grounded at rest, with depth emerging through interaction:
1. **Z-Index Architectural Stack:**
   - Base canvas & background shaders: `z-0`
   - Atmospheric noise overlay: `z-9990` (`pointer-events-none`)
   - Exhibition content & project cards: `z-10` to `z-30`
   - Fixed HUD navigation header: `z-50`
   - Custom magnetic cursor follower: `z-9999`
2. **Card Sheen & 3D Tilt:**
   - Project cards respond to cursor position with `perspective(1200px) rotateX(...) rotateY(...)` up to `6deg`.
   - Dynamic radial cursor spotlight: `radial-gradient(600px circle at var(--mouse-x) var(--mouse-y), rgba(255,255,255,0.06), transparent 60%)`.
3. **Film Grain Texture:**
   - Fixed `.noise-overlay` with SVG `fractalNoise` filter at `0.035` opacity with `mix-blend-mode: overlay`.

### Named Rules
**The Flat Tonal Layering Rule.** Depth is established through subtle surface brightness shifts (`#050507` base → `#09090E`/75 card surface with backdrop blur), hairline outlines (`border-white/10`), and interactive sheens—never diffuse colored drop shadows.

## Shapes

- **Card Frames & Viewports:** Minimal industrial corner curve (`rounded-sm` / `2px` to `4px`) maintaining architectural precision.
- **Corner Registration Brackets:** Custom Swiss corner alignment notches (`s-border-tl`, `s-border-tr`, `s-border-bl`, `s-border-br`) with 16px corner tick lengths framing technical cards.
- **Interactive Action Pills:** Full-pill silhouette (`rounded-full` / `9999px`) used for buttons, filter pills, and navigation links to provide clear tactile contrast against rectangular grids.

## Components

### Header (Fixed Glass HUD)
- **Container:** Full-width fixed bar (`h-16`), `#050508`/85 background with `backdrop-blur-md` and bottom hairline border (`border-b border-white/10`).
- **Scroll Progress Micro-Line:** 1.5px gradient bar (`#FF3B30` via `white/80` to `#FF3B30`) tracking scroll depth with `scaleX(progress)`.
- **Branding:** Bold monospace "RC" logo with magnetic cursor attraction.
- **Center Telemetry:** Monospace `Arvada, CO` location and real-time clock (`HH:MM MST`).
- **Navigation Links:** Magnetic text items (`WORK`, `PROFILE`, `CONTACT`) with animated hairline underline reveals.
- **Action Button (`RESUME↓`):** Full-pill outline button (`border-white/50`, `text-[10px] md:text-xs font-mono font-bold tracking-widest`), transitions to solid white on hover with black text.

### Hero Section
- **Monumental Title:** "RITVIK CHUNAMARI" with split-line kinetic drift, mouse proximity interaction, and dynamic edge-to-edge mobile font size computation.
- **Telemetry Meta Bar:** Active pulsating red status dot (`w-1.5 h-1.5 bg-[#FF3B30] animate-pulse`) with folio identifier (`RITVIK CHUNAMARI /// FOLIO 2026`).
- **Designer Manifesto:** High-contrast statement: *"Creative Designer and Vibe Coder crafting sensory digital interfaces at the intersection of computational logic and human intuition."*
- **Disciplines Index:** Industrial monospace tags (`01 INTERACTION ARCHITECTURE / 02 CREATIVE COMPUTING / 03 RADICAL ACCESSIBILITY`).
- **Scroll Trigger:** Magnetic "SCROLL TO EXPLORE" button with animated downward arrow.

### Project Exhibition Cards
- **Showcase Frame:** `w-full h-[50vh] md:h-[68vh]`, `#09090E`/75 frosted glass, hairline border (`border-white/10`), corner brackets, and cursor sheen.
- **Image Float:** High-resolution project imagery with silky dual-layer scroll parallax (`translate3d(0, yOffset, 0)`) and subtle scale-up on card hover.
- **Metadata Matrix:** Two-digit index number (`01`–`06`), monumental uppercase project title, signature red bar (`w-10 h-[2px] bg-[#FF3B30]` expanding to `w-20` on hover), category tag, year, and technology taxonomy pills.
- **Action Affordance:** Circular arrow button (`w-12 h-12 rounded-full border border-white/20`) rotating 45° on hover and scaling up to solid white.

### About & Experience Section
- **Bio Illumination:** Scroll-synchronized word-by-word opacity transition (`0.22` dimmed up to `1.0` solid white) illuminating the personal philosophy as the user scrolls.
- **Insight Cards:** Tonal cards with left-accent framing highlighting accessibility leadership and design principles.
- **Experience Timeline:** Clean chronological work history with company names, roles, date ranges, and bulleted achievements.

### Footer
- **Monumental Contact Action:** Large magnetic email link (`ritvikchunamari@gmail.com`) with kinetic hover reveal.
- **1-Click Copy Interaction:** Clicking the email address triggers instant clipboard write and morphs the status pill to `"COPIED TO CLIPBOARD"` with emerald confirmation.
- **Scroll to Top:** Kinetic back-to-top trigger with smooth Lenis scroll reset.
- **Footer Telemetry:** Copyright notice, local timestamp, and Swiss coordinate annotations.

## Do's and Don'ts

### Do:
- **Do** preserve the authentic brand identity: "Creative Designer and Vibe Coder crafting sensory digital interfaces at the intersection of computational logic and human intuition."
- **Do** maintain strict zero-audio compliance across every component, interaction, and media embed.
- **Do** reserve Signature Red (`#FF3B30`) exclusively for micro-telemetry signals, active states, and focus indicators (<= 5% viewport area).
- **Do** enforce uppercase `IBM Plex Mono` with minimum `0.2em` letter-spacing for all numerical coordinates, section tags, and tech taxonomies.
- **Do** ensure all interactive buttons and magnetic touchpoints provide minimum 44×44px touch areas.
- **Do** respect `prefers-reduced-motion` across all GSAP timelines and scroll listeners with instant, non-animated fallbacks.

### Don't:
- **Don't** add artificial sound effects, audio synthesis, or acoustic triggers under any circumstances.
- **Don't** use generic fuzzy drop shadows or pastel color washes that dilute the Swiss architectural obsidian aesthetic.
- **Don't** add synthetic or unverified projects to the curated 6-project showcase.
- **Don't** use decorative slogans or generic corporate filler copy.
- **Don't** break native browser momentum scrolling or viewport resizing on mobile devices.
