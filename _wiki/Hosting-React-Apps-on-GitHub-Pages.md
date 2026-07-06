---
permalink: /wiki/Hosting-React-Apps-on-GitHub-Pages/
title: "Hosting React Apps on GitHub Pages"
date: 2026-05-22
tags: [web, github-pages]
---

GitHub Pages serves static files — HTML, CSS, JavaScript, images. It cannot run a backend, but it also cannot run a build step automatically. For projects like Excalidraw or any React/Vue/Svelte app, the raw repository contains source code (JSX, TypeScript) that browsers can't read directly. The code has to be compiled first.

The fix is to use **GitHub Actions** to build the code on every commit, then push the compiled output to GitHub Pages.

## The general pattern

There are two common variants depending on how the upstream project is structured:

### Variant 1: Build to a `gh-pages` branch (older pattern)

Many older React projects use the `gh-pages` npm package or a similar tool. They commit source to `main`/`master`, then publish the built artifacts to a separate `gh-pages` branch. GitHub Pages is configured to serve from that branch.

A typical GitHub Action does:

1. Checkout the source from `main`
2. `npm install` / `yarn install`
3. Run the build (`npm run build` or similar)
4. Push the build output to a `gh-pages` branch

Once the action completes, the user goes to Settings → Pages and sets the **Source** to "Deploy from a branch" → `gh-pages` → `/ (root)`.

### Variant 2: Build and deploy via GitHub Pages Actions (newer pattern)

GitHub Pages now has first-class support for deploying directly from an Action without needing a `gh-pages` branch. The workflow uses `actions/configure-pages`, `actions/upload-pages-artifact`, and `actions/deploy-pages`.

A minimal workflow:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [master]

permissions:
  contents: read
  pages: write
  id-token: write

jobs:
  build-and-deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'

      - name: Install dependencies
        run: yarn install

      - name: Build
        run: yarn build

      - name: Setup GitHub Pages
        uses: actions/configure-pages@v4

      - name: Upload build output
        uses: actions/upload-pages-artifact@v3
        with:
          path: './dist'

      - name: Deploy
        id: deployment
        uses: actions/deploy-pages@v4
```

Adjust `path:` to wherever the framework outputs the build (usually `dist`, `build`, or `excalidraw-app/build` for the Excalidraw repo specifically).

## Common gotchas

### The `homepage` field in `package.json`

Many React projects set a `homepage` URL in `package.json` so paths resolve correctly. If you fork a repo, the original `homepage` will be wrong:

```json
"homepage": "https://originalauthor.github.io/excalidraw/"
```

Change it to:

```json
"homepage": "https://yourusername.github.io/your-repo-name/"
```

Without this, the deployed site often shows a blank page because asset URLs resolve to `/static/...` paths that don't exist on the deployed domain.

### Workflow permissions

By default, GitHub restricts Actions from creating new branches. To allow a `gh-pages` push:

1. Repository Settings → Actions → General
2. Scroll to "Workflow permissions"
3. Switch to "Read and write permissions"
4. Save

### Path to build output

Different frameworks output to different folders:

- Create React App: `build/`
- Vite: `dist/`
- Next.js (static export): `out/`
- Excalidraw: `excalidraw-app/build/`
- Webpack default: `dist/`

If the deploy step fails or shows an empty site, this is almost always why.

## Where it breaks down

GitHub Pages is excellent for static apps. It is not a fit for:

- Apps requiring a backend
- Apps with server-side rendering (use Vercel/Netlify instead)
- Apps using features that require server-side cookies or sessions

For the [Zapp pattern](/wiki/Zapp-Architecture-Patterns/) of fully client-side apps, GitHub Pages is essentially the perfect free host.

## See also

- [Excalidraw as a Drawing Engine](/wiki/Excalidraw-as-a-Drawing-Engine/)
- [Zapp Architecture Patterns](/wiki/Zapp-Architecture-Patterns/)
