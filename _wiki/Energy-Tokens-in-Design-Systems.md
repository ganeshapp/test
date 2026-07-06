---
permalink: /wiki/Energy-Tokens-in-Design-Systems/
title: "Energy Tokens in Design Systems"
date: 2026-05-22
tags: [design]
---

Most design tokens are about consistency: colors, spacing, type scales, motion curves — locked in once so the system doesn't drift. **Energy tokens** are a different kind: the *small* set of tokens that are *meant to vary* between products in a portfolio, because different products need to feel different.

The pattern: keep the foundation tokens fixed across every product, but expose a small set of energy tokens (typically just an accent color and maybe a motion intensity) that the product can swap to fit its purpose. See [Personal App Design System](/wiki/Personal-App-Design-System/) for the broader two-layer framework this fits into.

## Why "energy" rather than "accent"

Calling it an accent makes it sound like decoration. It isn't. The accent color and its supporting choices are doing real work:

- They communicate the emotional weight of the product
- They tell the user what kind of task they should be in (calm, focused, intense, playful)
- They distinguish products in a portfolio while keeping them visibly related

A running app and a forecasting tool *should* feel different. Different energy tokens are how they signal that without breaking the shared foundation.

## What goes in the energy layer

The minimum viable energy layer is a single accent color. A more developed energy layer adds:

- **Primary accent** — the main color for highlights, CTAs, active states
- **Accent intensity** — saturation level (kinetic vs muted)
- **Motion bias** — how aggressive the transitions are (snappy vs gentle)
- **Number weight** — how prominent numeric displays are (huge for sports, restrained for analysis)
- **Optional secondary accent** — used sparingly for warnings or contrast

That's still a small enough set that swapping it doesn't break visual cohesion.

## A worked example

The same dark-charcoal foundation, with different energy tokens, across a small portfolio:

| Product | Purpose | Primary accent | Motion | Number weight |
| --- | --- | --- | --- | --- |
| Forecasting / napkin calc | Quiet thinking | Muted steel (`#5B7A99`) | Calm (200ms) | Medium |
| Running app | Performance | Kinetic green (`#3FE89D`) | Snappy (120ms) | Huge |
| Mental math trainer | Reaction sharpness | Sharp amber (`#F5A623`) | Snappy with brief flash | Huge |
| Hacker News reader | Quiet reading | Soft neutral warm (`#D4A574`) | Calm (200ms) | Small |
| Blogging tool | Authoring | Off-white only, no accent | Calm | Small |
| Poker trainer | Strategic intensity | Deep burgundy (`#8B1A3E`) | Snappy | Medium |

All on the same charcoal base. All using the same type family. Same buttons, same spacing system. But each app's energy token set is doing the work of giving it its character.

## How to apply it in code

In a CSS file or design token JSON:

```css
:root {
  /* Foundation — never change across products */
  --bg: #12161D;
  --text: #F1F5F9;
  --muted: #64748B;
  --radius: 8px;
  --space-unit: 8px;

  /* Energy — varies per product */
  --accent: #3FE89D;          /* running app: kinetic green */
  --motion-duration: 120ms;   /* snappy */
  --number-size: 4rem;        /* huge */
}
```

For an AI-assisted build (Cursor, Claude Code), put the foundation tokens in `.cursorrules` and let the per-app energy come from a brief in the prompt: "This app's energy is [competitive intensity for a running app]. Choose appropriate accent and motion tokens."

## A common mistake

The temptation is to keep adding tokens to the "energy" layer until almost everything becomes variable. That collapses the system back into chaos. The discipline is:

- 90% of tokens stay fixed
- 5–10% of tokens vary per product
- Never more

If a third token starts feeling like it needs to vary, the right move is usually to add it to the foundation as a *new* fixed value, not to expand the energy layer.

## See also

- [Personal App Design System](/wiki/Personal-App-Design-System/)
- [Japanese Minimal vs Founder Minimal](/wiki/Japanese-Minimal-vs-Founder-Minimal/)
- [Monospace Fonts for Branding](/wiki/Monospace-Fonts-for-Branding/)
