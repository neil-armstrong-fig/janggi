# SEO for a Korean audience

What a search engine sees of Janggi today, why the in-app Korean does nothing
for it, and the plan for when the translation is ready. Nothing here is built
yet. The translation itself is in `docs/localisation.md`.

## Today

- One game URL, `https://janggi.neilarmstrong.dev/`, in English: `<title>`,
  description, Open Graph and Twitter text, `og:locale en_GB`, JSON-LD with
  `inLanguage: en`, a self-referencing canonical, and `<main data-crawler-copy>`
  English text for a crawler that runs no script (`webapp/index.html`).
- `learn.html`, `references.html`, `privacy.html` and `terms.html` are React
  pages rendered to static HTML at build time by `prerenderedPages()` in
  `webapp/vite.config.ts`, so they are crawlable without a second copy.
- `webapp/public/sitemap.xml` lists those five URLs; `robots.txt` allows all.
- The web app manifest is English (`lang: en`) and is a single install.

## What the in-app Korean does for SEO

Nothing, and it does no harm. The language is client-side state at one URL, and
a crawler has no Korean preference, so it only ever sees English. There is no
Korean URL to index and nothing to mark with `hreflang`.

**Do not add `hreflang` or a Korean URL yet.** A page marked as the Korean
version while half of it is English is a duplicate-content risk and a poor
first impression. Start the work below once the reviewer has signed off, the
work-in-progress note is gone, and the visible English is trimmed.

## Decision: a `/ko/` subfolder

English stays at `/` and `/learn.html`, so existing ranking is untouched. Korean
lives at `/ko/` (the game) and `/ko/learn.html` (the guide).

- Same host, so authority is shared; no new DNS or deploy.
- Static files work on GitHub Pages, and the prerender plugin already produces
  them.
- Rejected: `?lang=ko` (search engines treat parameters as duplicates of one
  page, so it gives almost no Korean search benefit) and a separate Korean
  domain (splits authority and needs new setup, too much for one small game).

## Build checklist for the `/ko/` phase

**Pages**

- New Vite inputs `ko/index.html` and `ko/learn.html` beside the existing ones
  in `vite.config.ts`, and an entry for the guide in `PRERENDERED_PAGES` that
  renders it in a given language.
- **The guide is the valuable page and the big cost.** It is about 570 lines of
  English prose, and it is what a search for how to play (장기 두는 법, 장기
  규칙) lands on. A Korean game page without it is thin.

**Per page**

- `<html lang="ko">`, a Korean `<title>` and description, Open Graph and
  Twitter text, `og:locale ko_KR` with `og:locale:alternate` for English.
- JSON-LD with `inLanguage: ko` and the Korean name (장기).
- Korean crawler copy and `<noscript>` text, and a Korean social card image
  (`public/social-card.png` has English text in the picture).
- A canonical pointing at itself.

**Linking the languages**

- `hreflang` for `en`, `ko` and `x-default` (English) in the head of every
  page, **and** the same pairs in `sitemap.xml` as `xhtml:link` entries, plus
  the new URLs. Pairs must be reciprocal and the head and the sitemap must
  agree. Leave `robots.txt` as it is.

**The app**

- A locale URL sets the language on load, and the language pickers navigate
  between `/` and `/ko/` so the URL and the content always agree. Game state is
  kept in storage, so a full page load keeps the game.
- First-visit detection of a Korean browser stays, but as a one-time client-side
  suggestion or redirect to `/ko/`, never a server redirect: a crawler sends no
  Korean preference, and Pages cannot redirect on headers. This is an open
  decision for that phase.

**PWA and tests**

- One manifest. Its scope `/` already covers `/ko/`, and the precache globs
  already include `html`. Check the service worker serves `/ko/` and that asset
  URLs use `%BASE_URL%` so a `BASE_PATH` build still works.
- Acceptance: for each locale page, a spec reading `<html lang>`, the title, the
  canonical and the `hreflang` links through the DSL (`JanggiPlaywright` already
  reads the title and `h1`). The PWA specs run against a build.

## Search engines

- **Naver** is the leading search engine in Korea. Register the site in Naver
  Search Advisor, verify ownership, and submit the sitemap. The verification is
  a meta tag or a file: add it, and record it in `MANUAL-SETUP-STEPS.md`
  (required by the root `AGENTS.md`; never put a token in it).
- **Google Search Console:** add the `/ko/` URLs, inspect them, and watch page
  indexing. Bing Webmaster Tools is optional.

## Content and where it can rank

The repo holds research few sites have: `docs/rules.md` and
`docs/opening-setups.md` (상차림 and 포진 terms, with Korean sources). A Korean
explainer on 상차림 or 빅장 built from them is the likeliest way to rank for
those queries. Intents to test, to be checked against Search Console and Naver
data after launch rather than assumed: 장기 온라인, 무료 장기 게임, 장기 AI 대국,
장기 두는 법, 빅장 규칙, 상차림 종류, 친구와 장기.

## Checks after deploying

- View the source of `/ko/` with scripts off: the Korean text is there.
- The `hreflang` pairs are reciprocal (use a validator) and match the sitemap.
- URL Inspection in Search Console, and Naver's page collection check.
- Lighthouse SEO, and a link preview of the Korean social card.

**Risks:** `hreflang` added too early; the head and the sitemap disagreeing; a
stale service-worker `index.html` serving the old page; and a language picker
that leaves `/ko/` showing English.
