---
permalink: /wiki/Local-First-Philosophy/
title: "Local-First Philosophy"
date: 2026-05-24
tags: [zapps]
---

**Local-first** is a software philosophy popularised by Ink & Switch. The core idea: applications should work primarily on the user's device, with the user's data living locally first and sync being optional rather than required.

It's the closest existing tradition that [Zapps](/wiki/Zapp-Manifesto/) draws from, but the two are not identical.

## The seven ideals of local-first software (Ink & Switch)

The original 2019 essay laid out seven properties of local-first software:

1. **No spinners.** The local copy is the primary copy. The UI responds at local speed, not at network speed.
2. **Your work is not trapped on one device.** Sync to other devices, but as a feature on top of local storage, not a requirement.
3. **The network is optional.** You can keep working when offline. The network only affects sync, not function.
4. **Seamless collaboration with other devices.** When sync happens, conflicts resolve cleanly (CRDTs and similar).
5. **The Long Now.** The software should keep working for decades, regardless of what happens to the original developer.
6. **Security and privacy by default.** Data is end-to-end encrypted or never leaves the device.
7. **You retain ultimate ownership and control.** Open file formats, export options, no hostage data.

## Where Zapps overlap with local-first

Most of it.

- Local storage is the primary storage
- Network is optional
- Open data formats and export
- Software keeps working if the developer disappears
- Privacy by structure, not by promise

## Where Zapps go further

Local-first allows for:

- Sync servers (just not required for the app to function)
- Centralised accounts that hold identity
- Subscriptions and ongoing business relationships
- Telemetry and analytics

Zapps explicitly refuse all of these. The differences:

| Property | Local-First | Zapp |
| --- | --- | --- |
| Local data primary | ✓ | ✓ |
| Works offline | ✓ | ✓ |
| Open formats | ✓ | ✓ |
| Sync allowed | ✓ | Only via user's own infrastructure (Git, OS folders) |
| Accounts allowed | ✓ | ✗ |
| Telemetry allowed | ✓ (rarely) | ✗ |
| Subscriptions allowed | ✓ | ✗ |
| Developer can know users exist | ✓ | ✗ (maker-blind) |

In short: Local-first is an architectural stance. Zapp is also an *ethical* stance about the developer-user relationship.

## Where Zapps stop short of local-first

In one specific way, Zapps are sometimes *less* ambitious:

- Local-first cares deeply about **CRDT-based seamless multi-device collaboration**.
- Most Zapps don't try to solve that, falling back to manual export/import or the [Walkie-Talkie pattern](/wiki/Zapp-Architecture-Patterns/) for occasional real-time sharing.

CRDTs require significant engineering and often a sync server, even if optional. For a single-user calculator or planner Zapp, none of that complexity is justified.

## Adjacent philosophies

A few related traditions worth knowing:

- **Indie / Tiny Software** — Rob Allen, Maggie Appleton, and the "small web" crowd. Emphasises single-purpose tools and human-scale software, but more about vibe than enforced constraints.
- **The Small Web / Personal Web** — Opposes platform domination. Encourages personal sites, RSS, static generators. POSSE (Publish on your Own Site, Syndicate Elsewhere) comes from here.
- **Calm Technology** (Mark Weiser) — Tech that stays in the background, non-invasive. UX-oriented rather than architectural.
- **Unix Philosophy** — "Do one thing well." About composability, not user sovereignty.

None of these alone bundles all the Zapp constraints, but each gets part of it. Zapp can be read as the convergence point of local-first architecture, indie tiny-software ethos, calm UX, and Unix-style minimalism — with the explicit refusal of accounts, telemetry, and rent layered on top.

## See also

- [Zapp Manifesto](/wiki/Zapp-Manifesto/)
- [Zapp Architecture Patterns](/wiki/Zapp-Architecture-Patterns/)
- [When Zapps are Wrong](/wiki/When-Zapps-are-Wrong/)
- [Why Buy Once Software Died](/wiki/Why-Buy-Once-Software-Died/)
- [Why the Web Got Walled](/wiki/Why-the-Web-Got-Walled/)
