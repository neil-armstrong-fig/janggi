# AGENTS.md — acceptance-tests

Playwright runs the specs. Four layers, and imports only ever point downwards:

```
src/tests/                        "@acceptance-criteria-mapping" and "@src/shared/*", nothing else
src/acceptance-criteria-mapping/  src/dsl/ and src/shared/; never src/tests/
src/dsl/                          itself and src/shared/; never upwards
src/shared/                       helpers more than one layer needs — empty for now
```

Every arrow above is a lint rule, so a violation fails `pnpm checks`.

## Every DSL object is a pair

`src/dsl/` holds two halves of each thing, side by side:

- **`<Thing>Dsl.ts`** — what a spec is allowed to say. It holds no locators. Each method is a call
  straight down into its counterpart, wrapped in a `try`/`catch` that rethrows a `DslError` naming
  the intention, so a failure reads as "Failed to read the piece at file 5, rank 2" rather than as a
  raw locator timeout. Most are one-to-one; occasionally one sequences two calls or decides
  something between them, and that exception is why the layer is written by hand.
- **`playwright/<Thing>Playwright.ts`** — the locators, clicks and waits. It catches nothing: let
  Playwright's error out and let the `*Dsl` name what was being attempted. Wrapping in both places
  buries the real cause.

```
src/dsl/
  playwright/                     BasePage, BaseComponent — shared by every playwright/ folder
  errors/DslError.ts
  janggi/
    JanggiDsl.ts
    playwright/JanggiPlaywright.ts
    components/
      board/
        BoardDsl.ts
        playwright/BoardPlaywright.ts
      settings/
        SettingsDsl.ts
        playwright/SettingsPlaywright.ts
        components/
          board-setting/playwright/BoardSettingPlaywright.ts
          piece-set-setting/playwright/PieceSetSettingPlaywright.ts
          han-setup-setting/playwright/HanSetupSettingPlaywright.ts
          cho-setup-setting/playwright/ChoSetupSettingPlaywright.ts
```

A component with no spec-facing surface of its own has no `*Dsl` half — the three pickers are
reached through `SettingsDsl`, which is the only thing a spec talks to.

The same shape repeats at every depth: a thing owns its `playwright/` counterpart, and everything
inside that thing goes in its `components/` folder. So a piece of the board would be
`janggi/components/board/components/<thing>/<Thing>Dsl.ts`, with
`janggi/components/board/components/<thing>/playwright/<Thing>Playwright.ts` beside it — no matter
how deep, a folder tells you what it is by the same two names.

**Only a `playwright/` folder may import Playwright**, and that is a lint rule rather than a
convention — a locator written in a `*Dsl` will not compile past `pnpm checks`. A `*Dsl` imports the
counterpart beside it and no other object's. `AcceptanceTestFixtures` is the single exception, since
handing the browser to the DSL has to happen somewhere.

## Where a method goes

`janggi` is the whole application and every area of it hangs off that as a member, so a spec reads
`janggi.board.pieceAt(5, 2)` or `janggi.settings.setBoardSettingTo("Neon")`.

**The root owns the browser** — opening the app, and the window it is viewed through. **Each member
answers for its own part of the screen.** A window belongs to nothing on the board, so
`resizeWindowTo` is on `JanggiDsl`; whether the board fits inside that window is a question about
the board, so `isFullyOnScreen` is on `board`. Add an area as a new member rather than as a new
fixture — a second fixture would be a second thing to navigate and keep in step.

## Writing a spec

```ts
import {expect, given, then, when} from "@acceptance-criteria-mapping";

given("a user opens the game for the first time", () => {
  when("the page has loaded", () => {
    then("the board is visible", async ({janggi}) => {
      const visible = await janggi.board.isVisible();

      expect(visible).toBe(true);
    });
  });
});
```

`given`/`when` are `test.describe`; `then` is `test`, which is why only `then` receives the DSL.

**The root `AGENTS.md` ban on a wrapper `describe` does not apply to these specs.** There it stops a
unit test file restating its own filename; here the `given`/`when` nesting _is_ the acceptance
criterion, and it is expected on every spec — write the full three levels even when a `given` holds
one `when`. The ban does still apply to the Vitest tests for DSL helpers, which are unit tests like
any other.

## What a spec may reach

The DSL, and nothing else — no `page`, `context`, `browser` or `testInfo`. Enforced three ways: the
argument type, `withDslOnly` rebuilding the argument object at runtime, and a lint rule banning both
Playwright and `@src/dsl/**` under `src/tests/`.

**Do not work around it.** To give a spec a new capability, add the locator work to a
`*Playwright`, then the one-line wrapper for it on the `*Dsl` beside it.

**A new fixture must also be named in `withDslOnly`'s destructuring**
(`AcceptanceCriteriaMapping.ts`). Playwright reads that destructuring to decide which fixtures to
build, so one missing from it is silently never constructed. There is one fixture — `janggi` — and
new areas belong on it as members rather than as fixtures of their own.

## Say it in the game's own words

Assertions use the shared vocabulary from `@janggi/shared/janggi/`, never strings:

```ts
expect(await janggi.board.pieceAt(5, 9)).toEqual({side: "cho", type: "general"});
await janggi.settings.setPieceSetTo("Hangul");
```

`pieceAt` parses the webapp's `data-piece` attribute back into a `Piece`, and every settings method
takes one of the built-in name unions. A misspelled army, piece or style is a compile error instead
of a spec that runs green while matching nothing.

**Test ids are spelled out, never computed.** The webapp builds an option's id from its display
name; a component that recomputed it the same way would agree with the webapp no matter what either
of them did. `Record<PieceSetName, Locator>` is what keeps the spelled-out list honest — add a set
to the shared union without a locator here and it will not compile.

## Locators

Locate by `data-testid` — that attribute is the contract with the webapp. Prefer waiting over
sampling, since React mounts after `goto` resolves:

```ts
await this.container.waitFor({state: "visible"}); // not locator.isVisible()
```

## Running

```bash
pnpm start                          # terminal 1 — the app under test
pnpm acceptance-tests               # terminal 2 — desktop + mobile projects
pnpm acceptance-tests --project=mobile
pnpm acceptance-tests:headed        # watch it drive
pnpm acceptance-tests:ui            # time-travel debugging
```

`WEBAPP_URL` picks the target and the `:local` / `:production` scripts set it — there is no
"environment" concept in the tests, only a URL. Failure screenshots and video land in
`test-results/` automatically, so do not write screenshot code.

`pnpm test` here is Vitest, for unit-testing DSL helpers. It excludes `src/tests/`.

## Known, not a bug

Playwright reports each test's location as `AcceptanceCriteriaMapping.ts`, because it reads the
caller of `test()` and that is our wrapper. Failure output still points at the real spec line.
