# The bot — Fairy-Stockfish, and where its janggi is not ours

Research date: 2026-09-14. Read alongside `webapp/src/bot/`, and `docs/rules.md`,
whose §6 decisions this document is measured against.

The bot is [Fairy-Stockfish](https://github.com/fairy-stockfish/Fairy-Stockfish),
run in the page from the `fairy-stockfish-nnue.wasm` npm package (1.1.12). It is
the only engine that plays janggi at strength, and it plays **a** janggi — not
quite the one `webapp/src/game/` encodes. This document records where the two
differ, what was done about it, and what the Elo numbers do and do not mean.

---

## 1. Its janggi against ours — read from its source

Fairy-Stockfish defines four janggi variants in `src/variant.cpp`: `janggi`
(bikjang and material counting), `janggitraditional` (bikjang, no counting),
`janggimodern` (counting, no bikjang, Kakao-style move repetition) and
`janggicasual` (neither). The rules live in `src/position.cpp`.

| Rule | Ours (`docs/rules.md` §6) | Fairy-Stockfish |
| --- | --- | --- |
| Bikjang | **Called** by a player. Scored: each side under 30 points, and not on the ply after a general's capture; settles on points. Casual: a draw | **Automatic**: generals facing for two plies ends the game. No threshold, no capture exception. While it stands, any move that keeps it is illegal (`legal()`) |
| Repetition | A third standing is refused, unless each side is under 30 points — both formats | A draw (or a points result with counting); perpetual check loses. No 30-point exemption |
| Two passes in a row | Settled on points — both formats | Points with counting; a draw without |
| Pass | Unrestricted, except while in check | Allowed to both sides; in a standing bikjang, even in check |
| Material, 13/7/5/3/3/2 and Han's 1.5 덤 | Yes | Yes — `JANGGI_MATERIAL`, a `-1` tiebreak for the half point |
| Setup phase | Enforced in Scored | Not modelled — it is handed an arranged position |

**The 30-point threshold and the general-capture exception cannot be switched on**
through `variants.ini`. They would need new code upstream, which is an
enhancement worth proposing but not something this app waits on.

## 2. Decided: our engine referees, Fairy-Stockfish advises

The engine is never asked an open question.

- **It runs `janggibot`**, a variant defined in the page:
  `[janggibot:janggi]` with `bikjangRule = false`, `materialCounting = janggi`
  (`engine/FairyStockfishFrom.ts`). Facing generals are then an ordinary
  position to it, and a double pass a points decision — which is how ours behaves
  in both formats. That leaves bikjang the only place the formats differ, and
  bikjang is ours to handle.
- **Every search is `go … searchmoves`** over exactly `legalMovesFor`, plus a rested
  turn where `canPass` allows one (`choice/CandidateTurnsFor.ts`). Its answer is
  matched against that list as offered; an answer not on it, or none, is replaced
  by the first candidate. So the bot cannot play a move our rules refuse.
- **Bikjang is decided in our code.** Before searching, the bot calls a bikjang it
  can call and wants: casually when the engine's last evaluation says it is losing
  by more than 150 centipawns, scored when it is ahead on `scoreFor`
  (`choice/ShouldCallBikjang.ts`). And it drops any candidate that hands the
  opponent a bikjang the opponent would want by the same test, unless that leaves
  nothing (`choice/hands-opponent-a-bikjang/`).

**Accepted, not fixed:** below the root of its search the engine still judges
repetition, the threshold and bikjang by its own rules, so a line several plies
deep can be misjudged. The move it actually plays is always ours to allow.

Verified against the real wasm under Node: the custom variant loads, `go perft 1`
from `FenOf` of the opening gives the 31 moves of `docs/rules.md` §5 plus the pass
`e2e2`, and `searchmoves` is obeyed.

Whole games are played on it on every push and pull request, in a workflow of its
own (`.github/workflows/bot-games.yml`) that gates no deploy. `PlayingTheBotToTheEnd.test.ts`
in the webapp plays the weakest bot against the strongest under Node, and the
acceptance spec of the same name plays one in the browser, relaying each turn
between two copies of the app. Both assert only that the game ends.

## 3. The Elo numbers are nominal

Strength is `UCI_LimitStrength` with `UCI_Elo` (500–2850), which Fairy-Stockfish
maps to a skill level through a fit **calibrated on chess** — CCRL, 60+0.6, anchored
at Goldfish 1.13 = 2000 (`src/search.cpp`). Nobody has calibrated it for janggi.
"Bot 1400" is a rung on a ladder that climbs, and the player's own rating
(`redux/ratings/elo/EloAfter.ts`, standard Elo, K 40 then 20 after thirty games)
is a place on that same ladder. The record page says so.

## 4. Cross-origin isolation, on a host that sends no headers

The package is built with threads, so it needs `SharedArrayBuffer`, which a
browser grants only to a page sent `Cross-Origin-Opener-Policy: same-origin` and
`Cross-Origin-Embedder-Policy: require-corp`. The dev and preview servers send
them (`vite.config.ts`). **GitHub Pages cannot send headers**, so the service
worker (`webapp/src/sw/ServiceWorker.ts`, vite-plugin-pwa `injectManifest`) adds
both to every response it serves, from the precache or the network — the
technique `coi-serviceworker` popularised. The first visit is served before the
worker exists, so `main.tsx` reloads once, per session, when it takes control.
Where a browser still will not isolate the page, the opponent picker is closed
and says why. Moving hosting to one that sends headers would make the reload
unnecessary.

## 5. Licence

Fairy-Stockfish is GPL-3.0; this repository is MIT. The engine is not bundled into
the app's code: its files are copied, unmodified, from `node_modules` into
`engine/` at build (`vite.config.ts`), with its `Copying.txt` and `AUTHORS`, and
it runs as a separate program the page talks UCI to. The record page credits it
and links its licence and source.
