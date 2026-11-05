# Isolated browser preview — deployment handoff

This preview must be hosted separately from the production `funtasia-audio` GitHub Pages site.

## Recommended destination
Create a new **public** repository in the `funtasiaaudio` GitHub account named `funtasia-site-preview`. A public GitHub Pages preview is accessible to anyone with the URL; do not include private content.

Expected URL after Pages is enabled:
`https://funtasiaaudio.github.io/funtasia-site-preview/`
(This is a **planned URL**, not a live or verified URL.)

## Source
Working branch: `design/funtasia-unified-sage`
Source subtree: `preview/unified/`

## Publish procedure
1. Create the separate repository; do not change Pages settings in `funtasia-audio`.
2. Copy the **contents** of `preview/unified/` to the new repository root, preserving paths:
   - `index.html`, `preview.css`
   - `catalog/catalog.css`, `catalog/catalog.js`
   - `catalog/{ja,en,de,fr,ru}/index.html`
3. Enable GitHub Pages for the preview repository, deploying from its `main` branch root.
4. Verify the homepage and all five catalog language URLs in a browser.
5. Verify images, links, category filters, text search, copy URL and mobile layout.
6. Do not merge the draft PR into production until review and regression checks pass.

## Relative path caveat
The preview homepage currently links to the production homepage using `../../index.html`, which assumes it lives under the original repository's `preview/unified/` path. When copied to a separate repository root, update those homepage links to `https://funtasiaaudio.github.io/funtasia-audio/`. Likewise, catalog language pages use `../../index.html` to return to the preview homepage; when copied into `catalog/<language>/`, this resolves correctly to the preview repository root.

## Current status
Deployment has **not** been performed. The GitHub connector currently offers repository file and PR operations but no create-repository or GitHub Pages settings action. The user must create the destination repository and enable Pages (or connect a deployment-capable tool).
