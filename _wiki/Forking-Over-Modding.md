---
permalink: /wiki/Forking-Over-Modding/
title: "Forking Over Modding"
date: 2026-05-24
tags: [zapps]
---

Should a [Zapp](/wiki/Zapp-Manifesto/) support mods — user-installable extensions that change or add features? Many traditional games (Age of Empires, Skyrim, 0 A.D.) and software products (VS Code, Figma) generate enormous community value through their mod ecosystems. It's natural to ask whether Zapps should do the same.

The honest answer: **no, in most cases. Design for forkability instead.**

## The three tiers of modding (and their costs)

If a Zapp were to support modding, there would be three viable levels:

### 1. Cosmetic modding (CSS injection)

The simplest. The settings screen exposes a CSS textbox. The app injects the user's CSS into a `<style>` tag on load. Users can build dark modes, retro themes, layout tweaks, and share them as GitHub gists.

Low risk, low maintenance burden, real user value. This level is probably worth supporting in most web Zapps.

### 2. Data-driven modding (JSON overrides)

Like Age of Empires civilization mods. The Zapp ships with a `default.json` containing configurations, categories, rules, language strings. The settings screen lets users upload a `mod.json` (or point to a raw GitHub URL). The app merges the user's JSON over the defaults.

A poker training Zapp could have a `mod_no_limit_holdem.json` that changes betting rules. An expense tracker could load `corporate_tax_codes.json` for region-specific categories. Risk is still relatively low — bad data only breaks the user's own session.

### 3. Logic modding (JavaScript or WebAssembly plugins)

The dangerous tier. Users load custom code that extends app behavior. Risk: a malicious mod can read the user's OAuth tokens or other secrets from `localStorage` and exfiltrate them to a hacker's server.

Solving this safely requires running mod code in **Web Workers or sandboxed iframes** with no access to the main DOM or localStorage. The core app passes data into the worker via a strict message API and reads back results, never giving the mod direct access to sensitive state.

Building a truly safe plugin system is a massive engineering project (the kind VS Code and Figma have whole teams maintaining). It contradicts the lightweight nature of a Zapp.

## The forking alternative

In the SaaS world, forking is a nightmare for users. To run a forked SaaS app, someone has to set up Node, Postgres, S3, environment variables, and DNS. Almost nobody does it.

In the Zapp world, the infrastructure barrier is zero. A Zapp is just static files. Anyone can:

1. Click "Fork" on the GitHub repo
2. Enable GitHub Pages
3. Have a fully working, fully customised version live on the internet in 60 seconds

This means the most natural answer to "I want this feature different" is to fork the code, change one config file, and republish — exactly what mods are for, but with no plugin API to maintain and no security model to worry about.

## The design for forkability principle

To make forking the path of least resistance, write the code so that the parts most people want to change are obvious and isolated:

- Keep all configurable defaults in a single `config.js` / `constants.dart` file.
- Keep all theme tokens in one file (see [Personal App Design System](/wiki/Personal-App-Design-System/)).
- Keep all language strings in JSON files separate from logic.
- Don't bury feature flags inside multiple components — make them top-level.

When the design is forkable, the "Crypto Tracker" version of an expense tracker is just "fork → edit `config.js` → push." No plugin SDK required.

## What you give up

The trade-off is real. With forks instead of plugins:

- Users can't share a single mod that works across versions.
- There's no central "mod marketplace" to browse.
- Each fork is its own project, with its own maintenance burden.

For a single creator shipping many small Zapps, this is acceptable. For a single product targeting millions of users with deep customization needs, a real plugin system might still make sense — but then you're no longer building a Zapp.

## A note on licenses

For forkability to work legally, the original code needs a permissive license. The MIT License technically requires preserving the copyright notice in every copy, which is a small but real friction point. The legally cleanest "no strings attached" choices are **MIT-0** or **0BSD**, both of which are OSI-approved and designed specifically for software — see [Public Domain Software Licenses](/wiki/Public-Domain-Software-Licenses/).

## See also

- [Zapp Manifesto](/wiki/Zapp-Manifesto/)
- [Zapp Architecture Patterns](/wiki/Zapp-Architecture-Patterns/)
- [Zapp Anti-Patterns](/wiki/Zapp-Anti-Patterns/)
- [Public Domain Software Licenses](/wiki/Public-Domain-Software-Licenses/)
