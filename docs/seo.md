# SEO for a Korean audience

What a search engine sees of Janggi, why the in-app Korean alone did nothing
for it, and what was built: a Korean page for the game, and a machine-translated
Korean guide and references. The translation itself is in `docs/localisation.md`.

## Decision: a `/ko/` subfolder, for the game and its reading pages

English stays at `/`, so existing ranking is untouched. The Korean game is at
`/ko/` (`webapp/ko/index.html`), the Korean guide at `/ko/learn.html`
(`webapp/ko/learn.html`) and the Korean references at `/ko/references.html`
(`webapp/ko/references.html`); the legal pages are not translated.

- Same host, so authority is shared; no new DNS or deploy. Static files work on
  GitHub Pages.
- Rejected: `?lang=ko` (search engines treat parameters as duplicates of one
  page) and a separate Korean domain (splits authority; too much for one small
  game).
- **Privacy and terms are not translated** and have no Korean URL.
  The Korean pages link to them in English and say so ("(English)"). They carry
  no `hreflang`, since they have no twin.

**What this costs:** the game page, `/ko/`, will not rank for 장기 두는 법 or
장기 규칙; the Korean guide is the page that can. It is a machine translation, so
it says so, and it is worth a native speaker's read before it is relied on.

## What is built

- `webapp/ko/index.html`: `<html lang="ko">`, a Korean title and description,
  Open Graph and Twitter text, `og:locale ko_KR` with `en_GB` as the alternate,
  a canonical pointing at itself, JSON-LD (`inLanguage: ko`, name 장기), Korean
  crawler copy and `<noscript>` text, and `social-card-ko.png`. It is a Rollup
  input in `vite.config.ts`. **Its head is a copy of `webapp/index.html`'s**:
  change one, change the other.
- `hreflang` for `en`, `ko` and `x-default` (English) in the head of both game
  pages, and the same pairs as `xhtml:link` in the sitemap on both entries.
  They must be reciprocal and the head and sitemap must agree; a criterion in
  `DiscoveringJanggiInKorean.test.ts` compares them.
- **A plain link each way**, in the crawler copy of both game pages
  (`<a href="/ko/" hreflang="ko">`, and back to `/`). `hreflang` in the head
  names a twin but is not a link a crawler follows; Search Console reported
  `/ko/` as "URL is unknown to Google" until it had one.
- **The Korean guide**, `webapp/ko/learn.html`, is drawn by the same `LearnPage`
  as the English one, given `language="ko"`. `PRERENDERED_PAGES` carries that
  prop and matches a page by its whole path, because `learn.html` is also the end
  of `ko/learn.html`. Its words are `KOREAN_GUIDE_MESSAGES`
  (`src/language/guide/`), a `GuideMessages` as `ENGLISH_GUIDE_MESSAGES` is,
  looked up by `guideMessagesOf`; the guide is not part of `Messages`, which
  every game page carries. It was **machine translated and has not been read by a
  native speaker**, so it opens with a notice in Korean and English
  (`TranslationNotice`, `translation-notice`) that links the English guide
  and cannot be dismissed. **To remove it, set `translationNotice` to `undefined`
  in `KOREAN_GUIDE_MESSAGES`** once someone has read it. Its link to the rules research is
  English and says "(영어)". Its head has the `hreflang`
  pair (also in `learn.html`), `og:locale ko_KR`, the Korean social card and
  JSON-LD with `inLanguage: ko` and `translationOfWork`; the sitemap has both
  guides with alternates. The two guides link to each other in their footers,
  the Korean game's settings link the guide in the language the game is read in
  (`GuideLink`), and `/ko/` links to `/ko/learn.html`.
- **The Korean references**, `webapp/ko/references.html`, follow the guide:
  `ReferencesPage` given `language="ko"`, the same `PRERENDERED_PAGES` prop, the
  same notice and switch, its head and sitemap entries with the `hreflang` trio.
  Its words are `KOREAN_REFERENCES_MESSAGES`, also machine translated; a source's title
  and authors stay as they wrote them. To remove the notice, set
  `translationNotice` to `undefined` there. The Korean game, `/ko/` and the
  Korean guide all link to it, and the English page links to it by its switch.
- **The sitemap is dated.** It is built from
  `webapp/vite/sitemap/sitemap.template.xml` by `DatedSitemapFile.ts` beside
  it, which gives each address a `<lastmod>`: the day of the last commit that
  touched the page and the words it is written in (`SITEMAP_PAGES`). Not the
  build date, which says every page changed on every deploy and is soon
  ignored. Add a page to the template and to `SITEMAP_PAGES`
  together; the build refuses an address it has no sources for. The deploy
  checks out the whole history (`fetch-depth: 0` in `ci.yml`), or every page
  would be dated by the one commit it has.
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

## Shipped before sign-off

`/ko/` and its `hreflang` went live before the translation was reviewed, which
this document first advised against: a page marked as the Korean version while
part of it is English is a duplicate-content risk. It was accepted as good
enough on 2026-11-03. `LanguageNotice` is still shown and the English still in
the game is not yet trimmed (`docs/localisation.md`, backlog); if Korean
queries bring people who bounce, that is the first place to look.

## Search engines

Registration is manual: `MANUAL-SETUP-STEPS.md`, step 9.

- **Naver** is the leading search engine in Korea. Search Advisor has the site
  verified, the sitemap submitted, and a 웹 페이지 수집 request can be made per
  address. Its RSS submission is unused. Naver registers per host, so the
  personal site on the apex needs its own entry.
- **Google Search Console** has a URL-prefix property for this host only. A
  Domain property (one DNS TXT record on `neilarmstrong.dev`) would cover this
  and the personal site. **Bing Webmaster Tools** imported this one from
  Google.
- **IndexNow** (Bing, Naver, Yandex, Seznam, Yep; not Google) is pinged after
  each deploy by `notify-search-engines` in `ci.yml`, for the pages the sitemap
  dates in the last two days. The key is the name and the content of
  `webapp/public/<key>.txt`, and is public by design: it only proves the host
  is ours. Rotating it means a new file and nothing else, since the job reads
  the name from the folder. The job gates nothing.

### Where it stood on 2026-11-03

Read from the three consoles, and the reason the rest of this section exists:
the site is barely crawled, not badly optimised.

- Google: 1 of 6 pages indexed. The other five (`/ko/`, the guide, references,
  privacy, terms) were "Discovered - currently not indexed", never crawled.
  3 clicks and 25 impressions in three months, average position 28.8.
- Bing read the sitemap once, on 10-03, and found five addresses; `/ko/` came
  later. 0 clicks, 3 impressions.
- Naver collected about five pages in early October and one more late that
  month, with none restricted. 0 clicks, 3 impressions, all for `/`.

That day indexing was requested for `/ko/` and `/learn.html` in Google, a
collection for the same two in Naver, and the sitemap resubmitted in Bing. Look
at the same three screens again after a few weeks before changing anything
else: Google's Pages report, Bing's Sitemaps and Naver's 수집 현황.

## Content and where it can rank

The repo holds research few sites have: `docs/rules.md` and
`docs/opening-setups.md` (상차림 and 포진 terms, with Korean sources). A Korean
explainer on 상차림 or 빅장 built from them is the likeliest way to rank for
those queries, and would need its own Korean page; the Korean guide is the first
step and covers the rules in general. Game intents to test, to be
checked against Search Console and Naver data after launch rather than assumed:
장기 온라인, 무료 장기 게임, 장기 AI 대국, 친구와 장기.

## Checks after deploying

- View the source of `/ko/` and `/ko/learn.html` with scripts off: the Korean
  text, and on the guide its machine-translation notice, are there.
- The `hreflang` pairs are reciprocal (use a validator) and match the sitemap.
- After the first deploy, request indexing for `/ko/learn.html` in Google and a
  collection for it in Naver: a new page is otherwise found slowly.
- URL Inspection in Search Console, and Naver's page collection check.
- Lighthouse SEO, and a link preview of the Korean social card.

**Risks:** `hreflang` added too early; the two game heads drifting apart; the
head and the sitemap disagreeing; a stale service-worker `index.html` serving
the old page; and `/ko/` showing English because a stored choice won over the
address (the address wins, and a spec holds it).
