# Sci‑Fi UI (Astro)

Astro-first sci‑fi UI: frames, panels, HUD pieces, terminal, radar, Tailwind v4 tokens, and optional React islands (charts, map, motion) where they help.

**License:** [MIT](LICENSE) · **Contributing:** [CONTRIBUTING.md](CONTRIBUTING.md) · **Changelog:** [CHANGELOG.md](CHANGELOG.md)

## Docs

- [docs/architecture.md](docs/architecture.md) — layout and layers  
- [docs/components.md](docs/components.md) — component props  
- [docs/tokens-and-settings.md](docs/tokens-and-settings.md) — CSS variables and `sf:settings`  
- [docs/third-party.md](docs/third-party.md) — tiles, embeds, fonts — legal / privacy notes  

## Optional env flags

See [`.env.example`](.env.example). Set **`PUBLIC_FEATURE_INTEL_ML=false`** to drop COCO-SSD on `/intel`, or **`PUBLIC_FEATURE_MAP=false`** for a map placeholder without MapLibre.

## Stack

Astro 6, Tailwind v4 (`@tailwindcss/vite`), React where needed (uPlot, MapLibre, Framer Motion, TensorFlow.js on `/intel`).

## Routes

| Path | What it is |
|------|------------|
| `/` | Showcase + global settings (theme, overlays, sound) |
| `/dashboard` | uPlot charts + Open-Meteo sample |
| `/map` | MapLibre tactical map (env can disable) |
| `/intel` | YouTube embed + optional local COCO-SSD (env can disable ML block) |

## Layout (src)

`components/` — `core`, `effects`, `hud`, `terminal`, `radar`, `shell` (AppShell, AppNav), `charts`, `map`, `intel` · `layouts/` (ScifiLayout) · `lib/` · `styles/` · `plugins/` · `pages/` · `scripts/` · `data/`

Pages use [`AppShell`](src/components/shell/AppShell.astro) (background, vignette, scanlines) and [`AppNav`](src/components/shell/AppNav.astro). Pass `narrow` to `AppShell` for a centered max-width column.

## Usage

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

**Sound:** wired from [`boot.ts`](src/scripts/boot.ts) via `AppShell`. Use `data-sf-sound-hover` / `data-sf-sound-click`, or `sound` on [`Button.astro`](src/components/core/Button.astro). Settings live under `sf:settings` in `localStorage` — see [`src/lib/settings.ts`](src/lib/settings.ts).

**Themes:** `data-theme` on `<html>` — `ember`, `matrix`, `void` ([`tokens.css`](src/styles/tokens.css)). **Appearance:** `data-sf-appearance` — `high-contrast`, `light`.

**Map tiles:** demo uses public raster endpoints; ship your own tiles or a paid plan and follow each provider’s terms (e.g. [OSM tile policy](https://operations.osmfoundation.org/policies/tiles/)).

**Intel:** webcam / file runs in-browser; YouTube iframes are not script-readable for CV.

## Commands

| Command | Action |
|---------|--------|
| `npm install` | Dependencies |
| `npm run dev` | Dev server (`:4321`) |
| `npm run build` | Production build |
| `npm run preview` | Preview build |

**Node ≥ 22.12** (Astro 6).
