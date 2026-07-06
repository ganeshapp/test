---
permalink: /wiki/Why-the-Web-Got-Walled/
title: "Why the Web Got Walled"
date: 2026-05-22
tags: [web, history]
---

Most explanations of how the open web became a small set of walled platforms (YouTube, Facebook, Twitter, Reddit) reach for vague villain stories — companies got greedy, algorithms got predatory, attention got commodified. These are downstream symptoms. They miss the actual cause.

The cleanest first-principles explanation:

> **The web changed because the cost structure of participation changed, and someone else had to pay for it.**

Everything else is downstream of that single shift.

## Phase 1: The early web (low cost artifacts, high user burden)

In the 1990s and early 2000s:

- Text was cheap to produce and host
- Hosting was technically possible but painful — FTP, server administration, uptime
- Users were expected to run servers, manage uptime, accept obscurity
- Distribution was open because no one was paying to optimize it
- Protocols (HTTP, RSS, email) worked because costs were low, usage was sparse, and no one needed fine-grained measurement

This world could not scale to non-technical users. That's the part nostalgia for "the open web" ignores. The open web wasn't more inclusive — it was more exclusive, just along a different axis (technical skill rather than algorithmic favor).

## Phase 2: Platforms emerge as cost-absorbing machines

Platforms did one crucial thing: **they absorbed technical complexity on behalf of users.**

- No servers
- No FTP
- No bandwidth management
- No spam handling
- No discovery problem (initially)

This applied even more strongly to video, where storage was expensive, bandwidth was expensive, delivery was hard, and tooling was complex. YouTube didn't "centralize the web." It made participation possible for billions of people who could never have run their own video server.

But this introduced a hard constraint:

> **Someone had to pay for all of it.**

And it was never going to be the users.

## Phase 3: The third party enters and changes the rules

The moment a third party pays (advertisers, sponsors, brands), the system must optimize for them, not for creators or users.

Third parties care about:

- Attention
- Engagement
- Predictability
- Measurability

They do **not** care about:

- Openness
- Portability
- Protocols
- Long-term cultural health

This is the hinge. The third party didn't impose its values aggressively; the platform absorbed them in order to keep accepting their money. Without that money, the platform couldn't keep absorbing complexity for users.

## Why platforms had to close distribution

From the third-party-paying-the-bills hinge, two consequences become inevitable:

**1. Measurement requires capture.** If content can be consumed outside the platform (RSS readers, embed mirrors, third-party clients), engagement becomes invisible. Invisible engagement can't be priced. What can't be priced can't fund infrastructure.

**2. Capture requires closing the boundaries.** If users can engage elsewhere, the platform can't sell that engagement. It becomes a cost center, not a marketplace.

So platforms didn't close because they were evil. They closed because **open protocols are incompatible with the ad-funded model.** That single incompatibility explains:

- Algorithmic feeds (instead of chronological, RSS-style streams)
- Walled gardens
- Hostility to RSS
- Hostility to outbound links
- Hostility to third-party clients (the Twitter / Reddit API debacles)

All of it is downstream of the funding constraint, not of malice.

## Why we can't just "go back"

The constraint most "bring back the open web" essays dodge:

- Expectations are higher (instant UX, mobile, accessibility)
- Participation is broader (billions, not millions)
- Abuse is real (and scales with users)
- Media is heavy (video, image, live audio)
- Uptime is assumed
- Discovery is required

The old web didn't fail morally. It failed **operationally at scale**.

## Why federation only partially helps

Federation (Mastodon, ActivityPub, Matrix) decentralizes hosting and distributes control. But it doesn't solve the funding problem.

Federated networks still need:

- Discovery (how do you find people?)
- Moderation (norms have to be enforced somehow)
- Reliable hosting (someone runs each instance)
- Money to pay for all of the above

Federation recreates openness without solving sustainability. That's why federated networks remain niche even as they're philosophically appealing.

## Why protocols are still the right lever — but a narrow one

Protocols work when:

- Costs are low
- Participation is optional
- Discovery can be slow
- No one needs to measure everything

RSS thrived under those conditions. To revive something RSS-like now, you'd need shared discovery, shared measurement, or a funding model that doesn't depend on attention capture. That's the real unsolved problem.

## The distilled insight

The single-sentence version, as compressed as it gets:

> The web didn't become closed because companies wanted control. It became closed because abstracting complexity for mass participation required money, and money required measurable attention, which in turn required closed distribution.

That explains:

- Why platforms are real enablers (not just villains)
- Why winner-take-all dynamics emerged
- Why innovation stopped compounding across platforms
- Why federation's limits are economic, not just technical
- Why nostalgia for the open web is misleading
- Why "just open the protocol" is naïve

## Where this leaves [Zapps](/wiki/Zapp-Manifesto/)

If the closure of the web was driven by the cost of supporting non-technical users, the underlying logic shifts when those costs collapse. AI dramatically reduces the cost of building tools. Static hosting (GitHub Pages, Cloudflare Pages) reduces the cost of serving them. Browser local storage and WASM databases eliminate the need for cloud databases for many app categories.

What remains is mostly habit. The rent-seeking structures persist even after the cost structures that justified them have changed. Zapps argue that for many tools, this is the right moment to deliberately step out of those structures.

## See also

- [Why Buy Once Software Died](/wiki/Why-Buy-Once-Software-Died/)
- [Zapp Manifesto](/wiki/Zapp-Manifesto/)
- [Local-First Philosophy](/wiki/Local-First-Philosophy/)
