# Sci‑Fi UI (Astro)

A small, **Astro-first** sci‑fi interface kit: angled SVG frames, neon glow, HUD scanlines, Tailwind v4 tokens, and **optional** React + Framer Motion only where motion is worth the bundle.

## Stack

- [Astro](https://astro.build/) 6
- [Tailwind CSS](https://tailwindcss.com/) v4 (`@tailwindcss/vite`)
- Optional: React islands (`AnimatedBorder.jsx`) + [Framer Motion](https://www.framer.com/motion/)

## Project layout

```text
src/
├── components/
│   ├── core/          # Frame (edges: angled | square), Panel, Text, Button
│   ├── effects/       # Glow, Scanlines, AnimatedBorder.jsx
│   ├── hud/           # HudMount, HudCorners, HudReticle, HudBar, HudTicker, HudReadout, HudFrame
│   ├── radar/         # Radar.astro (+ exported RadarBlip type)
│   └── terminal/      # Terminal, TerminalLine, TerminalPrompt
├── layouts/           # ScifiLayout.astro (fonts + global styles)
├── lib/               # animation.ts, sound.ts, index.ts
├── pages/             # Demo dashboard (index.astro)
├── plugins/           # sci-fi.mjs — Tailwind plugin (token utilities)
└── styles/            # global.css, tokens.css, utilities.css
```

## Usage

Import the layout (or import `../styles/global.css` yourself), then compose primitives:

```astro
---
import ScifiLayout from "../layouts/ScifiLayout.astro";
import Panel from "../components/core/Panel.astro";
import Text from "../components/core/Text.astro";
---

<ScifiLayout title="My HUD">
  <Panel variant="primary" glow>
    <Text variant="heading">Status</Text>
  </Panel>
</ScifiLayout>
```

### Sound (optional)

1. Call `bindDelegatedSound()` once from a client `<script>` (see `src/pages/index.astro`).
2. Use `configureSound({ enabled: true })` or the `sound` prop on `Button.astro`, which sets `data-sf-sound-*` hooks.

Defaults use tiny Web Audio beeps when no custom URLs are configured.

### Themes

Set `data-theme` on `<html>` to one of: `ember`, `matrix`, `void` (see `src/styles/tokens.css`). The demo persists a choice in `localStorage`.

## Commands

| Command           | Action                |
| ----------------- | --------------------- |
| `npm install`     | Install dependencies  |
| `npm run dev`     | Dev server (`:4321`)  |
| `npm run build`   | Production build      |
| `npm run preview` | Preview the build     |

## Node

This project targets **Node ≥ 22.12** (per Astro 6).
