<p align="center">
  <img src="webapp/public/icon.svg" width="140" height="140" alt="장기 — Janggi">
</p>

<h1 align="center">Janggi · 장기</h1>

<p align="center">
  <strong>Korean chess, on your phone.</strong> Play a friend across the table or take on the bot,
  install it, and play offline.
</p>

<p align="center">
  <a href="https://neil-armstrong-fig.github.io/janggi/"><strong>▶ Play now</strong></a>
  ·
  <a href="https://neil-armstrong-fig.github.io/janggi/learn.html"><strong>Learn how to play</strong></a>
</p>

---

## Why janggi?

If you know chess or xiangqi, janggi feels familiar for about three moves. Then it doesn't.

- **There is no river.** The whole board is open from the first move, and the elephant — a slow
  defender in xiangqi — becomes a long-range raider that can cross to the far side.
- **The cannon must jump to move at all.** It needs exactly one piece to vault over, and it may never
  jump or take another cannon. In the opening neither side has a single legal cannon move.
- **The fortress has diagonals.** Each palace is marked with an X, and generals, guards, chariots,
  cannons and even soldiers can run along those lines.
- **You can pass.** There is no stalemate: a player with nothing good to do simply rests a turn.
- **The generals can stare each other down.** When they face each other down an open file, that is
  *bikjang* (빅장), and it can end the game.
- **You choose your own opening.** Before play, each player arranges their horses and elephants — four
  tournament arrangements and a fifth casual one — so the game starts differently depending on what you
  both pick.

## What's in the app

### Learn before you play

The illustrated [guide to playing
janggi](https://neil-armstrong-fig.github.io/janggi/learn.html) introduces the board, every piece,
the rules that make the game distinctive and both match formats. The app's sources and credits are
collected on its [references page](https://neil-armstrong-fig.github.io/janggi/references.html).

### Two ways to play

- **Casual** — the friendly game every online janggi site plays. Call a bikjang and it's a draw.
- **Scored** — the tournament game of the Korea Janggi Association. Han lays out first, Cho answers,
  and Han gets 1.5 points of compensation (덤) for moving second. Bikjang may only be called once both
  sides are down to under 30 points, and it's decided on material rather than drawn.

Every rule — check, mate, passing, repetition, bikjang in both forms — is enforced, and the reasoning
behind every contested one is written up with sources in [`docs/rules.md`](docs/rules.md).

### A bot to beat

- **Eight strengths**, from a gentle 800 up to a merciless 2850, powered by
  [Fairy-Stockfish](https://github.com/fairy-stockfish/Fairy-Stockfish) running right in your browser.
- **Play either army**, or let the app pick at random. Beat a bot to open the next strength on that
  army's casual or scored ladder.
- **Every game against the bot is rated.** Your Elo is tracked separately for casual and scored play,
  with a record against each strength — win rate overall and with each army — and your full game
  history. Take-backs are off and abandoning a game for a new one counts as a loss, so the number means
  something.
- **Finishing games earns XP** for new boards and piece sets. A copyable save key carries your XP,
  unlocked bots and custom styles to another device.

### Made to be looked at and listened to

- **Nine built-in piece sets and seven boards**, from traditional characters and classic wood to
  matched themes. You can also create, import and share your own styles.
- **A soundtrack played on synthesised Korean instruments** — gayageum, daegeum, piri, janggu and gong —
  in traditional modes and rhythms, and it changes with the game: tension builds as pieces come off the
  board, a theme cuts in when a general is in check, and the ending is marked.
- **Pieces fly, captures land, the board shakes**, and on a phone you'll feel it buzz. Every bit of it
  can be turned down.

### Built for your phone

- **Install it** from the browser and it opens like an app, full screen.
- **It works offline**, the bot included.
- **Close it mid-game and come back later** — the game, your settings, progress and record are all where
  you left them.

## The pieces at a glance

| Piece | Moves | Worth |
| --- | --- | --- |
| General 궁 | One step along any line, never leaving its palace | — |
| Guard 사 | Same as the general | 3 |
| Chariot 차 | Any distance straight, and along palace diagonals | 13 |
| Cannon 포 | Like a chariot, but must jump exactly one non-cannon piece | 7 |
| Horse 마 | One step straight, then one diagonal — blocked if the first point is taken | 5 |
| Elephant 상 | One step straight, then two diagonal — blocked at either point on the way | 3 |
| Soldier 졸/병 | One step forward or sideways; diagonally forward inside the enemy palace | 2 |

Cho (blue) moves first. Checkmate the enemy general to win.

---

## Also a showcase of engineering

I built this to play, and just as much to show how I build software. Everything below is in this
repository, enforced by tooling rather than left to good intentions.

### Acceptance Test Driven Development

- **Specs come first, and fail first.** Every feature starts as a Playwright acceptance spec written in
  plain `given` / `when` / `then` language — *"given a player takes on the bot, when they play han, then
  the bot opens as cho"* — and is watched failing for the right reason before any code is written.
- **A domain-specific language sits between the specs and the browser.** Specs talk to `janggi.board`,
  `janggi.settings`, `janggi.status`; only the DSL's Playwright layer touches locators. Lint rules keep
  it that way: a spec cannot import Playwright, and a `then` cannot perform an action.
- **The same suite runs on desktop and on a phone viewport**, with motion both reduced and in full —
  hundreds of checks against the dev server locally and against the deployed site in CI.

### Tests that are proven to bite

- **Over 1,200 unit tests** with Vitest, covering the rules engine, the store, hooks and every plain
  function — named as sentences, one file per export.
- **Property-based tests** play thousands of random legal games with fast-check and assert what must
  hold after every move.
- **Mutation testing as a habit.** A passing test proves nothing until it has been seen to fail, so
  code is deliberately broken to confirm the test catches it — which has repeatedly exposed tests that
  asserted nothing.

### Modern web, with the guard rails on

- **React 19, Redux Toolkit, Tailwind CSS v4 and Vite**, installable as a PWA that works offline.
- **TypeScript at its strictest** — `strict`, `noUncheckedIndexedAccess`, `verbatimModuleSyntax`,
  explicit return types, and literal unions so an off-board point or a misspelled setting will not
  compile.
- **ESLint with zero warnings allowed and Prettier on everything**, in one `pnpm checks` gate.
- **Architecture enforced by lint.** The rules engine may not import React or Redux, the store may not
  import components, and the sound and bot layers are walled off too — a boundary crossed is a build
  failure, not a code-review comment.
- **A WebAssembly chess engine in the browser**, cross-origin isolated on GitHub Pages through its own
  service worker, and kept honest by the app's own rules engine refereeing every move it plays.
- **CI/CD on GitHub Actions**: checks, then acceptance tests against a production build, then deploy,
  then the acceptance tests again against the live site. Dependencies are exact-pinned and checked
  against a supply-chain policy.

### An AI-native workflow

- **Built with AI coding agents as everyday collaborators**, working the same test-first loop a person
  would.
- **The conventions are written for them.** An `AGENTS.md` at the root and in every package captures the
  architecture, the rules, the gotchas and the reasoning behind decisions — so an agent, or a new
  developer, starts from the same understanding and produces code that fits.
- **Research lives with the code.** Where the rules of janggi genuinely conflict between sources, the
  decision and its sources are written up in [`docs/`](docs/) and linked from the code that implements
  them.

### Code and folder structure

- **Locality over layers.** A file lives beside the one thing that uses it, and rises only as far as its
  nearest shared caller — so a file's depth tells you its blast radius before you open it.
- **One export per file, named for it**, with functions reading top-down, every type named, and folders
  named for their subject (`bikjang/`, `check/`, `scoring/`) rather than their shape.
- **The app mirrors the test DSL.** The game screen's sections and the acceptance DSL's components carry
  the same names, so a spec and the code it covers describe the screen in one vocabulary.
- **Pure, headless core.** The rules of janggi are plain TypeScript with no React, no store and no DOM —
  a state in, a state out — which is what makes them cheap to test exhaustively.

---

## For developers

React, installable as a PWA, built with Acceptance Test Driven Development.

### What's here

pnpm workspace with three packages:

- **`webapp/`** — the game, learning guide and references pages. Vite, React, Redux Toolkit, Tailwind,
  PWA.
- **`acceptance-tests/`** — the acceptance-test DSL and the specs, run by Playwright.
- **`shared/`** — code shared by both, plus the base tool config in `shared/config/`.

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

`AGENTS.md` at the root, and one per package, carry the conventions and the gotchas — for coding
agents and for people. Start there.

### The bot's engine

The bot is [Fairy-Stockfish](https://github.com/fairy-stockfish/Fairy-Stockfish), run in the browser
from the `fairy-stockfish-nnue.wasm` package. It is free software under the GPL-3.0: the app ships its
files unmodified, with its licence, at `engine/`, and talks to it over UCI. Its janggi differs from this
app's rules in places, so this app's engine decides every move the bot may play —
[`docs/bot.md`](docs/bot.md) says where and why, and why its Elo numbers are nominal.
