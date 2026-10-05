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
  and the tour.
- **Out of scope for now:** the learn, references and legal pages, the styles
  editor and style names, the account and save panels, playing a friend, toasts
  and errors, and piece names read by a screen reader (see the backlog below).
- **Deployed in a test state.** Choosing Korean (or a Korean browser on a first
  visit) shows a bilingual note that the translation is a work in progress.
- **Reviewed by a volunteer native speaker**, so the load is kept small (about
  170 strings). Do not grow `Korean.ts` without a reason.

## Architecture

- `webapp/src/language/` holds every word a player reads: one `Messages` value
  per language (`english/English.ts`, `korean/Korean.ts`), looked up with
  `messagesOf`. It may import `@janggi/shared` and nothing else, so both the
  page and the store can reach it. A language is a value of `Messages`, so a
  string left out does not compile.
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
  moved to `shared/` for that reason.
- The preference is `language` plus `languageNoticeSeen` in the preferences
  slice. It is kept on the device and **not synced**: a phone and a laptop may
  be read in different languages.

## Choosing the language

1. A language the player chose is kept and always wins.
2. Otherwise the first of `navigator.languages` the game has, by primary subtag
   (`ko-KR` is Korean): `redux/preferences/language/LanguageOfBrowser.ts`,
   applied by `loadPreferences`.
3. Otherwise English.

`<html lang>` follows the choice (`useDocumentLanguage`). The picker is the
first row of the You tab and the first row of the welcome's second screen, each
language named in itself (English, 한국어) so a player who cannot read the rest can
find theirs. There is no forced redirect anywhere.

## The work-in-progress note

`LanguageNotice` is shown while the language is Korean and the note is unread.
It is in Korean and English at once, sits at the top, dims nothing and is above
the welcome. Choosing Korean again (`languageChosen`) marks it unread, so it
comes back; English never shows it. **Delete the component, its mount in
`GamePage`, the `languageNoticeSeen` preference and `LanguageNoticeDsl` when the
translation is accepted.**

## Why no i18n library

Two languages and about 170 strings do not need one:

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
`docs/opening-setups.md`, section "official Korean notation"). **기동차차림 for
"Central Chariot" is a guess.** Terms a native speaker should check first:
`play.setupNames`, `play.formatNames` (일반 / 점수제), `play.flipBoard`,
`play.games`, `tabs.You` (내 정보), `controls.redo` (다시), `controls.pass`,
`overlays.drawOffer` (무승부 · 초 제안), `result.botPlaying` (봇(초)),
`record.winsDrawsLosses`, `record.winRate`, `record.endings.abandoned`,
`announcements.wonOnPoints`.

## The reviewer's table

A native speaker finds an English-to-Korean table far easier than reading code.
It was made by flattening `ENGLISH` and `KOREAN`:

1. A temporary Vitest file (deleted after) walks both objects, calling each
   function message with sample values (`cho`, `800`, step 3 of 8, 300 XP, both
   draw outcomes), and writes JSON.
2. A short script turns the JSON into one HTML page: grouped by screen, English
   beside Korean, the entries above marked "please check", a search box.
3. The page is published as a private Artifact and shared by the owner.

The page is a snapshot and its link is private and perishable, so regenerate it
rather than rely on it. Reviewer changes go into `Korean.ts` only; the types and
`MessagesOf.test.ts` catch anything missing.

## Still English (backlog, in priority order)

1. The match-format explanation and the flip-board help sentence.
2. Board and piece style names and the styles sheet.
3. The You tab apart from the picker, and the Play a friend sheets.
4. Toasts and errors, including the rename messages built in `redux/`.
5. Piece `aria-label`s (`pieceName`), which a screen reader reads in English.
6. The "bot is Fairy-Stockfish" footer on the record sheet.
7. Number formatting hard-coded to `"en"` (`PlayerPlaque`, `Progress`,
   `LockBehindXp`, `StyleStarter`): identical for small numbers, but the compact
   form ("1M") differs in Korean. Use the chosen language when this is done.
8. The extra pages, `index.html` and the manifest: see `docs/seo.md`.

## Adding a language, or changing a string

- Add the code to `LANGUAGE_NAMES`, write a `Messages` value, add it to
  `messagesOf`, and give it a name in `language.names` of every language. Add a
  row to `MessagesOf.test.ts`.
- Acceptance specs run on the English fixture. A spec in another language
  chooses it (`janggi.settings.language.setTo`) or opens a browser that prefers
  it (`useKoreanBrowser`), and dismisses the note before tapping the board.
- Read a label with `textContent`: the controls are drawn in capitals, so
  `innerText` returns the capitals.

## Hazards found

- Never build an aria label by lowercasing and joining words.
- A dev server on a spare port is stopped by PID (`ss -ltnp`), not with
  `pkill -f <pattern>`, which kills the shell that ran it.
- Specs that read visible text (toast, tour, status) are English-fixture only.
