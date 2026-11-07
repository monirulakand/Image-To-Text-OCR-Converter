# Optical Character Recognition (OCR)

Optical Character Recognition (OCR) is the process that converts an image of text into a machine-readable text format.

Upload an image, pick a language, and the app runs Tesseract.js entirely in the browser — no server round-trip.

---

## Stack

| Package | Version |
| --- | --- |
| Next.js | 16.4.5 (App Router, Turbopack) |
| React / React DOM | 19.3.1 |
| Tesseract.js | 7.0.0 |
| Bootstrap | 5.3.8 |
| react-bootstrap | 2.10.10 |
| animate.css | 4.1.1 |
| ESLint | 9.39.5 (`eslint-config-next` 16.4.5, flat config) |
| Jest | 30.5.2 + React Testing Library 16 |

Requires **Node.js ≥ 20.9**.

## Getting started

```bash
npm install
npm run dev      # http://localhost:3000
```

| Script | Description |
| --- | --- |
| `npm run dev` | Start the Turbopack dev server |
| `npm run build` | Production build (Turbopack) |
| `npm start` | Serve the production build |
| `npm run lint` | ESLint via the ESLint CLI |
| `npm test` | Jest + React Testing Library |

## Project structure

```
├── app/                      # App Router
│   ├── layout.js             # Root layout: fonts, global CSS, background video, metadata
│   ├── page.js               # Home route
│   ├── manifest.js           # PWA manifest -> /manifest.webmanifest
│   └── globals.css           # Project styles (moved from src/Asset/css/Style.css)
├── components/
│   ├── ImageToText.js        # Client component: upload, language select, OCR run
│   ├── ImageToTextPage.js    # Client component: composes the page
│   ├── Loader.js             # Client component: loading overlay
│   ├── MenuBar.js            # Client component: navbar
│   ├── ReportWebVitals.js    # next/web-vitals hook
│   └── languages.js          # Tesseract language code list
├── public/
│   ├── images/               # SVGs moved out of src/Asset/image
│   └── video/video.mp4       # Background video
├── __tests__/ocr.test.js
├── next.config.mjs
├── eslint.config.mjs
├── jest.config.mjs
└── jsconfig.json             # "@/*" path alias
```

---

## Migration notes: Create React App → Next.js 16

### Structural moves

| CRA | Next.js |
| --- | --- |
| `src/index.js` (ReactDOM.render) | `app/layout.js` + `app/page.js` (App Router) |
| `src/App.js` | `app/page.js` |
| `public/index.html` | `app/layout.js` (`<head>` → `metadata` / `viewport` exports) |
| `public/manifest.json` | `app/manifest.js` → `/manifest.webmanifest` |
| `src/reportWebVitals.js` | `components/ReportWebVitals.js` (uses `next/web-vitals`) |
| `src/Asset/css/Style.css` | `app/globals.css` |
| `src/Asset/css/bootstrap.min.css` | `bootstrap` npm package, imported in the root layout |
| `src/Asset/css/animate.min.css` | `animate.css` npm package (v4 class prefix) |
| `src/Asset/image/*.svg` | `public/images/*.svg` |
| `src/setupTests.js` | `jest.setup.js` |

### Dependency changes

- **Removed `react-scripts`** — replaced by the Next.js CLI.
- **Removed `react-animated-css`** — it depends on `react-transition-group@4`, which calls
  `ReactDOM.findDOMNode()`. That API was **removed in React 19**, so the package would
  throw at runtime. The `<Animated animationIn="zoomIn">` wrapper was replaced with the
  equivalent `animate.css` classes (`animate__animated animate__zoomIn` plus the same
  400 ms delay and duration), which produce the identical animation.
- **Bootstrap 4 → 5** with `react-bootstrap` 1.x → 2.10.x. The markup API used here
  (`Container`, `Row`, `Col`, `Navbar`, `Navbar.Brand`) is unchanged. Bootstrap 5 removed
  `.form-control-file`; the file input is now styled through Bootstrap 5's own
  `.form-control[type="file"]` rule (re-declared in `app/globals.css`).
- **Removed `react-icons`** — it was declared but never imported anywhere in the source.
- **Removed `web-vitals`** — superseded by `next/web-vitals`.
- **Tesseract.js 2 → 7** — the top-level `Tesseract.recognize()` is deprecated in v7, so the
  component now uses the current `createWorker()` → `worker.recognize()` → `worker.terminate()`
  API. The worker is always terminated in a `finally` block so it cannot leak.

### React 19 / Next.js 16 specifics

- Class components were rewritten as function components with hooks
  (`useState` instead of `this.state` / `setState`).
- `Tesseract.js` is imported **lazily** inside the click handler
  (`await import('tesseract.js')`), so the WASM OCR core never lands in the server render
  or the initial page bundle.
- `'use client'` marks the boundaries that need browser APIs (file reading, state, react-bootstrap).
- `next lint` was removed in Next.js 16 — linting now runs through the ESLint CLI directly
  (`npm run lint`) with a flat `eslint.config.mjs`.
- The full-screen background video moved from the CRA `index.html` into `app/layout.js` and
  its styles into `app/globals.css`.
- `next/font/google` now self-hosts Roboto instead of the runtime Google Fonts `@import`.

### Bug fixes carried over from the original

- The Slovak entry had a trailing space in its value (`"slk "`), which is not a valid
  Tesseract language code. Fixed to `"slk"`.
- Pressing **Do OCR** without choosing a language sent an empty language code to Tesseract.
  The app now shows a clear message instead of failing.
- The background video was painted **on top of** the app content in the CRA layout (a
  `position: fixed` element with `z-index: auto` paints above static, in-flow content).
  It now uses `z-index: -1`, which matches the intended "background video" design.

### Testing

The original `App.test.js` asserted on a "learn react" link that the app never rendered, so
it was replaced with a real suite (`__tests__/ocr.test.js`) covering the navbar, the OCR
controls, the placeholder result, and the language list. Jest runs through `next/jest`, which
uses the same SWC transform as Next.js.

### Not carried over

`create-react-app` extras that only exist for CRA — `reportWebVitals` wiring, the
`react-app-env.d.ts` type shim, `%PUBLIC_URL%` placeholders, and the `browserslist` field —
are gone. `browserslist` now lives in `package.json` only if you need it; Next.js targets
modern browsers by default.
