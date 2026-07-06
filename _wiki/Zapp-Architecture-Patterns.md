---
permalink: /wiki/Zapp-Architecture-Patterns/
title: "Zapp Architecture Patterns"
date: 2026-05-24
tags: [zapps, architecture]
---

The constraints of the [Zapp philosophy](/wiki/Zapp-Manifesto/) (no maker-owned servers, no account database, no telemetry) rule out the standard Web 2.0 architectures. The patterns below are the recurring engineering techniques that make Zapps possible anyway.

## 1. OAuth Device Flow for third-party access

**Problem:** Some apps need to call third-party services (GitHub, Google Drive, Strava, Spotify) on behalf of the user. The naïve options are both bad:

- **Bundle a maker-owned client secret and a back-end proxy.** Violates the no-server rule, creates the rent loop, and gives the maker visibility into every user request.
- **Ask the user to paste a Personal Access Token (PAT).** Long-lived, broad-scope, hard to revoke, and a huge onboarding wall for non-developer users.

**Better solution: OAuth 2.0 Device Authorisation Grant (RFC 8628), commonly called *Device Flow*.**

Originally designed for TVs and CLI tools that couldn't run a normal OAuth redirect, Device Flow works perfectly for static client-side apps. The flow:

1. The Zapp registers as a public OAuth client with the third-party provider (one-time setup; no secret needed for public clients in Device Flow).
2. When the user clicks "Connect to GitHub" inside the Zapp, the app makes a request to the provider's device-authorisation endpoint.
3. The provider returns a `user_code` and a short `verification_uri`. The Zapp shows them to the user.
4. The user opens the URL on any device, signs in, types the code, and approves the scopes they want to grant.
5. The Zapp polls the token endpoint until the user finishes. It then receives a normal OAuth access token (and usually a refresh token), stored in local storage.

The whole flow runs purely client-side. The maker doesn't need a backend; the third party handles the auth ceremony. The user enters their actual scoped permission set, not a god-mode PAT they had to figure out how to mint.

### Why this beats PAT-pasting

- **No PAT generation maze.** The user clicks one button and signs in normally.
- **Scoped permissions.** The user sees and approves exactly which scopes the app gets.
- **Revocable.** Tokens can be revoked from the provider's account settings without affecting other apps.
- **Refreshable.** Long-lived refresh tokens replace short-lived access tokens automatically.
- **No copy-paste of secrets through clipboard or screenshots.** Less spoofing risk.

### Providers that support Device Flow

- **GitHub** — fully supported
- **Google** (Drive, Calendar, etc.) — supported for installed apps
- **Microsoft** (OneDrive, Graph) — supported
- **Atlassian** — supported
- **Spotify, Twitch, Reddit, Discord** — supported

For providers that don't support Device Flow, PKCE-based OAuth (RFC 7636) is the next best option and also works without a backend. PAT-pasting should be a last resort, used only when neither Device Flow nor PKCE is available.

## 2. The Napkin Pattern (URL state encoding)

**Problem:** Sharing data between users normally requires a database to hold the shared state.

**Solution:** Serialise the app's state to JSON, compress it (LZMA, brotli, or base64), and append it to the URL hash. The receiving client decodes the URL to recreate the exact state locally.

```
app.com/#state=eJyrVkrLzC1WslJQys9LTU8t...
```

**Caveats to be honest about:**

- URLs may be logged by corporate firewalls, ISPs, browser history syncs, or shared-link previews. Treat URL hashes as transmittable, not as private.
- For sensitive payloads, encrypt the state client-side with a password kept *only in the URL fragment* (which never reaches the server). Strong, but the user has to share the password out-of-band.
- URL length limits exist. Most browsers and proxies are fine up to ~2,000–8,000 characters. Beyond that, the pattern stops working and you need file-based sharing.

Best used for calculation tools, charts, configurations — payloads under a few kilobytes.

## 3. The Walkie-Talkie Pattern (P2P networking)

**Problem:** Real-time collaboration (multiplayer games, shared editing, voice/video) normally requires a centralised signalling server.

**Solution:** Treat the network like a walkie-talkie, not a cell phone. Use peer-to-peer transports for the data channel, and either local discovery or public infrastructure for signalling:

- **WebRTC over LAN** — for same-room collaboration, no internet required.
- **Web Bluetooth** — direct device-to-device pairing.
- **Public WebTorrent trackers** — used as a free signalling layer to introduce two peers.
- **Public Nostr relays** — broadcast WebRTC signalling data to find another peer.

**Privacy caveat the original draft missed:** public signalling networks are *public*. Anyone watching a public DHT or Nostr relay can map which peers are talking to which. If a Zapp uses this pattern for anything privacy-sensitive (private messaging, financial discussions), the metadata is visible to passive observers even though the content isn't.

For most uses (a local game, a shared classroom session, a casual sketching board) this isn't a problem. For anything sensitive, P2P over LAN or a self-hosted signalling relay is the right answer.

## 4. Cloud-storage folder sync (the simplest "sync that just works")

**Problem:** Users want their data to follow them across devices without dealing with OAuth or backups.

**Solution:** Save state files into a folder the user has already configured for cloud sync — iCloud Drive, Google Drive, Dropbox, OneDrive. The Zapp doesn't manage the sync; the OS does.

**Why this is often the best Zapp sync option:**

- Free for the user (uses storage they already have).
- No code from the Zapp talks to anyone's API; sync is purely the OS's job.
- Works across desktop platforms cleanly. Mobile is trickier because OS-level file access is more restricted.

This is the underrated default. Many Zapps that go straight to Git-as-Backend would be better served by writing to a cloud-synced folder.

## 5. Git as Backend (heavier, more powerful)

**Problem:** Some users want versioned, structured sync with conflict resolution, and they don't want to depend on a single cloud-storage provider.

**Solution:** Use the user's own GitHub (or GitLab, Codeberg) account as the persistence layer. The Zapp uses OAuth Device Flow to obtain a token, then writes JSON or SQLite state files directly to a private repository via the REST API.

**Implications:**

- Free, versioned, multi-device cloud backup with no developer-side infrastructure.
- The user can browse their data on the provider's web UI, edit it on a desktop git client, or migrate it by cloning the repo.
- Slightly higher friction than OS-folder sync; lower friction than self-hosting.
- Requires the user to have or create a GitHub-class account, but they don't need to know what a PAT is.

Good fit for blogging tools, note-taking, and anything where versioning is genuinely useful. Overkill for a calculator.

## 6. Naked Data (open file formats only)

**Rule:** Internal storage may be optimised (IndexedDB, Hive, SQLite WASM). The *export* must be universal.

Every Zapp should include a one-click export to open, human-readable formats. See [Zapp Data Formats](/wiki/Zapp-Data-Formats/) for recommended formats per data type.

The Zapp should also actively prompt the user to back up periodically — "It's been 7 days, download your data" — because relying on volatile browser storage alone is fragile. Modern iOS Safari clears IndexedDB after seven days of no interaction with the site (ITP), so an app the user opens monthly can quietly lose state.

## 7. Static Hosting Only (with honest limits)

A Zapp web app is a bundle of static files (HTML, CSS, JS, WASM) that any free static host can serve: GitHub Pages, Cloudflare Pages, Netlify free tier. No serverless functions, no databases, no auth providers.

**Honest cost limits:**

- GitHub Pages: 100 GB/month soft bandwidth limit, 1 GB site size, 10 builds/hour. Excessive use triggers manual review.
- Cloudflare Pages: 500 builds/month on free tier, unlimited sites but with bandwidth-abuse policies.
- Netlify: 100 GB/month bandwidth on free tier.

For a popular Zapp, this is enough — most static apps are tiny and cached at edge. For a viral Zapp (millions of users in a week) the host will throttle. The honest answer in that scenario is to fall back to self-hosting on a cheap VPS or to ask users to install the app as a PWA so the static host only serves the initial load.

## 8. Offline-First as a Strict Requirement

A web Zapp must work offline after first load. Implement a service worker that caches the entire app shell and all required assets. If the user lands on the page once, the app must remain usable forever, even if the user later goes offline or the developer takes the site down.

**Things the page-one happy version glossed over:**

- iOS Safari supports service workers but with significant limits (no background sync, push notifications are recent and limited, storage quotas).
- Cache invalidation is genuinely hard. When the developer ships a breaking change to a data format, users on the old service worker can't read new shared payloads. Plan for migration paths.
- "Forever" depends on the browser keeping the cache. Browsers can and do clear it. This is why backup prompts matter.

## Where Zapps cannot reach

For a fuller treatment see [When Zapps are Wrong](/wiki/When-Zapps-are-Wrong/). The summary:

- **Push notifications at scale** — needs server-held device tokens.
- **Search-heavy apps over huge datasets** — can't ship the data to the client.
- **Real-time collaboration at global scale** — public signalling has metadata leaks; private signalling needs a server.
- **Regulated industries** — healthcare, finance, identity verification typically require maker-side logging.

Picking a different architecture honestly for these cases is better than faking the philosophy.

## See also

- [Zapp Manifesto](/wiki/Zapp-Manifesto/)
- [Zapp Data Formats](/wiki/Zapp-Data-Formats/)
- [Zapp Cursor Rules](/wiki/Zapp-Cursor-Rules/)
- [Zapp Anti-Patterns](/wiki/Zapp-Anti-Patterns/)
- [When Zapps are Wrong](/wiki/When-Zapps-are-Wrong/)
- [The Discovery Problem](/wiki/The-Discovery-Problem/)
- [Forking Over Modding](/wiki/Forking-Over-Modding/)
