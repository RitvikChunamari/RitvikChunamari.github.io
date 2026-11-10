# Kinetic works list

`kinetic-team-hybrid.tsx` adapts the supplied kinetic team reference to the portfolio's `Project[]` data and existing case-study callback. `components/ProjectList.tsx` preserves the original import path.

The project already uses React, TypeScript, Vite and Tailwind (the existing CDN setup in `index.html`). This reusable component lives in `components/ui`, with scoped styles alongside it. It needs no shadcn primitives or providers; installing the shadcn CLI or Next.js is unnecessary. Native images replace Next Image, `motion/react` reuses the existing Motion dependency, and Lucide supplies the icons.

Desktop fine pointers get a floating preview and direct case-study activation. Narrow screens and coarse pointers get one expandable preview at a time. Native buttons support keyboard operation; reduced motion disables the floating artwork and text movement. Existing project artwork is retained instead of unrelated stock photography. Missing images fall back to the project title.

The section retains the existing obsidian/Inter visual system while adopting the supplied reference's lightweight heading, ruled rows and numbered index. The rest of the site's design system is unchanged.
