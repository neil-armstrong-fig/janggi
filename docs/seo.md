# SEO for a Korean audience

What a search engine sees of Janggi, why the in-app Korean alone did nothing
for it, and what was built: a Korean page for the game, and only the game. The
translation itself is in `docs/localisation.md`.

## Decision: a `/ko/` subfolder, for the game only

English stays at `/`, so existing ranking is untouched. The Korean game is at
`/ko/`, the one page whose words are translated (`webapp/ko/index.html`).

- Same host, so authority is shared; no new DNS or deploy. Static files work on
  GitHub Pages.
- Rejected: `?lang=ko` (search engines treat parameters as duplicates of one
  page) and a separate Korean domain (splits authority; too much for one small
  game).
- **The guide, references, privacy and terms are not translated** and have no
  Korean URL. The Korean page links to them in English and says so
  ("(English)"). They carry no `hreflang`, since they have no twin.

**What this costs:** `/ko/` will not rank for 장기 두는 법 or 장기 규칙, which is
where a Korean guide would land. It can target the game intents (below). A
Korean guide is the later, larger step; it would be `/ko/learn.html`, a new
entry in `PRERENDERED_PAGES`, and `hreflang` pairs for it.

## What is built

- `webapp/ko/index.html`: `<html lang="ko">`, a Korean title and description,
  Open Graph and Twitter text, `og:locale ko_KR` with `en_GB` as the alternate,
  a canonical pointing at itself, JSON-LD (`inLanguage: ko`, name 장기), Korean
  crawler copy and `<noscript>` text, and `social-card-ko.png`. It is a Rollup
  input in `vite.config.ts`. **Its head is a copy of `webapp/index.html`'s**:
  change one, change the other.
- `hreflang` for `en`, `ko` and `x-default` (English) in the head of both game
  pages, and the same pairs as `xhtml:link` in `public/sitemap.xml` on both
  entries. They must be reciprocal and the head and sitemap must agree; a
  criterion in `DiscoveringJanggiInKorean.test.ts` compares them.
- **The address follows the language.** A page under `/ko/` is read in Korean
  over any stored choice or browser preference (`loadPreferences`, given
  `languageOfAddress` by the store). `useLanguageAddress` then keeps the address
  bar on `/` or `/ko/` as the language changes, with `history.replaceState` and
  no reload, so choosing a language never closes the settings sheet, and the
  query (`?join=`) survives. A reload therefore keeps the language.
- The page at `/` is unchanged: a stored choice, or a Korean browser on a first
  visit, still reads in Korean there, and the address moves to `/ko/` once it
  does. There is no suggestion banner and no redirect: a crawler sends no
  Korean preference and Pages cannot redirect on headers.
- `<main data-crawler-copy>` heading is `messages.heading`, so the one `<h1>`
  matches the page's language.
- One PWA manifest. Its scope `/` covers `/ko/`, and the precache globs include
  `ko/index.html`.

The social cards are rendered from `webapp/scripts/social-card.svg` and
`social-card-ko.svg` with headless Chromium at 1200 × 630 (Playwright's
`page.screenshot` on the SVG file); re-rendering the English one reproduces
`public/social-card.png` byte for byte. Hangul comes from WenQuanYi Zen Hei.

## Not to do yet

**Do not deploy `/ko/` or its `hreflang` before the translation is accepted.**
A page marked as the Korean version while half of it is English is a
duplicate-content risk and a poor first impression. Ship when the reviewer has
signed off, `LanguageNotice` is gone, and the English still showing in the game
is trimmed (`docs/localisation.md`, backlog).

## Search engines

Registration is manual: `MANUAL-SETUP-STEPS.md`, step 9.

- **Naver** is the leading search engine in Korea. Register in Naver Search
  Advisor, verify ownership, submit the sitemap.
- **Google Search Console:** inspect `/` and `/ko/`, and watch page indexing and
  the alternates report. Bing Webmaster Tools is optional.

## Content and where it can rank

The repo holds research few sites have: `docs/rules.md` and
`docs/opening-setups.md` (상차림 and 포진 terms, with Korean sources). A Korean
explainer on 상차림 or 빅장 built from them is the likeliest way to rank for
those queries, and would need its own Korean page. Game intents to test, to be
checked against Search Console and Naver data after launch rather than assumed:
장기 온라인, 무료 장기 게임, 장기 AI 대국, 친구와 장기.

## Checks after deploying

- View the source of `/ko/` with scripts off: the Korean text is there.
- The `hreflang` pairs are reciprocal (use a validator) and match the sitemap.
- URL Inspection in Search Console, and Naver's page collection check.
- Lighthouse SEO, and a link preview of the Korean social card.

**Risks:** `hreflang` added too early; the two game heads drifting apart; the
head and the sitemap disagreeing; a stale service-worker `index.html` serving
the old page; and `/ko/` showing English because a stored choice won over the
address (the address wins, and a spec holds it).
