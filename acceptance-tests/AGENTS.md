# AGENTS.md — acceptance-tests

Playwright runs the specs. Four layers, and imports only ever point downwards:

```
src/tests/                        the mapping, "@src/shared/*" and @janggi/shared, nothing else
src/acceptance-criteria-mapping/  src/dsl/ and src/shared/; never src/tests/
src/dsl/                          itself and src/shared/; never upwards
src/shared/                       helpers more than one layer needs — building share keys
```

Every arrow above is a lint rule, so a violation fails `pnpm checks`.

`src/dsl/AGENTS.md` covers building the DSL (the `*Dsl`/`*Playwright` pairing, naming a DSL method,
locators). `src/tests/AGENTS.md` covers writing and organising specs (`given`/`when`/`then`,
`given.each`, fixtures, the effects specs).

## What a spec may reach

The DSL, and nothing else — no `page`, `context`, `browser` or `testInfo`. **`@janggi/shared` is the
exception, and is meant to be used**: it holds the janggi vocabulary, so an assertion naming a piece
type or a setting is checked against the same union the app is. `{side: "cho", type: "bishop"}` and
`janggi.settings.pieceSet.setTo("Hanguul")` are both compile errors. Enforced three ways: the argument
type, `withDslOnly` rebuilding the argument object at runtime, and a lint rule banning both Playwright
and `@src/dsl/**` under `src/tests/`.

**Do not work around it.** To give a spec a new capability, add the locator work to a `*Playwright`,
then the one-line wrapper for it on the `*Dsl` beside it.

## Say it in the game's own words

Assertions use the shared vocabulary from `@janggi/shared/janggi/`, never strings:

```ts
expect(await janggi.board.getPieceAt(5, 9)).toEqual({side: "cho", type: "general"});
await janggi.settings.pieceSet.setTo("Hangul");
```

`getPieceAt` parses the webapp's `data-piece` attribute back into a `Piece`, and every settings method
takes one of the built-in name unions. A misspelled army, piece or style is a compile error instead of
a spec that runs green while matching nothing.

**Test ids are spelled out, never computed.** The webapp builds an option's id from its display name;
a component that recomputed it the same way would agree with the webapp no matter what either of them
did. `Record<PieceSetName, Locator>` is what keeps the spelled-out list honest — add a set to the
shared union without a locator here and it will not compile.

## Traps

- **`.tap()` needs `hasTouch`** and the desktop project has none, so it fails there. Use `.click()`,
  which both projects run.
- **On GitHub Pages the app reloads itself once, a second or two after a first visit** — its service
  worker taking control to make the page cross-origin isolated, which Pages cannot do with headers.
  Every test's context is a first visit, so `JanggiPlaywright.open()` waits for `crossOriginIsolated`
  before a spec may touch anything. Only `:production` shows it; locally the server sends the headers.
- **The bot's engine loads once the page has settled and the bot is the opponent, and the app ships
  against the bot** — so a spec that needs the engine slow or missing (`LoadingTheBot.test.ts`) `reload`s
  first, then says `holdBackTheBotsEngine` / `cutOffTheBotsEngine`, then chooses the bot. Those bypass the
  service worker over CDP, because a route on the page never sees a request the worker answers from its
  precache — but the bypass is page-wide, not scoped to the engine request, so it must not be engaged
  until after the reload it follows: engaging it first makes the reload itself bypass the service worker,
  and on `:production`, where isolation comes only from the service worker, that reload comes back not
  cross-origin isolated and the bot becomes unchoosable. The same bypass has to be switched off again once
  the engine is let through, and by the same CDP session that turned it on — Chromium tracks the flag per
  attaching session, so a second session's `false` does not cancel a first session's `true`. Left on, the
  engine's own worker script would keep bypassing the service worker too, and on `:production` that worker
  needs the `Cross-Origin-Embedder-Policy` header only the service worker adds — without it Chromium blocks
  the worker from starting and the bot never finishes loading. A held-back engine waits on a flag the
  _page_ carries, which `restoreTheBotsEngine` sets and a reload clears; restoring unroutes with
  `behavior: "wait"`, because switching interception off under a paused request fails it.
- **The dev server dies with the session that started it.** If every spec fails at once, check
  `curl localhost:3000` before debugging anything.
- **`playwright test --list | tail -1` gives the spec count with no dev server running** — the
  cheapest way to confirm a slice that should not have changed behaviour did not change it.

## Running

```bash
pnpm start                          # terminal 1 — the dev server: fine for a few specs, or work in progress
pnpm start:preview                  # terminal 1, instead — compile, then serve the build, for the whole suite
pnpm acceptance-tests               # terminal 2 — desktop + mobile projects
pnpm acceptance-tests --project=mobile
pnpm acceptance-tests:bot-games     # the whole game against the bot, which the line above leaves out
pnpm acceptance-tests:headed        # watch it drive
pnpm acceptance-tests:ui            # time-travel debugging
```

Any spec runs against either server. **`pnpm start` is fine while you are testing a few specs or working
on a feature** — the red-green loop, `:headed`, `:ui` — and hot reload beats a rebuild per edit there.
**Run the whole suite on `pnpm start:preview`**: the dev server transforms and serves the app module by
module, and every test opens a fresh context with nothing cached, so a full run spends most of its CPU
there, while a build is a few bundled files and is what CI tests (`ci.yml`). The build is a snapshot —
restart it after any change to the app, or you test stale code. Both are strict on port 3000, so run one
at a time or add `--port <n>`.

`WEBAPP_URL` picks the target and the `:local` / `:production` scripts set it — there is no
"environment" concept in the tests, only a URL. Failure screenshots and video land in
`test-results/` automatically, so do not write screenshot code.

`pnpm test` here is Vitest, for unit-testing DSL helpers. It excludes `src/tests/`.

## Known, not a bug

Playwright reports each test's location as `AcceptanceCriteriaMapping.ts`, because it reads the
caller of `test()` and that is our wrapper. Failure output still points at the real spec line.
