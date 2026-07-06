---
permalink: /wiki/Zapp-Manifesto/
title: "Zapp Manifesto"
date: 2026-05-24
tags: [zapps]
---

## The honest framing

A Zapp is a piece of software that trades **convenience for autonomy**.

SaaS is the opposite trade. It hides labor — backups, sync, accounts, discovery, distribution — at the cost of putting the user in a long-term relationship with the maker. That relationship is the price the user pays, even when there is no monthly fee.

A Zapp inverts this: it asks the user to do a little more work themselves (occasional backups, sometimes explicit sync, sometimes manual sharing) in exchange for never having to depend on a maker, an account, an ongoing subscription, or a server that might go away.

Neither model is universally right. SaaS makes sense for some workloads. Zapps make sense for others. The point of this section is to be clear about which is which, and to give the design pattern for the second one a name and a working spec so it can be built deliberately rather than by accident.

## Where the cost moved

For most of the last two decades, the cost structure of running software pushed almost everything toward SaaS:

- Servers cost real money
- Distribution required infrastructure
- Maintenance required ongoing engineering time

Recouping those costs required one of two patterns: advertising and tracking, or subscription rent. These weren't malicious — they were the only way to keep the lights on.

What's changed:

- **Static hosting absorbed most serving costs** for small-to-medium-traffic apps (GitHub Pages, Cloudflare Pages, Netlify free tiers).
- **Client-side databases got serious** (SQLite via WebAssembly, IndexedDB, OPFS).
- **AI tooling reduced the per-feature engineering cost**, even after accounting for subscription costs of the tools themselves.

None of this means cost has gone to zero. Maintenance, security patching, API churn, and bug fixing still cost human time. AI subscriptions cost real money. Static hosts have abuse-policy limits.

But for a class of single-purpose tools where the user's data isn't actually shared with anyone else, the *necessity* of a SaaS architecture is weaker than it used to be. The Zapp pattern is what it looks like to build for that class deliberately.

## What a Zapp actually is

A Zapp is a self-contained tool that runs primarily on the user's device, stores its state locally in open formats, and does not require an account or a server owned by its maker.

Concrete constraints, with the rationale for each:

**Local state in open formats.** The user can export, edit, and import their data without the app. The format should be human-readable wherever practical (JSON, Markdown, SQLite, CSV, GPX, iCalendar). Internal storage can be optimised; the *exit door* must be universal.

*Why:* Without this, every other property of the philosophy collapses. Lock-in is what makes maker-blindness, finishedness, and forkability impossible.

**No required maker-owned server.** A Zapp may *talk* to third-party services the user has authorised, but the maker doesn't run a backend that the app needs to function.

*Why:* Servers create the rent loop. Even free servers create maintenance debt that justifies later monetisation.

**No required account on the maker's side.** Identity, if needed, lives on the user's device or in their own infrastructure (a GitHub account they already have, a cloud-storage folder they already sync). The maker doesn't run a user table.

*Why:* User tables become the asset. Acquisitions and policy changes flow through them. A Zapp avoids creating one in the first place.

**Works offline.** A web Zapp must use a service worker so that after the first load, the app keeps working without network access.

*Why:* Network availability is the silent dependency that turns tools into services.

**No telemetry, analytics, or hidden network calls.** Privacy by structure, not by promise. There is no analytics SDK to misconfigure.

*Why:* The cheapest way to honour a privacy policy is to not have the data in the first place.

**Permissive license.** Default to a public-domain dedication or a one-line attribution-free license so that forks are trivially legal. See [Public Domain Software Licenses](/wiki/Public-Domain-Software-Licenses/).

*Why:* If the maker disappears, anyone should be able to legally continue the project.

## What the user gives up

Honest list. Anyone considering whether to build (or use) a Zapp should know what they are accepting:

- **Sync that just works.** Multi-device sync in a Zapp typically means OS-folder sync (iCloud Drive, Google Drive, Dropbox) or per-user infrastructure (a private GitHub repo via [OAuth Device Flow](/wiki/Zapp-Architecture-Patterns/)). It is rarely as frictionless as Notion or Google Docs.
- **Push notifications.** Reliable mobile push requires a server holding device tokens. A Zapp can't really do this without giving up the no-server property.
- **Real-time collaboration at scale.** Possible via WebRTC and decentralised signalling, but never as smooth as Google Docs.
- **Discovery.** Without ads, SEO budgets, or platform algorithms pushing the app to users, finding the right Zapp is harder. See [The Discovery Problem](/wiki/The-Discovery-Problem/).
- **Convenience defaults.** Things like "your data follows you to the new phone" require explicit setup steps.

If those losses are dealbreakers for the user's actual use case, a Zapp is the wrong choice and that's fine. See [When Zapps are Wrong](/wiki/When-Zapps-are-Wrong/) for the full catalogue of cases where the model doesn't fit.

## What the user gains

Equally honest list:

- **Continuity.** When the maker disappears, the Zapp keeps working. Forks are legal and cheap.
- **Structural privacy.** No data to leak because no data leaves the device.
- **No surprise billing.** The model is set at install, not at the maker's next funding round.
- **No forced relationship.** The user can stop using the Zapp without losing access to their data, because the data was never hostage.

## A simple test

If the question "what happens if the maker disappears tomorrow?" has the answer "the app keeps working and the user keeps their data," it might be a Zapp.

If the answer is "the user is locked out," it's not.

## What Zapps are not

To pre-empt the reductive readings:

- Not minimalism for its own sake. A Zapp can be feature-rich.
- Not anti-payment. A Zapp can be paid once. It just doesn't extract rent.
- Not anti-identity. The user can have an identity; the *maker* just doesn't store it.
- Not anti-sync. A Zapp can sync via the user's own infrastructure.
- Not anti-modern-web. A Zapp uses service workers, WASM, modern browser APIs.

The pattern is specifically about *not creating a maker-side relationship that the user has to maintain.* Everything else is style.

## When this pattern fits

Roughly:

- Single-user tools (calculators, planners, note-takers, journal apps, fitness loggers)
- Reference tools (dictionaries, handbooks, education apps)
- Configuration and design tools where state is mostly local (mockup tools, regex testers, formatters)
- API client wrappers where the actual data lives in someone else's system (Hacker News readers, RSS readers)

## When it doesn't

- Collaboration-heavy products with real-time co-editing
- Workloads dependent on push notifications
- Anything regulated where the operator needs to retain logs (healthcare, finance, identity verification)
- Markets where users genuinely value convenience over autonomy (the majority of mainstream consumer software)

A full list with reasoning is in [When Zapps are Wrong](/wiki/When-Zapps-are-Wrong/).

## See also

- [Zapp Architecture Patterns](/wiki/Zapp-Architecture-Patterns/)
- [Zapp Data Formats](/wiki/Zapp-Data-Formats/)
- [Zapp Anti-Patterns](/wiki/Zapp-Anti-Patterns/)
- [When Zapps are Wrong](/wiki/When-Zapps-are-Wrong/)
- [The Discovery Problem](/wiki/The-Discovery-Problem/)
- [Why Buy Once Software Died](/wiki/Why-Buy-Once-Software-Died/)
- [Forking Over Modding](/wiki/Forking-Over-Modding/)
- [Public Domain Software Licenses](/wiki/Public-Domain-Software-Licenses/)
- [Zapp Cursor Rules](/wiki/Zapp-Cursor-Rules/)
- [Local-First Philosophy](/wiki/Local-First-Philosophy/)
