# FUNtasia Unified Website — Baseline Audit & Migration Plan

Date: 2026-11-05
Status: planning only; production unchanged.
Branch: design/funtasia-unified-sage

## Approved product direction
- Evolve the existing FUNtasia Audio GitHub Pages site into the unified FUNtasia site.
- Keep the existing GitHub Pages deployment URL during initial work.
- One shared FUNtasia Sage visual identity across Audio, Studio, Utilities, Records, Support, and Hʉeliang.
- List only publicly available products (public beta clearly identified).
- Preserve downloads and product sharing.
- Preserve five languages: Japanese, English, German, French, Russian.
- Move FUNtasia Records under /records/ after a separately verified migration.
- Hʉeliang profile uses the current Records character icon until a professionally photographed portrait replaces it.

## Verified repository baseline (default branch, 2026-11-05)
- index.html, ja/index.html, de/index.html, fr/index.html, ru/index.html have the **same blob SHA**: d407bf9134756ac5030bdb4031c2fe335ff5c7eb.
- These HTML files begin with html lang="en" and the root English canonical URL. They reference alternate hreflang URLs, but the files are identical.
- product-share.js exists (SHA f936ec57445c717d1b41a9f903c919eb48765f13) and includes localized strings.
- script.js includes GitHub Releases asset-resolution logic.
- styles.css defines an existing dark green/cream theme.

Important: identical HTML does not alone prove the rendered language switch is broken. Inspect runtime translation scripts and test live pages before concluding.

## Implementation gates
1. Inventory all root and locale assets, including scripts, CSS, images, release links, and existing navigation.
2. Check language switching, page metadata (html lang, canonical, hreflang), sharing and downloads on the rendered site.
3. Establish a regression checklist and immutable baseline reference.
4. Build shared navigation and design tokens on this branch; retain original product content and links.
5. Add Audio / Studio / Utilities / Records / Hʉeliang route templates with localized content.
6. Validate 5-language routing, responsive behavior, accessibility, links and previews.
7. Migrate Records content with verified asset inventory and redirect mapping. Do not retire old URLs before validation.
8. Publish only after user review and regression checks.

## Non-goals for this initial phase
- No direct edits to main.
- No production deployment.
- No removal of existing products, language URLs, or share/download features.
- No unverified claim that browser behavior has passed tests.
