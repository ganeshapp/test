---
permalink: /wiki/Excalidraw-as-a-Drawing-Engine/
title: "Excalidraw as a Drawing Engine"
date: 2026-05-22
tags: [web, tools]
---

Excalidraw is a free, open-source whiteboard / sketching app distinguished by its hand-drawn aesthetic. Beyond using it as a finished product, the same React component is usable as a *drawing engine* inside other apps — meaning you can build entirely new note-taking, diagramming, or design tools around it without writing the drawing logic yourself.

## The basics

- **License:** MIT — fully permissive, commercial use allowed.
- **Repository:** github.com/excalidraw/excalidraw
- **Built with:** React + TypeScript.
- **Renderer:** Canvas-based with rough.js (which produces the hand-drawn look).

Because the code is open and the license is permissive, anyone can fork it, modify it, embed it, and ship it.

## The official component

Excalidraw publishes its core as an installable React package (`@excalidraw/excalidraw`). Anyone building a React app can:

```jsx
import { Excalidraw } from "@excalidraw/excalidraw";

function App() {
  return (
    <div style={{ height: "100vh" }}>
      <Excalidraw />
    </div>
  );
}
```

That's a fully functional whiteboard inside any React app. The component exposes an `excalidrawAPI` object via callback, which lets the wrapper app:

- Read the current scene (`getSceneElements()`)
- Update the scene (`updateScene({ elements: newData })`)
- Trigger zoom/scroll programmatically
- Listen for change events

This is what makes Excalidraw a building block, not just a product.

## Building a multi-page notebook on top

The native Excalidraw is single-canvas with infinite pan. To turn it into something more like a multi-page notebook (the way PowerPoint or OneNote feel):

### 1. State manager wrapping the canvas

Build a wrapper React component that holds an array of "pages" in state. Each page object has an ID, a title, and the raw Excalidraw JSON (elements + appState).

### 2. Sidebar UI for pages

Render a left sidebar listing the pages. When the user clicks "Page 2," the wrapper:

- Saves the current canvas data to "Page 1" in state via `getSceneElements()`
- Loads "Page 2" via `updateScene({ elements: page2Data })`

To the user, it feels like flipping a page.

A reference implementation exists at `MontejoJorge/excalidraw-multi-tabs` (uses tabs instead of a sidebar, but the swap logic is the same).

### 3. Finite (paper-sized) canvas

The native canvas is infinite. There are two ways to make it feel finite:

**Soft limit (easy):** Programmatically insert a locked, fixed-size rectangle (e.g. A4 dimensions) at the centre of every page. Use CSS to dim the background outside that rectangle, creating a visual "desk" around the page. The user can still technically pan beyond it, but the page boundary is visually clear.

**Hard limit (harder):** Modify the Excalidraw source's `appState.scrollX` and `scrollY` clamping logic. Find the camera-control code and add a clamp that prevents `scrollX/Y` from exceeding the page's width/height. Locks the camera to page boundaries.

The soft limit is enough for most use cases and avoids forking the core engine.

## Limitations when self-hosted

Excalidraw's online product has features that depend on backend servers:

- **Live collaboration** — needs a WebSocket signalling server
- **Shareable links** — needs a content-addressable storage backend

If you self-host on GitHub Pages (see [Hosting React Apps on GitHub Pages](/wiki/Hosting-React-Apps-on-GitHub-Pages/)), the drawing experience works fully, drawings save to browser local storage, but collaboration and shareable links will fail. That's an acceptable trade-off for most personal/note-taking use cases.

## The drawn-feel inheritance

The defining aesthetic — hand-drawn shapes, slightly imperfect lines — comes from **rough.js**, a separate small library Excalidraw uses internally. If you want the same look in your own app without the full Excalidraw component, just use rough.js directly. It's tiny and self-contained.

## A natural fit for Zapps

Excalidraw is itself essentially a [Zapp](/wiki/Zapp-Manifesto/): client-side, browser local storage, no accounts required, open source. The shareable-link feature is the one part that strays from the pattern (it uses Excalidraw's servers), but everything else fits the philosophy perfectly. Forking and self-hosting on GitHub Pages produces an even purer Zapp version.

## See also

- [Digital Paper Note Apps](/wiki/Digital-Paper-Note-Apps/)
- [Hosting React Apps on GitHub Pages](/wiki/Hosting-React-Apps-on-GitHub-Pages/)
- [Zapp Manifesto](/wiki/Zapp-Manifesto/)
