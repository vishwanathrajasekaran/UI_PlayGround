# UI Automation Playground

A catalog of UI specimens for practicing Selenium / Playwright / Cypress —
stable elements for basic locator practice, and deliberately unstable
"hard mode" elements for practicing text- and structure-based locators,
waits, and synchronization.

## Status

Phase 1 (frontend-only, no backend). Sheet **EL — Basic Elements** is built.
Every other category in the sidebar/index is listed as "planned" so the full
map of the app is visible from the start — see `src/catalog.js`.

## Run locally

```bash
npm install
npm run dev
```

## Deploy

Push to GitHub, then import the repo in Vercel (framework preset: Vite).
No environment variables are needed for phase 1.

## Adding a new category

1. Add an entry to `src/catalog.js` with a `path`.
2. Create a page under `src/pages/<slug>/<Name>.jsx`, following the pattern
   in `src/pages/basic-elements/BasicElements.jsx` — wrap each interactive
   element in a `<Specimen>` with an `annotations` list documenting its
   locator attributes. Mark intentionally-unstable specimens with `hard`.
3. Register the route in `src/App.jsx`.

## Locator conventions

- Stable specimens carry both `id` and `data-testid`.
- Hard-mode specimens are visually flagged (amber border + "hard mode"
  badge) and intentionally omit stable attributes — that's the point.
