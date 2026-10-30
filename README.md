# Kingbird Stories

A mobile-first, automatically advancing nine-story landing-page prototype built with Next.js, React, TypeScript and Tailwind CSS. It uses Kingbird's actual photographs, logos, typefaces and documented cocktail recipes.

## Run locally

Use Node.js 22.12 or newer (24 LTS is suitable).

```sh
npm ci
npm run dev
```

Open http://127.0.0.1:3001. Development uses polling file watching to avoid the native file-watcher limit encountered on this computer. For a production preview:

```sh
npm run build
npm start
```

Stop the other process before using the same port.

```sh
npm test
npm run typecheck
```

## Edit the experience

- `content/stories.ts`: story order, IDs, headline/copy, image, focal position, layout, CTA, animation and analytics experiment metadata; official recipes; commerce settings.
- `app/components/story-experience.tsx`: timed story viewer, synchronized video, keyboard/tap/swipe navigation, age attestation, story index, recipe/ingredient drawers and purchase handoff.
- `app/globals.css`: visual tokens, native fonts, responsive layouts and reduced-motion rules.
- `public/assets/`: optimized local WebP media and original brand SVG/fonts. Mobile variants are 720 pixels wide; desktop variants are 1200 pixels wide. Full-resolution source photographs remain outside the deployable project.
- `docs/kingbird-brand-knowledge-base.md`: source register, audit, conflicts and launch gaps.
- `docs/kingbird-storyboard.md`: objective, objection, copy, asset, CTA and interaction for each story.
- `docs/commerce-and-analytics.md`: integration behavior, event semantics and production setup.

Opening `/?story=flavor` restores a particular story. `/?recipe=spritz` opens a recipe after age confirmation. The old `/aperitifs.html` URL redirects to the recipe experience. Root-level HTML/CSS/JS files are retained historical prototype files; Next.js does not serve them as the new homepage.

## Commerce

The current store was inspected on October 29, 2026. Its two-bottle variant is `49350975029530`, $72 USD, 750 mL per bottle. The offer CTA opens the user-selected Shopify product page with the two-bottle variant preselected. Visitors can inspect options and purchase on Kingbird's shop. It opens a new tab, retaining the story position. The product and offer screens use the real KINGBIRD-BOTTLE-FASHION photograph from the supplied asset library.

The landing page does not claim that a cart action succeeded or that a purchase occurred. Shopify handles stock, final totals, delivery eligibility and checkout. Display price is a dated snapshot: reverify it before release. No secrets or Storefront API token are required for this handoff.

Round two removes the website header and sidebars, centers a 9:16 portrait card, adds animated progress with seven-second image stories and actual video timing, and holds the final offer. Pause with the playback control, a pointer hold, an open drawer, keyboard focus, or by leaving the tab. Locally hosted Obviously Condensed Bold and Della Respira are loaded from the supplied font files. Three authentic video stories and source-linked press/menu recognition are included. See `docs/round-two-refinements.md` for evidence and editorial decisions.

## Launch status

Deployment targets: the `main` branch of `xvm-ghillent/kingbird` on GitHub and the existing `kingbird` project on Vercel. `robots` metadata remains set to noindex while the campaign is under review.

The provided documents conflict on ABV and shipping coverage. The page makes no lower-alcohol comparison or blanket nationwide shipping promise. Age confirmation is an attestation, not identity verification or a complete alcohol-commerce compliance solution. Confirm label, sales territories and legal delivery requirements before release. Hosted analytics, consent management and Shopify purchase tracking require merchant-side configuration; local interaction hooks are implemented without an external collector.

The three supplied documents and all nine press-ready images have been reviewed, along with the original six-page label/poster PDF. The deeper historical photo/video archive has not been exhaustively reviewed. The Niitrops screenshots/video referenced in the brief were not attached; the implementation follows the written interaction specification.
