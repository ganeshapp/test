# gapp.in

A minimal, hand-rolled Jekyll theme combining the blog, wiki, essays, projects, albums and now page into one site. No theme dependency, no framework — vanilla CSS and JS.

## Structure

```
_posts/       blog posts (URL: /blog/<slug>/)
_essays/      timeless writing (URL: /essays/<slug>/)
_projects/    portfolio entries (URL from `permalink` in front matter)
_wiki/        the wiki, one flat folder — digital-garden style (URL: /wiki/<Page-Name>/)
assets/albums/  photo albums (auto-scanned, see below)
now.md        the /now/ page
_plugins/     albums generator + baseurl link rewriter (run by GitHub Actions)
```

## Features

- Dark mode by default, light toggle (persisted in localStorage)
- Site-wide search: press `/` or click the magnifier (index built at compile time into `search.json`)
- Hover previews on every internal link (300 ms delay, fetched once, cached)
- Lightbox on album photos (arrow keys / swipe)
- RSS feed for blog posts at `/feed.xml`
- Fully responsive; album and project grids collapse to one column on phones

## Writing

**Blog post:** drop `YYYY-MM-DD-slug.md` in `_posts/` with `title:` and `date:` front matter.

**Wiki page:** drop a `.md` file straight into `_wiki/` — no folders, no filing decisions. Use normal markdown links (not `[[wikilinks]]`). Front matter needs `title:` and a `permalink:` like `/wiki/Page-Name/` (dashes for spaces). Topic hub pages (Running, Living in Korea, etc.) are just ordinary wiki pages with curated link lists; the start page at `wiki/index.md` links to the hubs. People navigate by hopping links or searching.

**Album (remote — the normal way):** push a folder to the `ganeshapp/album` repo, e.g. `jeju_2026/`:
- `0.jpg` (or `.png` etc.) — the cover image shown on the /albums/ grid
- `album.md` — plain text blurb, no front matter needed
- any other images — shown in the album's photo grid

Folder name becomes the title (`jeju_2026` → "Jeju 2026"). At build time this site lists that repo and serves the photos through jsDelivr's free CDN, pinned to the latest commit SHA — so photos never count against GitHub Pages storage or bandwidth limits. The site rebuilds daily (cron in `deploy.yml`), so a new album shows up within a day, or immediately if you trigger the "Build and deploy" workflow manually.

One-time setup for the album repo: copy `extras/album-repo-resize-workflow.yml` into `ganeshapp/album` as `.github/workflows/resize.yml`. It auto-resizes every pushed image to max 1600px, recompresses, and strips EXIF (including GPS location) — keeps the repo small and your location private.

**Album (local):** the same folder structure also works inside this repo under `assets/albums/` (see `test_album`). Good for small one-off albums; remote is better for anything big. If a local and remote album share a name, local wins.

## Deploying

Built by `.github/workflows/deploy.yml` (GitHub Actions → GitHub Pages). In the repo settings, set **Pages → Source → GitHub Actions**.

- **Test deploy:** push to a repo named e.g. `test` → serves at `gapp.in/test`. The workflow passes the subpath as `--baseurl` automatically, and the `baseurl_links` plugin rewrites all root-relative links so everything works under the subpath.
- **Final deploy:** push to `ganeshapp.github.io`, then add a `CNAME` file containing `www.gapp.in` (don't add CNAME to the test repo — it would steal the domain).

## Local development

```
bundle install
bundle exec jekyll serve
```
