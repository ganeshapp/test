---
permalink: /wiki/Public-Domain-Software-Licenses/
title: "Public Domain Software Licenses"
date: 2026-05-24
tags: [zapps, licensing]
---

The standard reflex for an open-source release is to slap on an MIT or Apache 2.0 license. That's fine for most situations, but it's not actually "do whatever you want, no strings attached." MIT requires preserving the copyright notice in copies and derivatives; Apache adds extra contributor terms. For someone who genuinely wants their code to be a public good with **no attribution required**, both are friction.

There are several "no strings" options. They aren't equally good. This page recommends the legally cleanest ones first and is honest about the issues with the more popular ones.

## The cleanest options first

### MIT-0 (MIT No Attribution) — best general-purpose choice

A one-clause variant of the MIT License with the attribution requirement removed. Authored by AWS, OSI-approved (`MIT-0`), short and unambiguous, written specifically for software.

The full text is about 100 words. It says: do whatever you want, no warranty.

- OSI-approved
- Recognised by GitHub's license picker
- No attribution required
- Designed for code, not content
- No known legal-review concerns

This is the safest "no strings attached" choice for new Zapps. If unsure, pick this.

### 0BSD (BSD Zero Clause License) — equally clean alternative

A zero-clause variant of the BSD license. OSI-approved (`0BSD`), used by toybox and a few other notable projects. Very similar in spirit and effect to MIT-0.

- OSI-approved
- Recognised by GitHub's license picker
- No attribution required
- Designed for code

Either MIT-0 or 0BSD is fine. Pick whichever the project's tooling and conventions already lean toward.

### BlueOak-1.0.0 — newer, opinionated alternative

The Blue Oak Model License is a modern, plain-English permissive license written by lawyers experienced in open-source. It's OSI-approved (`BlueOak-1.0.0`) and includes an explicit patent grant. Slightly longer than MIT-0 but easier to read for non-lawyers.

Recommended if the project may include patentable code and explicit patent terms matter.

## The popular options and their caveats

### CC0 — was the obvious choice, but has known issues

Creative Commons Zero is a public-domain dedication. Recognised by SPDX (`CC0-1.0`). Widely used in the creative-content world.

**Caveats for software:**

- Written for general creative works, not specifically for software.
- Contains a patent-rights disclaimer that some lawyers and organisations consider ambiguous or problematic. Fedora removed CC0 from its list of approved licenses for code in 2022 over patent-grant concerns.
- Not OSI-approved as an open-source license (only OSI's broader definitions cover it).

CC0 is fine for assets shipped *with* a Zapp (icons, fonts, sample data). For the code itself, MIT-0 or 0BSD is the safer choice.

### The Unlicense — popular but legally fragile

A short license that explicitly places code in the public domain. Recognised by SPDX (`Unlicense`).

**Caveats:**

- Some lawyers consider The Unlicense poorly drafted compared to MIT-0 or 0BSD, particularly around what jurisdictions actually recognise public-domain dedication.
- "Public domain" is not a well-defined concept in many countries outside the US, which weakens the dedication.
- The drafting style (informal, FAQ-like) makes some corporate legal reviewers uncomfortable.

The Unlicense works in practice — it's used by significant projects — but if a corporate user might want to adopt the code, MIT-0 or 0BSD reads more cleanly to their lawyers.

### MIT — popular and clean, but does require attribution

The standard reflex license. Excellent in most ways: short, OSI-approved, well-understood. But the fine print explicitly requires the copyright notice and permission notice to be included in all copies or substantial portions of the software.

For a serious commercial fork, attribution is fine and arguably good etiquette. For a one-line utility someone copy-pastes into their codebase, the requirement adds friction. If "no attribution required" is the actual goal, MIT is the wrong choice and MIT-0 is the right one.

### Apache 2.0

More elaborate than MIT. Adds explicit patent grants and contributor terms. Stronger legal protection for both creator and user. Still requires attribution. Excellent for serious projects; overkill for a single-page Zapp.

### GPL, AGPL — wrong direction for the goal

Copyleft licenses force derivative works to also be open-source. Strong philosophical statement, but *more* friction for forks, not less. If the goal is "anyone, anywhere, can do anything with this," copyleft is the wrong direction.

## Quick recommendation matrix

| Goal | Recommended |
| --- | --- |
| Default Zapp release, no attribution required | **MIT-0** or **0BSD** |
| Same, but with explicit patent grant | **BlueOak-1.0.0** |
| Public-domain dedication for non-code assets | CC0 |
| Mainstream permissive, attribution required | MIT |
| Mainstream permissive with patent grant | Apache 2.0 |
| Copyleft (force forks to stay open) | GPLv3 (not Zapp-aligned) |

## How to apply

GitHub's "Choose a license" picker supports MIT-0, 0BSD, BlueOak-1.0.0, CC0, and Unlicense as of 2024. Type the name into the search. The picker generates the appropriate `LICENSE` file in the repository root.

For a project created outside GitHub:

- MIT-0 text: search for "MIT No Attribution" or `MIT-0` on the SPDX site.
- 0BSD text: `0BSD` on the SPDX site.
- BlueOak text: blueoakcouncil.org/license/1.0.0.

Place the text in a file named `LICENSE` (no extension) at the repo root.

## Why this matters for Zapps

A Zapp is meant to outlive its maker. The [forking pattern](/wiki/Forking-Over-Modding/) depends on people being legally free to take, modify, and republish without worrying about attribution chains, patent ambiguity, or unclear public-domain semantics.

MIT-0 and 0BSD remove all of those concerns with no real downside. They are the boring, correct answer.

## See also

- [Zapp Manifesto](/wiki/Zapp-Manifesto/)
- [Forking Over Modding](/wiki/Forking-Over-Modding/)
