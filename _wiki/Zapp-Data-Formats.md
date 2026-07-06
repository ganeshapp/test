---
permalink: /wiki/Zapp-Data-Formats/
title: "Zapp Data Formats"
date: 2026-05-24
tags: [zapps, data-formats]
---

A core rule of the [Zapp philosophy](/wiki/Zapp-Manifesto/) is **Zero Lock-In**: the user must be able to export their data into open, human-readable formats at any time. Internal storage may be optimized for speed (IndexedDB, Hive, SQLite WASM), but the *exit door* must be universal.

Below is a categorised reference of open formats a Zapp ecosystem can share, plus when to use each.

## General state and structured data

The bread and butter for app state, preferences, and saved configurations.

- **JSON (`.json`)** — The default for almost everything. Every language and platform parses it. Use for app preferences, flashcard decks, saved configurations, exported records.
- **CSV / TSV (`.csv`, `.tsv`)** — Universal tabular format. Anything that's a table of records (expense tracker exports, habit tracker history, etc.) should export to CSV so users can open it in Excel, Google Sheets, or a Python script.
- **YAML / TOML (`.yaml`, `.toml`)** — Human-readable configuration formats, often used for app settings or Markdown frontmatter.

## Databases and complex queries

When JSON gets too slow or memory-heavy for large local datasets.

- **SQLite (`.sqlite`, `.db`)** — The ultimate local database. With WebAssembly, browsers can now run full SQLite databases entirely client-side. The user can also download the file and query it on their desktop with any SQLite client.
- **DuckDB** — Newer, very fast analytical database that also runs in the browser via WASM. Excellent for Zapps doing heavy data crunching or pivot tables.

A note on internal-only formats: Hive (for Flutter) is fast but binary and Flutter-specific. Use it for performance internally, but always provide a 1-click export to JSON or SQLite for portability.

## Knowledge, writing, and documents

For note-taking, blogging, task management.

- **Markdown (`.md`)** — The standard for text content. Future-proof because even if every app dies, raw Markdown is human-readable.
- **OPML (`.opml`)** — XML format for outlines. The standard for exporting/importing RSS feed lists, mind maps, and nested hierarchies.
- **EPUB (`.epub`)** — Open e-book standard. Under the hood it's a zip of HTML, CSS, and images. Good fit for Zapps that compile reading material.

## Location, health, and fitness

For route data, workouts, and physical tracking.

- **GPX (`.gpx`)** — Universal XML for GPS tracks, routes, and waypoints. Almost any fitness platform reads and writes GPX.
- **TCX (`.tcx`)** — Training Center XML. Better than GPX for workout data because it natively supports heart rate, cadence, and power. Most fitness apps accept both.
- **FIT (`.fit`)** — Garmin's binary format, smaller than TCX but requires a library to read/write. Worth supporting alongside TCX for Strava uploads.
- **GeoJSON (`.geojson`)** — Geographic features in JSON. Unbeatable for web-map apps because browsers and map libraries parse it instantly.

See [Indoor Virtual Run Data Sources](/wiki/Indoor-Virtual-Run-Data-Sources/) for how to source GPX route data for treadmill / smart-trainer apps.

## Personal information management

- **iCalendar (`.ics`)** — Global standard for calendar events. A scheduling Zapp can generate an `.ics` file that imports straight into Apple Calendar, Google Calendar, or Outlook.
- **vCard (`.vcf`)** — Standard for electronic business cards and contacts.

## Graphics and media

- **SVG (`.svg`)** — Scalable Vector Graphics. Because it's text-based XML, a Zapp can generate and manipulate SVGs mathematically without heavy image libraries.

## The export-by-default rule

A useful rule to add to any Zapp design checklist:

> Internal storage can be optimized. The export must be universal.

If a Zapp uses Hive or IndexedDB internally for performance, it must still expose a 1-click export to JSON (or a more specific open format) so users can move their data elsewhere. A Zapp ecosystem becomes truly useful only when data flows freely between apps — drag the JSON out of one and drop it into another.

## A loose mapping of data type to format

| Data type | Default format | When to upgrade |
| --- | --- | --- |
| App preferences | JSON | TOML if shared with humans |
| Tabular records | CSV | SQLite for large queryable data |
| Notes / writing | Markdown | OPML for outlines, EPUB for compiled reads |
| GPS routes | GPX | TCX/FIT for workouts with biometrics |
| Calendar events | iCalendar | — |
| Contacts | vCard | — |
| Graphics | SVG | — |
| Configuration | JSON / YAML | TOML for human-edited files |

## See also

- [Zapp Manifesto](/wiki/Zapp-Manifesto/)
- [Zapp Architecture Patterns](/wiki/Zapp-Architecture-Patterns/)
- [Zapp Anti-Patterns](/wiki/Zapp-Anti-Patterns/)
- [Indoor Virtual Run Data Sources](/wiki/Indoor-Virtual-Run-Data-Sources/)
