---
permalink: /wiki/When-Zapps-are-Wrong/
title: "When Zapps are Wrong"
date: 2026-05-24
tags: [zapps]
---

Knowing where a design pattern fails is part of the pattern. The [Zapp Manifesto](/wiki/Zapp-Manifesto/) frames Zapps as a trade of convenience for autonomy. For some workloads that trade is good. For others it is genuinely bad — the user loses more than they gain, the maker fights the architecture every day, and the result is worse than the SaaS alternative would have been.

This page is the honest catalogue of those cases. The goal isn't to talk anyone out of building a Zapp. It's to make sure the right tool is picked for the right job.

## Workloads that fight the model

### Real-time collaboration at scale

Google Docs, Figma, Notion's multi-user editing, anything that depends on dozens to thousands of users seeing changes within seconds. These workloads need:

- Authoritative server state to resolve conflicts
- A signalling layer that's fast and scales
- Often, CRDT or OT machinery that's coordinated server-side

A Zapp can do two-person collaboration over WebRTC with public signalling. It cannot do team-of-50 real-time editing reliably. Trying to build that as a Zapp produces a fragile, unintuitive product that loses to Google Docs in the first five minutes of a user trial.

**Better fit:** server-backed CRDT (Liveblocks, Yjs with a sync server, or Replicache).

### Reliable push notifications

Real mobile push (especially iOS) requires a server holding device tokens registered with Apple Push Notification service or Firebase Cloud Messaging. The server has to wake the device. There is no client-only way to do this.

If the app's core value is "tell the user something happened while they weren't looking" — a chat app, an order-status tracker, a price alert, a calendar reminder that fires while the app isn't open — Zapps will be worse than the SaaS alternative. The user expects pings; the Zapp can't deliver them.

**Better fit:** server-backed with a normal push pipeline.

### Search-heavy apps over huge datasets

Google Search, Algolia, Elasticsearch use cases. If the data the user wants to search is many gigabytes to terabytes and changes constantly, no static-hosted Zapp can deliver it. Downloading the data is infeasible. Searching it client-side is infeasible.

A Zapp *can* search over data that fits in the browser (a few hundred MB at most, more honestly a few tens of MB for snappy UX). Beyond that the architecture doesn't bend.

**Better fit:** server-backed search.

### Regulated industries

Healthcare records (HIPAA), financial services (PCI, SOC2), identity verification (KYC/AML), education with minors (FERPA/COPPA). These all typically *require* the operator to retain audit logs, control access, support data-subject requests, and prove compliance.

The Zapp posture of "the maker holds no user data" is structurally incompatible with most regulatory frameworks. The regulator wants the operator to hold the data so they can supervise it.

**Better fit:** a regulated SaaS or a self-hosted enterprise product.

### Apps where the data is the social graph

LinkedIn, Twitter, Instagram. The product *is* the network of users. Each user's experience depends on every other user's data being accessible.

A Zapp version is theoretically possible (Nostr, ActivityPub, Scuttlebutt have all tried). In practice the discovery, abuse-handling, and feed-ranking problems are nearly impossible to solve without operators. Federated social networks have repeatedly demonstrated this.

**Better fit:** either a server-backed social product, or accept that federated social will always be a niche.

### Storage-heavy media

Video editing across devices, large-photo collections that need to sync, multi-gigabyte project files. Even with [OS-folder sync](/wiki/Zapp-Architecture-Patterns/) or [Git-as-Backend](/wiki/Zapp-Architecture-Patterns/), the user's storage gets eaten quickly and sync gets slow.

A Zapp pattern works for "edit one video at a time, save the output." It struggles with "manage 50,000 photos across three devices."

**Better fit:** server-backed media library with edge sync.

## User populations that fight the model

### Users who genuinely value convenience over autonomy

This is most consumer software users. They want sync that just works. They want to never think about backups. They want push notifications. They want to install one app and stop worrying.

For these users, the Zapp model is *worse*, not better. Lecturing them about ownership doesn't help; they already prefer the SaaS trade. Building a Zapp aimed at this audience just means building a product they won't adopt.

### Users without a stable cloud identity

The Zapp patterns rely heavily on the user having *some* cloud account they already use: an iCloud / Google Drive / Dropbox folder for sync, a GitHub account for Git-as-Backend, an email address for export delivery.

For users without one of these — first-time smartphone users in emerging markets, older users who use only the apps that came with the phone — the patterns don't bootstrap. The Zapp assumes infrastructure the user doesn't have.

### Users on iOS who need full app capability

Apple's PWA limitations are real:

- Service workers are supported but limited
- Push notifications were added recently and are still less reliable than native
- Storage quotas are smaller than other browsers
- IndexedDB / OPFS can be cleared after seven days of no interaction (ITP)
- Install paths are clunkier than Android

A Zapp aimed at iOS users either accepts these limitations or ships as a native app, which means a $99/year Apple Developer account and App Store review. Both options dent the Zapp's "free, just static files" pitch.

### Enterprise buyers

Enterprise procurement wants SOC2 reports, SLAs, vendor risk assessments, named support contacts, and contractual data-processing agreements. A Zapp's "the maker holds nothing, talks to no one, and may not exist next year" pitch doesn't survive a single procurement meeting. Enterprise is not the Zapp market.

## Operator situations that fight the model

### When the operator needs revenue

A Zapp can be paid once. It can solicit donations. It can be funded as a side project of someone with a day job.

What it *can't* easily be is a primary income source for the maker. The voluntary-donation model historically funds a small minority of even successful open-source projects. If the goal is "this is my full-time job and I need predictable income," the Zapp model is not the right business architecture.

This isn't an indictment. SaaS exists in part because someone has to pay for software development and SaaS is good at that. A maker who needs to be paid full-time for the work is making a fine choice by building SaaS instead.

### When the operator wants telemetry-driven product decisions

Many product teams genuinely improve their software by watching usage analytics. They learn which features matter, which workflows are broken, which onboarding steps lose users. Without telemetry, those signals are nearly impossible to recover.

A Zapp can ship opt-in feedback (a clearly-labelled "send a diagnostic report" button), but that's a self-selecting sample. If the operator's product methodology depends on broad usage data, the Zapp model handicaps them.

### When the operator needs to support users at scale

Customer support is expensive. SaaS amortises it across many users and uses telemetry to triage issues. A Zapp operator without telemetry has to ask the user "what does your data look like?" every time, with no remote diagnostic capability. For free hobby projects this is fine; for anything claiming reliability promises, it's grinding.

## The grey zone: hybrid models

Some products live honestly in the middle. They are mostly Zapp-shaped but have one server-backed feature: optional cloud sync, optional collaboration, optional push.

This is *fine* and probably right for many real products. The honest framing is "this product is a local-first app with an optional paid sync service" — see Obsidian Sync, Excalidraw+, Standard Notes' encrypted sync, Bear's iCloud-backed sync.

These products are not pure Zapps but they preserve most of the Zapp guarantees: data is local in open formats, the core app works without the cloud feature, the user can leave any time. They are good examples of how to take the Zapp pattern and selectively soften it for real markets.

A rule of thumb for the hybrid case: if the user opts out of the cloud feature, does the core app still work and is the user's data still recoverable? If yes, the soft hybrid is honest. If no, it's a SaaS with a Zapp marketing page.

## The honest summary

Zapps are right when:

- The user is technical-enough to handle some setup friction
- The data is single-user or small-group
- Real-time and push aren't core to the value
- Regulation doesn't require operator-held logs
- The maker doesn't need full-time income from this specific product

Zapps are wrong when those don't hold. Picking the wrong architecture for the wrong workload makes both worse. Better to build SaaS deliberately for SaaS-shaped problems than to ship a half-baked Zapp that loses to a competitor's properly-built SaaS in week one.

## See also

- [Zapp Manifesto](/wiki/Zapp-Manifesto/)
- [Zapp Anti-Patterns](/wiki/Zapp-Anti-Patterns/)
- [The Discovery Problem](/wiki/The-Discovery-Problem/)
- [Zapp Architecture Patterns](/wiki/Zapp-Architecture-Patterns/)
