# Kingbird Landing Page

Static HTML/CSS prototype of the Kingbird American Aperitif landing page. This is a first pass while we wait on the official exportable assets (transparent bottle PNGs, textures, and photography) from Figma.

## Structure

```
kingbird-landing/
├── assets/               # drop exported PNG/WebP/SVGs here
├── index.html            # markup organized by hero + sections
├── styles.css            # global variables, layout, and responsive rules
├── scripts.js            # lightweight email capture placeholder
└── README.md
```

## Fonts

Using Google Fonts **Oswald** (headlines) and **Space Grotesk** (body). Swap them with brand fonts once we have the licensed files. Update the `@font-face` or Google Fonts import in `index.html` accordingly.

## Email Capture

`<form class="signup-form">` currently contains a placeholder handler (see `scripts.js`). Replace the `alert` with:

- Klaviyo / Mailchimp endpoint (AJAX POST)
- Shopify customer creation endpoint
- Whatever ESP you prefer

## Assets TODO

- `assets/kingbird-mark.svg` (hero badge)
- Transparent PNG/WebP for the bottle (hero + footer)
- Lifestyle photography for the “Serve over ice” block and the “Join the club” background
- Bar venue imagery (optional, we can stick with typographic cards)

Once assets are exported from Figma, drop them into `assets/` and update the `<img>` tags / CSS `background-image` rules accordingly.

## Development

No build step required—open `index.html` in a browser. If you’d like hot reload + Sass/PostCSS, we can layer Vite or Parcel, but keeping it vanilla for now since it’s destined for Shopify Online Store 2.0 section markup.

## Next Steps

1. Provide/confirm brand fonts + hex values.
2. Export the assets from Figma and replace the placeholders.
3. Decide whether this should be:
   - A standalone landing page (hosted on Vercel/Netlify)
   - A Shopify section/page template for the live store
4. Hook the signup form to the ESP of choice.

Let me know when you have the assets and I’ll finish the polish pass + Shopify packaging.
