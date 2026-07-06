---
permalink: /wiki/Zapp-Anti-Patterns/
title: "Zapp Anti-Patterns"
date: 2026-05-24
tags: [zapps]
---

The [Zapp philosophy](/wiki/Zapp-Manifesto/) gives a clear set of constraints. The constraints suggest one set of solutions, but they also suggest a set of *attractive-looking solutions that violate the philosophy in subtle ways*. These are the anti-patterns — things that look like Zapps from the outside but quietly recreate the SaaS relationship inside.

A page calling them out exists because most builders trip over these in good faith. The temptation is real: a small backend "just to make sync work," a tiny telemetry "just to know if anyone uses it," an account "just so people can recover their data." Each is reasonable on its own and each is the start of the drift back to SaaS.

## 1. The "tiny helper backend"

**The pattern:** "It's still client-first, but we have a tiny backend to proxy API calls / hide secrets / generate short links / send notifications."

**Why it's an anti-pattern:** The tiny backend becomes the thing that has to stay up. Its uptime is now the maker's problem, then a cost, then a justification for monetisation. The relationship the Zapp tried to avoid has re-formed around the helper.

**The honest test:** if the maker stops paying the helper's hosting bill tomorrow, does the Zapp still work? If no, it's a service in Zapp clothing.

**The honest fix:** Either accept that this is a service and stop calling it a Zapp, or move the helper's job to the user's own infrastructure (OAuth Device Flow against the actual provider, OS-folder sync, the user's own GitHub).

## 2. "Privacy-first" telemetry

**The pattern:** "We only send anonymised aggregate usage data so we can improve the product."

**Why it's an anti-pattern:** Two reasons. First, anonymisation is leakier than developers think — even small amounts of metadata (timezone, screen size, language, browser fingerprint) re-identify users readily. Second, even truly anonymous telemetry requires a maker-owned ingestion endpoint that has to stay up, which is the [tiny backend](/wiki/Zapp-Anti-Patterns/#1-the-tiny-helper-backend) anti-pattern in disguise.

**The honest test:** does the app make any network call to a maker-controlled domain after first load? If yes, that's telemetry, no matter what the payload says.

**The honest fix:** Drop telemetry entirely. If product feedback matters, ship an explicit, opt-in "send a bug report" feature that the user has to click — and ideally implement it as "open the user's email client with a pre-filled message," not as an API call.

## 3. "Optional account for sync"

**The pattern:** "The Zapp works without an account. But if you want sync, sign in with email / Google / Apple."

**Why it's an anti-pattern:** As soon as the maker holds a user table — even a small one, even for an optional feature — the relationship has reformed. The user table becomes the asset. Acquisitions, policy changes, and rent-extraction futures flow through it.

**The honest fix:** Sync via the user's own infrastructure: OS-folder sync, OAuth Device Flow to GitHub, WebRTC over LAN. The maker never holds a user account. See the patterns in [Zapp Architecture Patterns](/wiki/Zapp-Architecture-Patterns/).

## 4. "Local-first" with mandatory cloud bootstrapping

**The pattern:** The app stores data locally, but the first launch requires fetching config from the maker's server. Or requires a license-check ping. Or downloads templates from a maker-owned CDN.

**Why it's an anti-pattern:** The Zapp now has a single point of failure outside the user's control. When the maker disappears, the first-launch flow breaks even though the local data is intact. Users on a new device can't even start.

**The honest fix:** Bundle everything needed for a fresh install into the static deploy. If templates and config evolve over time, treat the bundled version as a stable baseline; let the user *optionally* fetch updates, but never block on them.

## 5. Mandatory updates and "auto-update or be broken"

**The pattern:** The app constantly forces the user to update to the latest version. Old versions stop working because the data format changed, or because the API the app talks to was bumped.

**Why it's an anti-pattern:** "Works forever after install" is a load-bearing promise of the Zapp philosophy. Forced updates break it. Worse, when the maker abandons the project, abandoned users are stuck on a version they can no longer update.

**The honest fix:** Use append-only data-format evolution. Old apps should read new files (forward compatibility) wherever possible. When breaking changes are unavoidable, ship a migration tool that converts the old format to the new format locally, and let the user run it on their own schedule.

## 6. Tight coupling to a single OAuth provider

**The pattern:** "Sign in with GitHub" is the only auth method. The Zapp uses [OAuth Device Flow](/wiki/Zapp-Architecture-Patterns/), which is correct, but the user is now dependent on a single third-party provider for everything.

**Why it's an anti-pattern:** It centralises on whoever the provider is. If GitHub bans the user's account, they lose hosting, sync, identity, and access — even though the Zapp itself is fine.

**The honest fix:** Where possible, support multiple providers (GitHub *or* GitLab *or* Codeberg; Google Drive *or* Dropbox *or* OneDrive *or* iCloud). Make the provider a user choice, not a hard-coded dependency. For storage, OS-folder sync sidesteps the issue entirely because the user's OS handles which provider to use.

## 7. The maker's email address as recovery channel

**The pattern:** "Lost your data? Email us and we'll help you recover it." Or "Stuck? Open a support ticket."

**Why it's an anti-pattern:** It creates a hidden support contract. The maker is now the user's recovery vendor. When the maker stops responding (or stops existing), the user has lost the only path they were taught to use.

**The honest fix:** Document the data format publicly. Show the user, in the app, where their data is stored and how to recover it from a backup. Make the recovery process not depend on the maker being reachable.

## 8. "Pro features" gated behind a license server

**The pattern:** The Zapp is free; some advanced features require a paid license. A small server validates the license key on launch.

**Why it's an anti-pattern:** This is the [tiny backend](/wiki/Zapp-Anti-Patterns/#1-the-tiny-helper-backend) one more time, dressed as monetisation. The license server is now a permanent dependency.

**The honest fix:** If monetisation matters, pick one of:

- **Pay-once, no licensing.** Just sell the app on Gumroad or Itch. The buyer downloads the unencumbered binary. Trust people.
- **Hard fork model.** The free version is one repo; the paid version is a private repo that the buyer gets access to. No runtime check.
- **Don't monetise.** Most Zapps that exist aren't worth a paid tier and trying to add one is a distraction.

## 9. Required browser extensions or native bridges

**The pattern:** The web Zapp depends on an extension or a native helper installed alongside it for "full functionality."

**Why it's an anti-pattern:** Browser extensions get banned, deprecated, or fail to update. Native bridges create a second distribution problem and a per-platform maintenance load. Both undermine the "single static deploy that works forever" property.

**The honest fix:** Use only what the browser ships with. The Web Bluetooth API, Web USB, Web NFC, File System Access API, and Web Serial cover most "needs hardware" cases without an extension. When the browser support is genuinely missing, document the gap rather than papering over it.

## 10. URL state without expiration thinking

**The pattern:** Use the [Napkin pattern](/wiki/Zapp-Architecture-Patterns/) to encode state into a URL. Send the URL via email or chat. Assume it works forever.

**Why it's an anti-pattern:** URL state is a payload at a specific schema version. If the Zapp's data format evolves, old URLs may fail to load or load incorrectly. Worse, URLs leak through corporate logging, browser history sync, and link previews — the privacy implications are real even though the data is technically client-side.

**The honest fix:** Version the URL payload (`#v=2;state=...`) and keep the decoder backward-compatible. For sensitive data, encrypt with a password kept *only* in the URL fragment, and warn the user that the URL itself may be logged.

## 11. "Zapps are pure; SaaS is corrupt" framing

**The pattern:** Pitching Zapps as morally superior to SaaS rather than as a different trade-off.

**Why it's an anti-pattern:** It's wrong, and it makes the philosophy easy to dismiss. SaaS exists for real reasons. Users genuinely value the convenience SaaS provides. Most mainstream consumer software *should* be SaaS because the alternative would impose too much labour on its users.

**The honest fix:** Frame the trade-off as [autonomy vs convenience](/wiki/Zapp-Manifesto/). Zapps are right for some workloads and wrong for others. The honest answer to "should I build a Zapp?" is "only if the workload genuinely fits the trade-off."

## 12. Pretending discovery doesn't matter

**The pattern:** Build a beautiful Zapp, publish on GitHub Pages, expect users to find it organically.

**Why it's an anti-pattern:** Without ads, SEO budgets, or platform algorithms, organic discovery is brutal. Most Zapps die in obscurity not because they're bad but because nobody hears about them.

**The honest fix:** Take [The Discovery Problem](/wiki/The-Discovery-Problem/) seriously. Cultivate a small audience around the work itself (a blog, a newsletter, a presence in relevant communities). Don't expect the philosophy to do the marketing work that the philosophy specifically refuses to do.

## See also

- [Zapp Manifesto](/wiki/Zapp-Manifesto/)
- [When Zapps are Wrong](/wiki/When-Zapps-are-Wrong/)
- [The Discovery Problem](/wiki/The-Discovery-Problem/)
- [Zapp Architecture Patterns](/wiki/Zapp-Architecture-Patterns/)
- [Forking Over Modding](/wiki/Forking-Over-Modding/)
