<p align="center">
  <img src="webapp/public/icon.svg" width="140" height="140" alt="장기, Janggi">
</p>

<h1 align="center">Janggi · 장기</h1>

<p align="center">
  <strong>Korean chess, on your phone.</strong> Play a friend across the table or take on the bot.
  Install it and it works offline.
</p>

<p align="center">
  <a href="https://janggi.neilarmstrong.dev/"><strong>▶ Play now</strong></a>
  ·
  <a href="https://janggi.neilarmstrong.dev/learn.html"><strong>Learn how to play</strong></a>
</p>

---

## Why janggi?

If you know chess or xiangqi, janggi feels familiar for about three moves. Then it doesn't.

- There is no river. The whole board is open from the first move, and the elephant, a slow
  defender in xiangqi, becomes a long-range raider that can cross to the far side.
- The cannon has to jump to move at all. It needs exactly one piece to vault over, and it can never
  jump or take another cannon. In the opening neither side has a single legal cannon move.
- Each palace is marked with an X. Generals, guards, chariots, cannons and even soldiers can run
  along those diagonals.
- You can pass. There is no stalemate, so a player with nothing good to do can rest a turn.
- When the generals face each other down an open file, that is *bikjang* (빅장), and it can end the game.
- You choose your own opening. Before play, each player arranges their horses and elephants. There are
  four tournament arrangements and a fifth casual one, so the game starts differently depending on what
  you both pick.

## What's in the app

### Learn before you play

The illustrated [guide to playing janggi](https://janggi.neilarmstrong.dev/learn.html) covers the board,
every piece, the unusual rules and both match formats. The sources and credits are on the
[references page](https://janggi.neilarmstrong.dev/references.html).

### Two ways to play

- **Casual** is the friendly game that most online janggi sites play. Call a bikjang and it's a draw.
- **Scored** is the tournament game of the Korea Janggi Association. Han lays out first, Cho answers,
  and Han gets 1.5 points of compensation (덤) for moving second. Bikjang can only be called once both
  sides are down to under 30 points, and it's decided on material instead of being drawn.

The app enforces check, mate, passing, repetition and bikjang in both forms. Where sources disagree on a
rule, I wrote up the decision and its sources in [`docs/rules.md`](docs/rules.md).

### A bot to beat

- Eight strengths, from 800 up to 2850, powered by
  [Fairy-Stockfish](https://github.com/fairy-stockfish/Fairy-Stockfish) running in your browser.
- Play either army, or let the app pick at random. Beating a bot opens the next strength on that
  army's casual or scored ladder.
- Every game against the bot is rated. Your Elo is tracked separately for casual and scored play, with a
  record against each strength (win rate overall and with each army) and your full game history.
  Take-backs are off, and abandoning a game to start a new one counts as a loss. That keeps the number honest.
- Finishing games earns XP for new boards and piece sets. A copyable save key carries your XP,
  unlocked bots and custom styles to another device.

### Looks and sound

- Nine built-in piece sets and seven boards, from traditional characters and classic wood to
  matched themes. You can also create, import and share your own styles.
- The soundtrack is synthesised from Korean instruments: gayageum, daegeum, janggu and gong, in
  traditional modes and rhythms. It changes with the game. Tension builds as pieces come off the
  board, a theme cuts in when a general is in check, and the ending gets its own cue.
- Pieces fly, captures land, the board shakes, and on a phone you'll feel it buzz. All of it can be
  turned down.

### Built for your phone

- Install it from the browser and it opens full screen, like an app.
- It works offline, bot included.
- Close it mid-game and come back later. The game, your settings, progress and record are where you left them.

## The pieces at a glance

| Piece | Moves | Worth |
| --- | --- | --- |
| General 궁 | One step along any line, never leaving its palace | — |
| Guard 사 | Same as the general | 3 |
| Chariot 차 | Any distance straight, and along palace diagonals | 13 |
| Cannon 포 | Like a chariot, but must jump exactly one non-cannon piece | 7 |
| Horse 마 | One step straight, then one diagonal. Blocked if the first point is taken | 5 |
| Elephant 상 | One step straight, then two diagonal. Blocked at either point on the way | 3 |
| Soldier 졸/병 | One step forward or sideways. Diagonally forward inside the enemy palace | 2 |

Cho (blue) moves first. Checkmate the enemy general to win.

---

## Also a showcase of engineering

I built this to play, and just as much to show how I build software. Everything below is in this
repository, and where I could, tooling enforces it instead of good intentions.

### Acceptance Test Driven Development

- Every feature starts as a Playwright acceptance spec in plain `given` / `when` / `then` language:
  *"given a player takes on the bot, when they play han, then the bot opens as cho"*. I watch it fail for
  the right reason before writing any code.
- A domain-specific language sits between the specs and the browser. Specs talk to `janggi.board`,
  `janggi.settings` and `janggi.status`, and only the DSL's Playwright layer touches locators. Lint
  rules keep it that way: a spec can't import Playwright, and a `then` can't perform an action.
- The same suite runs on desktop and on a phone viewport, with motion both reduced and in full. That's
  hundreds of checks, run against the dev server locally and against the deployed site in CI.

### Tests I've seen fail

- Over 1,200 unit tests with Vitest cover the rules engine, the store, hooks and every plain
  function. They're named as sentences, with one file per export.
- Property-based tests play thousands of random legal games with fast-check and assert what must
  hold after every move.
- A test I've never seen fail isn't one I trust. So I break the code on purpose to check the test
  notices, which has more than once exposed a test that asserted nothing.

### The web stack

- React 19, Redux Toolkit, Tailwind CSS v4 and Vite, installable as a PWA that works offline.
- TypeScript at its strictest: `strict`, `noUncheckedIndexedAccess`, `verbatimModuleSyntax`, explicit
  return types, and literal unions. An off-board point or a misspelled setting won't compile.
- ESLint with zero warnings allowed and Prettier on everything, in one `pnpm checks` gate.
- Lint enforces the architecture. The rules engine can't import React or Redux, the store can't import
  components, and the sound and bot layers are walled off too. Crossing one of those lines fails the
  build instead of waiting for a code review.
- A WebAssembly chess engine runs in the browser, cross-origin isolated on GitHub Pages through the
  app's own service worker. The app's rules engine referees every move it plays.
- GitHub Actions runs the checks, then the acceptance tests against a production build, then deploys,
  then runs the acceptance tests again against the live site. Dependencies are exact-pinned and checked
  against a supply-chain policy.

### Working with AI agents

- I build this with AI coding agents, and they follow the same test-first loop a person would.
- An `AGENTS.md` at the root and in every package records the architecture, the rules, the gotchas and
  the reasoning behind decisions. An agent or a new developer starts from the same understanding.
- Where sources disagree on the rules of janggi, I wrote up the decision and its sources in
  [`docs/`](docs/) and linked it from the code that implements it.

### Code and folder structure

- A file lives beside the one thing that uses it, and rises only as far as its nearest shared caller.
  So a file's depth tells you how much breaks if you change it.
- One export per file, named for it. Functions read top-down, every type is named, and folders are
  named for their subject (`bikjang/`, `check/`, `scoring/`) instead of their shape.
- The app mirrors the test DSL. The game screen's sections and the DSL's components share names, so a
  spec and the code it covers describe the screen in one vocabulary.
- The rules of janggi are plain TypeScript with no React, no store and no DOM. A state goes in and a
  state comes out, which makes them cheap to test exhaustively.

---

## For developers

React, installable as a PWA, built with Acceptance Test Driven Development.

### What's here

pnpm workspace with three packages:

- `webapp/` is the game, learning guide and references pages. Vite, React, Redux Toolkit, Tailwind, PWA.
- `acceptance-tests/` is the acceptance-test DSL and the specs, run by Playwright.
- `shared/` is code shared by both, plus the base tool config in `shared/config/`.

### Getting started

```bash
corepack enable && nvm use
pnpm install
pnpm install-browsers    # one-time Playwright chromium download
pnpm start               # http://localhost:3000
```

```bash
pnpm checks              # lint, format, types and unit tests across every package
pnpm acceptance-tests    # with the app running in another terminal
```

### Working on it

`AGENTS.md` at the root, and one per package, carry the conventions and the gotchas. They're written
for coding agents but people can read them too. Start there.

### The bot's engine

The bot is [Fairy-Stockfish](https://github.com/fairy-stockfish/Fairy-Stockfish), run in the browser
from the `fairy-stockfish-nnue.wasm` package. It is free software under the GPL-3.0: the app ships its
files unmodified, with its licence, at `engine/`, and talks to it over UCI. Its janggi differs from this
app's rules in places, so this app's engine decides every move the bot may play.
[`docs/bot.md`](docs/bot.md) says where and why, and why its Elo numbers are nominal.
