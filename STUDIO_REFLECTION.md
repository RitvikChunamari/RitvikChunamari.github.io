# Studio Reflection & Artifact Submission

**Student:** Ritvik Chunamari  
**Artifact:** Interactive Design Portfolio ([ritvikchunamari.github.io](https://ritvikchunamari.github.io))  
**Presentation Deck:** [Ritvik_Portfolio_Studio_Presentation.pdf](./Ritvik_Portfolio_Studio_Presentation.pdf)  
**Date:** Spring 2026  

---

## Reflection

For this artifact, I set out to rebuild my digital portfolio from scratch rather than relying on another generic Webflow template or a flat, static PDF. I wanted to treat my portfolio itself as an active proof of craft—something tactile, responsive, and alive that people could genuinely interact with. My plan was to pair bold Swiss editorial typography with an interactive HTML5 canvas antigravity particle simulation that responds to cursor velocity and proximity, while featuring deep-dive product case studies (like my USPS fleet redesign, the Nexus AI node workflow editor, and the SOC cybersecurity platform) alongside an automated 2-page vector resume pipeline.

What I actually did was write the entire application in React 19, TypeScript, Tailwind CSS, and Framer Motion, supplemented with custom canvas physics. I spent days tuning responsive layouts, dialing in typographic hierarchy, and setting up a headless Chromium print automation so that any recruiter can export a clean, ATS-parseable 2-page resume directly from the site. 

The hardest part—and where things genuinely broke—was confronting the brutal reality of browser performance. On my first build, I tried to make the project cards dynamically tilt in 3D (`rotateX`) as you scrolled, while continuously firing React state updates to track scroll progress. It was a disaster: on high-refresh displays, the frame rate tanked below 30 frames per second, the scrolling felt like trudging through mud, and layout thrashing made the entire page stutter. On top of that, the antigravity particle physics that felt playful with a desktop mouse turned into an annoying visual obstacle on mobile touchscreens, blocking natural swipe inertia and killing battery life. Even the typography betrayed me: on narrower screens (like an iPhone 13), my last name "Chunamari" kept wrapping onto a third line or shrinking into illegibility because fixed margin calculations broke down at smaller viewports.

To fix this, I had to stop obsessing over visual spectacle and start engineering for real-world constraints. I scrapped the 3D tilt completely and rewrote the scroll tracking using direct CSS custom properties bound to a single `requestAnimationFrame` loop, dropping component re-renders to zero during scrolling and locking in a buttery-smooth 120fps. For mobile devices, I added `@media (hover: none)` detection and dynamic touch event listeners so the cursor particles smoothly soft-fade to zero opacity the millisecond someone touches the screen. I also rebuilt the hero typography using responsive fluid `clamp()` math, ensuring "Ritvik" stays locked on line one and "Chunamari" on line two, filling the entire allocated margin edge-to-edge on any device without breaking.

What I learned through this process is that in digital product design, performance *is* user experience. A visually stunning animation or 3D effect is completely worthless if it drops frames or gets in the way of a user trying to read your work. Real design craft isn’t about how many flashy effects you can cram into a viewport; it’s about restraint, input latency, and understanding browser rendering physics so deeply that the interface feels effortless and invisible.
