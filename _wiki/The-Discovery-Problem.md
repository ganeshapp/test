---
permalink: /wiki/The-Discovery-Problem/
title: "The Discovery Problem"
date: 2026-05-24
tags: [zapps]
---

The [Zapp philosophy](/wiki/Zapp-Manifesto/) has a hole at its centre that the rest of the documentation politely avoids: **how does anyone find a Zapp in the first place?**

This page exists to admit the hole and to be honest about what does and doesn't work, rather than to pretend the philosophy has solved a problem it has not.

## Why this is hard

The mechanisms that make SaaS products discoverable are precisely the mechanisms Zapps refuse to use:

- **Paid acquisition** (Google Ads, Meta Ads, sponsored content) requires ongoing revenue, which is exactly what the Zapp model declines to generate.
- **SEO at scale** depends on backlinks, content marketing teams, and frequent updates — the kind of marketing apparatus that needs full-time staff funded by recurring revenue.
- **App-store rankings** are gameable in ways that favour apps with growth teams and feedback loops driven by telemetry.
- **Social-platform algorithms** boost content that creates engagement, which is a different objective from "tool that respects the user's attention."
- **Word of mouth on Twitter / LinkedIn** still concentrates around founders who post about their startups full-time.

Each of those works because someone is funding the discovery work. A pure Zapp does not have a someone funding anything ongoing. The same austerity that makes the philosophy clean also makes its products invisible.

This is the same dynamic that [Why the Web Got Walled](/wiki/Why-the-Web-Got-Walled/) identifies — the open web's discovery problem is what made platforms necessary in the first place. The Zapp section doesn't get to escape it just because we wrote a manifesto.

## What partly works

A few patterns produce *some* discovery for *some* Zapps. None of them scale to a mass-market product.

### Author cultivation

A maker who builds an audience around their *work in general* (not around any single Zapp) gets compounding distribution. Subsequent Zapps benefit from prior reputation. This is how Drew DeVault's projects spread, how Maggie Appleton's note-tools spread, how a long-running personal blog seeds future product launches.

The catch: this takes years and requires the maker to invest in writing, talks, or content of some kind. The act of building the audience looks suspiciously like marketing, which the philosophy was supposed to free people from.

### Linking from existing well-known content

A Zapp embedded inside an existing trusted artefact gets distribution. Excalidraw rode on Obsidian via the plugin ecosystem. Static-site themes spread from popular static-site generators. Hangouts on a Hacker News front page or a popular Substack newsletter produce a few weeks of organic traffic and a small permanent userbase.

This is real but it's chance distribution. It rewards good timing and good copy more than good code.

### Open-source ecosystems

A Zapp that's also a useful library or component shows up in dependency lists. Other developers discover it. Some of those developers ship Zapps that use it, and so on. Excalidraw, Tldraw, and rough.js all benefit from being usable as components in other projects, not just as standalone apps.

This produces distribution among developers. It does not produce distribution among end users.

### Niche communities

A Zapp built for a tight community (one specific hobby, one specific profession, one specific language-learning workflow) can reach saturation inside that community even without broad distribution. A poker-training Zapp for a serious-amateur subreddit, a Korean-language flashcard Zapp for /r/Korean readers — these can be successful by the metric "all the serious users in this community use it" without ever being broadly known.

This is probably the most realistic distribution pattern for the median Zapp.

### Aggregator sites

A few catalogues exist: "directory of local-first apps," "indie hacker projects," "small web links," "lite tools." They produce a steady trickle of discovery for entries on them. The trickle is small but not zero.

GitHub stars also serve as a weak discovery signal among developers.

### Search for the specific problem

A surprising fraction of users find a Zapp because they Google a very specific need ("offline pomodoro timer no signup") and the Zapp's GitHub README happens to rank. This requires the Zapp to have:

- A clear, problem-statement-first README
- Either a custom domain or a non-trivial GitHub Pages presence
- Some backlinks (which usually means at least one post on Hacker News or Reddit when the project launched)

For specific-keyword search this works. For generic categories ("note-taking app") it doesn't, because the big SaaS competitors have outranked everyone for those terms.

## What doesn't work

Things makers reach for that don't move the needle:

- **Just shipping it on GitHub Pages.** Pure invisibility. Nobody finds GitHub repos by browsing the web.
- **One Hacker News submission.** Produces a 24-hour spike and then nothing. Without follow-on community building, the users acquired don't stay informed about updates.
- **Twitter announcements without an existing follower base.** Empty noise.
- **Product Hunt launches.** Skewed heavily toward SaaS; voting and feedback dynamics favour growth teams.
- **Asking the philosophy to do the work.** "It's a Zapp" doesn't make users care.

## The honest framing

Discovery is the single biggest reason most Zapps die in obscurity. It's also the reason the SaaS world dominates by default. There is no clever architectural fix for it inside the Zapp model — the moment you have a discovery engine, you have something that costs money, requires ongoing maker attention, or both.

The realistic options for someone shipping a Zapp:

1. **Accept obscurity** for the Zapp and treat it as a tool the maker themselves uses, plus a few friends, plus whoever happens to find it. Many of the best Zapps in the wild were built this way.
2. **Build an audience first** through writing, teaching, talks, or a long-running blog. Then announce Zapps to that audience. This is slow but reliable.
3. **Target a tight community** where the Zapp can become the obvious choice for a few hundred to a few thousand serious users.
4. **Ship the Zapp and also a non-Zapp distribution channel** — write a long-form blog post explaining the design, get it in front of a niche audience, accept that the post is doing what telemetry would do in a SaaS world.

None of these solves discovery in the way platform algorithms solve it for SaaS. They are partial answers to a problem with no clean solution.

## What this means for the philosophy

A philosophy that doesn't have an answer to its own central practical problem isn't necessarily wrong — sometimes the right answer is "this is hard and there is no shortcut." But pretending the problem doesn't exist makes the philosophy easier to dismiss.

The honest framing is: **Zapps are a good architecture for a class of software but a poor go-to-market.** If the maker cares about reach, the Zapp pattern asks them to do extra work outside the codebase to make up for the discovery the architecture refuses to perform.

If reach isn't the goal — if the maker is building something they themselves want, and would be fine with a few hundred users — then the discovery problem is not a problem at all. Most actually-shipped Zapps live in this happy quiet zone.

## See also

- [Zapp Manifesto](/wiki/Zapp-Manifesto/)
- [Zapp Anti-Patterns](/wiki/Zapp-Anti-Patterns/)
- [When Zapps are Wrong](/wiki/When-Zapps-are-Wrong/)
- [Why the Web Got Walled](/wiki/Why-the-Web-Got-Walled/)
- [Forking Over Modding](/wiki/Forking-Over-Modding/)
