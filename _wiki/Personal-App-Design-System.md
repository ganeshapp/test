---
permalink: /wiki/Personal-App-Design-System/
title: "Personal App Design System"
date: 2026-05-22
tags: [design]
---

When one person ships many small apps — a forecasting tool, a running app, a mental-math trainer, a blogging tool, a poker trainer — they tend to end up with a portfolio that looks like a chaotic collection of side projects rather than a cohesive body of work. Each app picks its own colors, its own buttons, its own fonts, because that's what AI IDEs default to when you don't tell them otherwise.

The fix is **one foundation, multiple energies**. Lock in the rules that never change across products; vary only the elements that *should* feel different per product.

## The two-layer system

### Layer 1: Foundation (shared across every app)

Everything here is non-negotiable. Lock these in once and never re-debate them.

**Typography**
- One primary sans (Inter, IBM Plex Sans, or a Geist-class face)
- One mono for numbers and data (IBM Plex Mono or JetBrains Mono — see [Monospace Fonts for Branding](/wiki/Monospace-Fonts-for-Branding/))
- Tight tracking
- No playful or rounded fonts
- Numerics slightly larger than labels

**Color base**
- Dark charcoal background, not pure black (e.g. `#12161D` or `#0F1115`)
- Off-white text, not pure `#FFFFFF` (e.g. `#F1F5F9`)
- 3–4 neutral grays for hierarchy
- No gradients in base UI
- No glassmorphism, no skeuomorphism

**Shape system**
- 6–8px maximum corner radius
- No pill buttons
- No heavy shadows
- Flat, precise edges

**Layout**
- 8pt grid
- Dense but breathable
- Clear hierarchy
- No decorative dividers
- White space used intentionally, not by accident

**Motion**
- Fast, snappy
- 150–200ms transitions
- No bounce, no overshoot

This foundation is the operating system of every app you build. It's also what makes the apps feel like they came from the same hand without forcing them into identical UIs.

### Layer 2: Energy (varies per product)

The accent color is not decoration. It's emotional voltage. Different apps need different voltages.

A rough mapping for typical app categories:

| App type | Energy | Accent direction |
| --- | --- | --- |
| Forecasting / thinking tool | Precision & clarity | Cool steel or muted cobalt |
| Running / interval app | Competitive aggression | Electric green or kinetic red |
| Mental math trainer | Cognitive sharpness | Sharp amber or high-contrast white highlights |
| HIIT / strength designer | Explosive power | Acid green or bold red |
| Biking / endurance | Endurance flow | Cyan or speed-blue |
| Poker / strategy | Calm intensity | Deep red or burgundy |
| Reading / Hacker News | Quiet attention | Soft neutral with a single warm accent |
| Blogging | Authorial voice | Off-white on dark, single subtle accent |

The same charcoal foundation. Different accent. Different feel.

## Why one philosophy doesn't work everywhere

The temptation is to pick a single style (say, [Japanese minimal](/wiki/Japanese-Minimal-vs-Founder-Minimal/)) and apply it everywhere. This breaks down because different products genuinely need different emotional registers:

- A running app should feel like controlled violence at pace, not like a Zen garden.
- A forecasting tool should feel like quiet structured thinking, not like a startup-bro dashboard.

Forcing one style across both dilutes both products. Forcing different styles across both creates portfolio chaos.

The two-layer solution preserves cohesion (shared foundation) while letting each product have the right emotional weight (different energy).

## What this looks like for AI-assisted development

When prompting Cursor or Claude Code to build a new app, the foundation rules should go in `.cursorrules` (or `agent.md`) as hard constraints. The per-product energy goes in a separate config — typically a `tokens.css` file or equivalent — that the AI is told to vary based on the app's purpose.

A minimal `.cursorrules` snippet:

```markdown
## Design constraints (non-negotiable foundation)

- Dark charcoal base (#12161D or similar), never pure black
- Off-white text (#F1F5F9), never pure white
- IBM Plex Mono for numerics; Inter or IBM Plex Sans for everything else
- 6–8px max corner radius. No pills, no shadows, no glassmorphism.
- 8pt grid for spacing
- Motion: 150–200ms, no bounce

## Per-app energy (vary by product)

This app's energy is: [specific brief — e.g. "competitive intensity for a running app"]
Use the appropriate single accent color, kept consistent throughout.
```

This produces apps that visibly belong to the same family without being clones.

## See also

- [Japanese Minimal vs Founder Minimal](/wiki/Japanese-Minimal-vs-Founder-Minimal/)
- [Monospace Fonts for Branding](/wiki/Monospace-Fonts-for-Branding/)
- [Energy Tokens in Design Systems](/wiki/Energy-Tokens-in-Design-Systems/)
- [Zapp Cursor Rules](/wiki/Zapp-Cursor-Rules/)
