# Localisation: reading the game in Korean

Janggi is a Korean game, so Korean is the first language added after English.
This records what was decided and why, so nobody re-derives it. The SEO side
(what a search engine sees) is in `docs/seo.md`.

## State and scope

The goal is a **minimum viable translation**: a Korean speaker with little or no
English can play a game from the first screen to the result.

- **In scope: the main game.** Tabs, controls under the board, turn line, result
  banner and its explanations, the Play, Look and Sound tabs, plaques, draw
  offer, bot notices, the repeated-position note, the record sheet, the welcome
  and the tour, and the whole You tab: the account, the progress, the app and
  help links and the save key, with the answers the game gives to them and the
  toasts (`you` and `toasts` in `Messages`). Also playing a friend, the guided
  tutorial (`tutorial`: every scene's words, keyed by `TutorialSceneName` and
  held to each scene's steps by `TutorialScenes.test.ts`), and the styles sheet
  and editor (`styles`, the lowest priority for a reviewer).
- **Out of scope for now:** the legal pages (the guide and references have
  machine-translated Korean versions of their own, below; the legal pages stay
  English on purpose, a machine translation of legal text being able to change
  what it means). A style keeps its own name in every language, as a proper
  name.
- **English on purpose inside the styles sheet:** the checker's notes on one
  field of a style's JSON (`style.sides.han.size should be…`, in `Reading`). They
  name a place in the JSON for someone writing it by hand, and the sync and save
  checks share them with no language to hand. What the sheet says of a whole
  key, name, file or text is in `styles.refusals`; a function that words one is
  handed those words, as `pieceTargetName` is.
- **Deployed in a test state.** Choosing Korean (or a Korean browser on a first
  visit) shows a bilingual note that the translation is a work in progress.
- **Reviewed by a volunteer native speaker**, so the load is kept in mind. It
  began at about 170 strings and grew by decision to cover the whole game, so the
  reviewer's table should put the rules and play first and the styles editor last.

## Architecture

- `webapp/src/language/` holds every word a player reads: one `Messages` value
  per language (`messages/english/EnglishMessages.ts`,
  `messages/korean/KoreanMessages.ts`), looked up with
  `messagesOf`. It may import `@janggi/shared` and nothing else, so both the
  page and the store can reach it. A language is a value of `Messages`, so a
  string left out does not compile.
- **One folder per area, split by what the words are for** as the page is:
  `messages/` (the whole), `status/`, `clock/`, `settings/` (with `you/`),
  `record/`, `onboarding/`, `friend/`, `styles/`, `tutorial/`, `guide/` and
  `references/`.
- **Inside an area, one folder per translated type**, named for it, with the
  type at its root and a translation per language beneath, named for the type
  too: `clock/clock-messages/ClockMessages.ts`, then
  `clock/clock-messages/english/EnglishClockMessages.ts` (exporting
  `ENGLISH_CLOCK_MESSAGES`) and `korean/KoreanClockMessages.ts`. The one type
  with several translations a language, `TutorialSceneWords`, names each file
  for its scene (`EnglishTheWholeGame.ts`).
- **A supporting type used by one other type only is written in that type's
  file**, unexported, below it (`ClockExplanationMessages` in
  `ClockMessages.ts`). One anything else imports — a component, a translation,
  a second type — has a file of its own in a `types/` folder, at the level it
  is shared from: the type folder's (`you-messages/types/`), the area's
  (`tutorial/types/TutorialNarrationWords.ts`), or the language's
  (`types/SentenceWithTwoLinks.ts`, used by the guide, the You tab and the
  record sheet). A
  lookup sits at its area's root (`guide/GuideMessagesOf.ts`), `messagesOf` at
  the language's. What every area needs, an army's name, is in `sides/`, apart
  from `EnglishMessages.ts` so an area naming a side does not import the whole
  language.
- Components read it through `useMessages()`
  (`webapp/src/react/pages/game/hooks/use-messages/`). A component never writes
  English itself.
- **Ids stay English; labels are looked up.** `SettingsTabName`, `Side`,
  `DrawnBy`, `MatchFormat`, `SetupName` and the other unions in
  `shared/src/janggi/` are ids: the store, the tour, test ids and the acceptance
  DSL use them. What a player reads is `messages.<area>.<id>`. A picker takes an
  optional `labelOf` (`OptionPicker`, `OptionSelect`, `OptionButton`), and each
  option button carries its id in `data-option`, so a spec never reads the words
  on a button.
- **A sentence is a function** (`won: side => ...`) so each language orders and
  inflects it. Words are never spliced into English word order, and aria labels
  are whole strings (`Sheet`'s `closeLabel`, `VolumeSlider`'s `muteLabel`),
  never lowercased or joined.
- `LanguageName` (`en`, `ko`) lives in `shared/src/janggi/settings/`. The
  message module needed `TourStepName`, `GameEnding` and `GameResult`, which
  moved to `shared/` for that reason, as did the style editor's options
  (`shared/src/janggi/styles/`), whose words are keyed off their lists.
- The preference is `language` plus `languageNoticeSeen` in the preferences
  slice. It is kept on the device and **not synced**: a phone and a laptop may
  be read in different languages.

## Choosing the language

1. A page whose address names a language (`/ko/`) is read in it, over everything
   below: `language/address/LanguageOfAddress.ts`, applied by `loadPreferences`.
2. A language the player chose is kept and wins.
3. Otherwise the first of `navigator.languages` the game has, by primary subtag
   (`ko-KR` is Korean): `redux/preferences/language/LanguageOfBrowser.ts`,
   applied by `loadPreferences`.
4. Otherwise English.

`<html lang>` follows the choice (`useDocumentLanguage`), and so does the
address bar (`useLanguageAddress`: `/` or `/ko/`, rewritten in place with no
reload; see `docs/seo.md`). The picker is the
first row of the You tab and the first row of the welcome's second screen, each
language named in itself (English, 한국어) so a player who cannot read the rest can
find theirs. There is no forced redirect anywhere: the address is only rewritten
in place.

## The work-in-progress note

`LanguageNotice` is shown while the language is Korean and the note is unread.
It is in Korean and English at once, sits at the top, dims nothing and is above
the welcome. Choosing Korean again (`languageChosen`) marks it unread, so it
comes back; English never shows it. **Delete the component, its mount in
`GamePage`, the `languageNoticeSeen` preference and `LanguageNoticeDsl` when the
translation is accepted.**

## The guide, machine translated

The guide has its own words, `GuideMessages` (`guide/guide-messages/`,
with its sections' own beside it), looked up by `guideMessagesOf` and handed to
`LearnPage` as props. It is **not part of `Messages`**: about sixty passages of
prose that every game page would otherwise carry, drawn on a page that has no
store. Where a sentence has a bold word or a link in it (`MarkedText`,
`SentenceWithTwoLinks`), each language writes the text before, the marked words
and the text after, so the marked words fall where its own order puts them.
`MovementSnapshot` takes its caption as a prop for the same reason.

The Korean was **machine translated from the English by an assistant and has not
been read by a native speaker**, so the page opens with a notice saying so in
Korean and English, which links the English guide and cannot be dismissed. To
remove it once someone has read it, set `translationNotice` to `undefined` in
`KOREAN_GUIDE_MESSAGES`. Terms to check first: the piece names (`궁(왕)`, `졸·병(卒·兵)`),
`rules.openings` (상차림), the two formats (일반, 점수제 and 대회 방식), `hero.facts`,
and the wording of 외통 against 장군 in `winning`.

## The references, machine translated

The references page has the same shape as the guide: `ReferencesMessages`
(`references/references-messages/`), looked up by
`referencesMessagesOf` and not part of `Messages`. `referenceSectionsOf` builds
the page's sections from those words, keeping URLs and licences in one place.

**What other people wrote keeps the name they gave it**: a source's title and
its authors, in the code as literals. The labels this project wrote (`linkNames`)
and what each source contributed (`descriptions`) are translated. Where the
English says a source is "In Korean", the Korean says instead when one is in
English. It opens with the same `TranslationNotice`; remove it by setting
`translationNotice` to `undefined` in `KOREAN_REFERENCES_MESSAGES`. A Korean reader reaches
it from the You tab, `/ko/` and the Korean guide (`addressOfReferences`).

## Why no i18n library

Two languages and a few hundred strings do not need one:

- Typed `Messages` gives compile-time completeness; most libraries use string
  keys and need extra tooling for that.
- Korean particles (이/가, 은/는) are not solved by any library, so the wording
  avoids a particle after an army name (`초 승리`, not `초가 이겼습니다`).
- No bundle cost, and a dependency needs approval under the supply-chain policy.
- Korean has no plurals or gender, and `Intl` is built in.

**Revisit when:** a third language arrives (especially one with plurals);
translators want files (PO or XLIFF) rather than editing `.ts`; or the strings
grow past a few KB (then lazy-load each language). Candidates then: Lingui
(compile-time extraction, small runtime) or Paraglide (typed, tree-shaken).
i18next last: weakest typing and the heaviest.

## The icon rule

Where a picture can replace a word, use one (`SvgIcon`,
`webapp/src/react/AGENTS.md`). **Icon-only only where the glyph reads the same
in any language** (close, back, chevrons, a tick), with an `aria-label` that has
the words. Otherwise an icon plus a short label, and a row of like controls is
all one or all the other. A picture drawn inside a button the specs read the
text of carries no text.

Decided against: icons on the Your side picker. With a dot beside Cho and Han,
"Random" was clipped at 320 px; it fits without.

## Korean terms and sources

Janggi's own terms are used rather than translations of the English: 한수쉼
(pass), 빅장 (bikjang), 외통 (checkmate), 장군 (check), 점수승, 초 and 한, and
the setups 안상차림, 바깥상차림, 왼상차림, 오른상차림 (from
`docs/opening-setups.md`, section "official Korean notation"). **기동차 차림 for
"Central Chariot" is spelled as `docs/opening-setups.md` has it, unconfirmed.**
Terms a native speaker should check first:
`play.setupNames`, `play.formatNames` (일반 / 점수제), `play.flipBoard`,
`play.games`, `tabs.You` (내 정보), `controls.redo` (다시 두기), `controls.pass`,
`announcements.inCheck` (초 궁 장군 상태), `overlays.botPlays`,
`overlays.drawOffer` (무승부 · 초 제안), `result.botPlaying` (봇(초)),
`record.winsDrawsLosses`, `record.winRate`, `record.endings.abandoned`,
`announcements.wonOnPoints`.

## The reviewer's table

A native speaker finds an English-to-Korean table far easier than reading code.
It is made by flattening `ENGLISH_MESSAGES` and `KOREAN_MESSAGES`, and the guide's and references'
words beside them:

1. A temporary Vitest file (deleted after) walks both objects, calling each
   function message with sample values (`cho`, `800`, step 3 of 8, 300 XP, both
   draw outcomes), and writes JSON.
2. A short script turns the JSON into one HTML page: grouped by screen, English
   beside Korean, the entries above marked "please check", a search box.
3. The page is published as a private Artifact and shared by the owner.

The page is a snapshot and its link is private and perishable, so regenerate it
rather than rely on it. Reviewer changes go into the `korean/` folders only; the types and
`MessagesOf.test.ts` catch anything missing.

## Still English

The legal pages and the manifest, which stay English by decision. The game's own
Korean page, `/ko/`, the guide's, `/ko/learn.html`, and the references',
`/ko/references.html`, are built: see `docs/seo.md`.

The unlock ladder holds `UnlockItem`s, data rather than words, and
`unlockWordsOf` words them where they are shown: a style keeps its name and the
words around it are the language's ("Hanja 말"). `lockBehindBot` likewise returns
a `BotLock` for `play.botLock` to word. The engine carries no player-facing
description of a setup; those are `play.setupDescriptions`.

## Adding a language, or changing a string

- Add the code to `LANGUAGE_NAMES`, write a `Messages` value as a folder
  beside every `english/` one, add it to
  `messagesOf`, and give it a name in `language.names` of every language. Add a
  row to `MessagesOf.test.ts`.
- Acceptance specs run on the English fixture. A spec in another language
  chooses it (`janggi.settings.language.setTo`) or opens a browser that prefers
  it (`useKoreanBrowser`), and dismisses the note before tapping the board.
- Read a label with `textContent`: the controls are drawn in capitals, so
  `innerText` returns the capitals.

## Hazards found

- Korean would otherwise break a line between any two letters, so `body` in
  `index.css` sets `word-break: keep-all`. That still leaves a break after a
  closing bracket, so **no particle straight after `)`**: `(샹치)와` can end a line
  before its `와`. Reword rather than add an invisible joiner, which a reviewer
  cannot see and a search engine reads. `ReadingKoreanWithoutSplitWords` measures it.

- Never build an aria label by lowercasing and joining words.
- A dev server on a spare port is stopped by PID (`ss -ltnp`), not with
  `pkill -f <pattern>`, which kills the shell that ran it.
- Specs that read visible text (toast, tour, status) are English-fixture only.
