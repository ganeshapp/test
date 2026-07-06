---
permalink: /wiki/Digital-Paper-Note-Apps/
title: "Digital Paper Note Apps"
date: 2026-05-22
tags: [web, tools, notes]
---

A long-running frustration with digital note-taking is that no app truly replicates the seamless mix of writing, drawing, and arranging that a sheet of physical paper allows. You either get a clean text editor with no real drawing (Obsidian, Notes), a tool with rigid text boxes around a sketch canvas (Google Keep), or an infinite freeform canvas without notebook-style organisation (Excalidraw, Miro).

Below is a survey of the desktop tools that get closest to the paper feel, and the underlying reasons this is a genuinely hard problem.

## Why this is a hard software problem

The mismatch between text and drawing is more fundamental than it looks.

**Linear vs spatial rendering.** Typed text is linear — press Enter and everything below shifts down. Drawing is spatial — strokes are at fixed coordinates. If you type a paragraph and draw an arrow pointing to a specific word, what happens when you add a new sentence? Does the arrow move with the word, or stay put and point to nothing? Apps avoid this conflict by forcing typed text into boxes (a text box on a sketch canvas), which breaks the paper feel.

**File format trade-offs.** Apps like Obsidian use plain Markdown — lightweight, fast, future-proof, and *unable* to store vector drawing data. To combine text and ink natively, an app has to abandon plain text and use a heavy proprietary format or a PDF wrapper, losing the "own your files" property.

**Input modality mismatch.** Keyboards demand linear flow. Mice and styluses want spatial freedom. Designing an interface that switches seamlessly without "modes" is genuinely difficult.

## The closest desktop apps

### Microsoft OneNote

The strongest single answer. OneNote lets you click anywhere to start typing and draw freely over or next to the text without mode-switching. Notebook > Section > Page hierarchy is built in.

By default OneNote uses an infinite canvas, which can feel ungrounded. Fix: View → Paper Size → A4 or Letter. The page becomes a fixed sheet.

### Goodnotes (now on macOS and Windows)

Historically iPad-only, now with native desktop apps. Built explicitly around finite pages and notebooks. Folders, notebooks, and pages mix typing, images, and ink. Typing still uses text boxes, but recent updates have made the transition between modes more fluid.

### Drawboard PDF

Don't be misled by the name — it isn't only for existing PDFs. You can create blank, gridded, or lined notebooks from scratch. Built on a PDF engine, so each page feels physical. Particularly popular among engineers and students.

### Xournal++

Open-source desktop app built specifically for digital paper notes. Finite pages (lined notebook style) where you can type, handwrite, and draw seamlessly. Less aesthetically modern than commercial options, but functionally hits the goal.

### Obsidian + Excalidraw plugin

For users committed to Obsidian, the community-built **Excalidraw plugin** embeds Excalidraw canvases directly inside Obsidian notes. Still suffers from the infinite-canvas issue mentioned above, but for diagram-style insertions it works well. See [Excalidraw as a Drawing Engine](/wiki/Excalidraw-as-a-Drawing-Engine/).

## Comparison

| App | OS | Paper feel | Note organisation | Mode-free text + ink | License / cost |
| --- | --- | --- | --- | --- | --- |
| OneNote | Mac, Win | Good (with paper size set) | Notebook > Section > Page | Yes | Free (with MS account) |
| Goodnotes | Mac, Win | Good | Folders > Notebooks | Mostly (boxes for typing) | Paid |
| Drawboard PDF | Win primarily | Excellent | Folder-based PDF | Yes | Free + paid tiers |
| Xournal++ | Linux, Mac, Win | Good | File-based | Yes | Open source, free |
| Obsidian + Excalidraw | Mac, Win, Linux | Mediocre (infinite canvas) | Markdown files | No (sketches are separate files) | Free |

## Building a custom version

For anyone who wants the experience that doesn't quite exist, [Excalidraw as a Drawing Engine](/wiki/Excalidraw-as-a-Drawing-Engine/) covers how to build a multi-page, finite-canvas note app on top of the Excalidraw React component. It's a non-trivial but tractable project, and the result can be exactly the missing tool: paper-sized pages, sidebar navigation, free text and ink in the same plane, all open-source and self-hostable.

## See also

- [Excalidraw as a Drawing Engine](/wiki/Excalidraw-as-a-Drawing-Engine/)
- [Zapp Manifesto](/wiki/Zapp-Manifesto/)
