# Sci‑Fi UI (Astro)

A small, **Astro-first** sci‑fi interface kit: angled SVG frames, neon glow, HUD scanlines, Tailwind v4 tokens, and **optional** React + Framer Motion only where motion is worth the bundle.

**License:** [MIT](LICENSE) · **Contributing:** [CONTRIBUTING.md](CONTRIBUTING.md) · **Changelog:** [CHANGELOG.md](CHANGELOG.md)

## Kit vs demo (what to reuse)

| Copy into your fork | Showcase / heavy optional |
| -------------------- | --------------------------- |
| `src/components/core/`, `effects/`, `hud/`, `terminal/`, `radar/`, `shell/` | [`index.astro`](src/pages/index.astro) (kit + settings) and [`dashboard.astro`](src/pages/dashboard.astro) (charts) |
| `src/styles/`, `src/plugins/`, `src/lib/` (settings, sound) | [`map.astro`](src/pages/map.astro) + MapLibre (optional via env) |
| [`ScifiLayout.astro`](src/layouts/ScifiLayout.astro) + `AppShell` / `AppNav` | [`intel.astro`](src/pages/intel.astro) + YouTube embed + TensorFlow.js (optional via env) |

More detail: [docs/architecture.md](docs/architecture.md).

## Documentation

| Doc | Contents |
| --- | -------- |
| [docs/architecture.md](docs/architecture.md) | Layers, kit vs demo diagram |
| [docs/components.md](docs/components.md) | Props for core, shell, and HUD building blocks |
| [docs/tokens-and-settings.md](docs/tokens-and-settings.md) | CSS variables and `sf:settings` keys |
| [docs/third-party.md](docs/third-party.md) | Tiles, YouTube, TF.js, fonts — legal and privacy caveats |

## Slim forks (env flags)

Optional **`PUBLIC_`** variables (see [`.env.example`](.env.example)) disable heavy client islands while keeping the rest of the template:

- **`PUBLIC_FEATURE_INTEL_ML`**: set to `false` to omit the COCO-SSD block on `/intel`.
- **`PUBLIC_FEATURE_MAP`**: set to `false` to omit MapLibre on `/map` (placeholder message instead).

Unset values keep the full demo behavior.

## Stack

- [Astro](https://astro.build/) 6
- [Tailwind CSS](https://tailwindcss.com/) v4 (`@tailwindcss/vite`)
- Optional: React islands (`AnimatedBorder.jsx`, charts, map, intel CV) + [Framer Motion](https://www.framer.com/motion/)
- On `/intel`: [TensorFlow.js](https://www.tensorflow.org/js) + [COCO-SSD](https://github.com/tensorflow/tfjs-models/tree/master/coco-ssd) for **local** object detection (webcam / file only)
- [MapLibre GL](https://maplibre.org/) + OpenStreetMap raster tiles on the **Map** route (demo only)

## Routes

| Path | Description |
|------|-------------|
| `/` | Kit showcase, **global settings** (theme, appearance, overlays, sound), HUD / terminal / radar samples. |
| `/dashboard` | **uPlot** telemetry: hourly temperature (Open-Meteo) with the **same city presets** as the map, plus static bar/spark data. |
| `/map` | Tactical map: MapLibre, **multiple basemap styles** (OSM, Carto dark/light/voyager, OpenTopoMap), **global city presets** (fly-to), readouts, HUD panel. |
| `/intel` | **YouTube** embed (muted autoplay) + mock “Run scan” UI; **real** COCO-SSD object detection on **webcam or uploaded video** (in-browser, no upload). YouTube pixels cannot be analyzed (cross-origin). |

## Project layout

```text
src/
├── components/
│   ├── core/          # Frame, Panel, Text, Button
│   ├── effects/     # Glow, Scanlines, AnimatedBorder.jsx
│   ├── hud/         # HudMount, HudCorners, HudReticle, HudBar, HudTicker, HudReadout, HudFrame
│   ├── radar/       # Radar.astro
│   ├── terminal/    # Terminal, TerminalLine, TerminalPrompt
│   ├── charts/      # DashboardCharts.tsx (uPlot)
│   ├── map/         # TacticalMap.tsx (MapLibre)
│   └── shell/       # AppShell.astro (chrome + boot script), AppNav.astro
├── layouts/         # ScifiLayout.astro only (fonts + global styles + settings bootstrap)
├── lib/             # animation.ts, sound.ts, settings.ts, map-cities.ts (shared map + weather presets)
├── pages/           # index.astro, dashboard.astro, map.astro, intel.astro; api/meteo.json.ts
├── scripts/         # boot.ts, intel-demo.ts
├── data/            # dashboard-snapshot.json
├── plugins/         # sci-fi.mjs — Tailwind plugin
└── styles/          # global.css, tokens.css, utilities.css
```

## Full-width shell

Pages wrap content in [`AppShell.astro`](src/components/shell/AppShell.astro) (background, vignette, noise, scanlines) and [`AppNav.astro`](src/components/shell/AppNav.astro) (sticky primary nav). The shell uses horizontal padding only — **no** global `max-w-6xl` cap so layouts can use the full viewport. Pass `narrow` to `AppShell` if a page needs a centered max-width column.

## Usage

Import the layout, then compose `AppShell` / `AppNav` and primitives:

```astro
---
import ScifiLayout from "../layouts/ScifiLayout.astro";
import AppShell from "../components/shell/AppShell.astro";
import AppNav from "../components/shell/AppNav.astro";
import Panel from "../components/core/Panel.astro";
---

<ScifiLayout title="My HUD">
  <AppShell>
    <AppNav />
    <Panel variant="primary" glow>…</Panel>
  </AppShell>
</ScifiLayout>
```

### Sound (optional)

`bindDelegatedSound()` runs from [`src/scripts/boot.ts`](src/scripts/boot.ts) (imported by [`AppShell.astro`](src/components/shell/AppShell.astro) on every page that uses the shell). Use `data-sf-sound-hover` / `data-sf-sound-click` on interactive elements, or the `sound` prop on [`Button.astro`](src/components/core/Button.astro).

Defaults use tiny Web Audio beeps when no custom URLs are configured. Settings persist under `sf:settings` in `localStorage` (theme, appearance, overlays, motion, sound — see [`src/lib/settings.ts`](src/lib/settings.ts) and [docs/tokens-and-settings.md](docs/tokens-and-settings.md)).

### Themes and appearance

Set `data-theme` on `<html>` to one of: `ember`, `matrix`, `void` (see [`src/styles/tokens.css`](src/styles/tokens.css)). The demo persists choices via the settings module.

**Appearance** (`data-sf-appearance` on `<html>`): `high-contrast` strengthens borders and text steps; `light` switches to a light shell while keeping the same accent themes. Default omits the attribute.

### Maps and tiles

The map page uses **MapLibre** with switchable **raster** styles (default OpenStreetMap, plus Carto and OpenTopoMap presets in [`TacticalMap.tsx`](src/components/map/TacticalMap.tsx)). Each provider has its own attribution and usage rules — use your own tile hosting or a commercial plan when you ship, and respect the [OSM tile usage policy](https://operations.osmfoundation.org/policies/tiles/) if you continue to hit OSM.org tiles directly.

### Intel page disclaimer

[`/intel`](src/pages/intel.astro) mixes a **YouTube** embed (decorative / broadcast) with a **local sensor** panel ([`IntelObjectDetector.tsx`](src/components/intel/IntelObjectDetector.tsx)) that runs **TensorFlow.js COCO-SSD** on your **webcam** or a **video file** you choose. Inference stays in the tab (weights download from Google’s model CDN on first use). **YouTube iframe frames are not readable** by page scripts, so detection cannot target that stream without a server-side pipeline outside this demo.

## Commands

| Command           | Action                |
| ----------------- | --------------------- |
| `npm install`     | Install dependencies  |
| `npm run dev`     | Dev server (`:4321`)  |
| `npm run build`   | Production build      |
| `npm run preview` | Preview the build     |

## Node

This project targets **Node ≥ 22.12** (per Astro 6).
