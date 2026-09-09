# AGENTS.md — acceptance-tests

Playwright runs the specs. Four layers, and imports only ever point downwards:

```
src/tests/                        the mapping, "@src/shared/*" and @janggi/shared, nothing else
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
          board-setting/BoardSettingDsl.ts
          board-setting/playwright/BoardSettingPlaywright.ts
          piece-set-setting/PieceSetSettingDsl.ts
          ... and so on, one folder per setting
```

**A setting is its own DSL, reached as a member of its parent** — `janggi.settings.board.setTo(...)`
rather than `janggi.settings.setBoardTo(...)`. A spec then says which control it means before it
says what to do with it, and a picker's methods, its error messages and its test ids all sit in one
folder instead of spread across a parent that grew by two methods per setting.

What stays on the parent is only what belongs to no single child: `setBothSetupsTo` and
`canChooseSetups` each reach across both armies' pickers.

A child that is only ever driven through its parent still gets its own `*Dsl`. The exception is a
component with genuinely nothing to say — none exist here today.

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

## Arrange in a `beforeEach`, assert in the `then`

**A `then` states one criterion and checks it. It does not set anything up.** Whatever a `given` or a
`when` says has happened is made to happen in a `beforeEach` on that block, so the criterion is the
only thing in the test body:

```ts
when("cho selects one of its soldiers", () => {
  beforeEach(async ({janggi}) => {
    await janggi.board.tap(1, 7);
  });

  then("the point it stands on is shown as selected", async ({janggi}) => {
    expect(await janggi.board.isSelected(1, 7)).toBe(true);
  });
```

Otherwise every sibling criterion repeats the same three lines and the one line the spec is about is
buried in them. `beforeEach` is exported from `AcceptanceCriteriaMapping` and receives the DSL and
nothing else, exactly as a criterion does — Playwright rebuilds the fixtures per test, so it runs
against the same `janggi` on a page genuinely back at the start.

**A lint rule enforces it** (`no-restricted-syntax`, in this package's `eslint.config.js`): calling a
DSL _action_ inside a `then` fails `pnpm checks`. It works because the DSL splits by name — an action
is a verb (`tap`, `hover`, `setTo`, `resizeWindowTo`), a query is not (`pieceAt`, `isSelected`,
`countPieces`). **That list cannot be derived, so adding an action to the DSL means adding it to the
rule too.**

### `given.each` / `when.each`

Where a criterion holds for every member of a set, `each` writes one suite per item:

```ts
when.each(
  EVERY_PIECE_SET,
  set => `the set in use is ${set}`,
  set => {
    beforeEach(async ({janggi}) => {
      await janggi.settings.setPieceSetTo(set);
    });

    then("it is the writing that changed and never the game", async ({janggi}) => { ... });
  },
);
```

**Playwright has no `test.each` or `describe.each`** — its answer to a parameterised test is a `for`
loop around `test()`, and `each` is that loop with the naming kept. One suite per item beats one
criterion looping inside itself: each gets its own page, a failure names the item that failed, and
the arrangement goes in a `beforeEach` instead of tripping the rule above.

Reading the list off the shared union — `PIECE_SET_NAMES` here — means a member added to the app is
covered without anyone remembering to come back. A member _removed_ is still caught, because the
`when`s naming each one individually stop compiling.

One thing bites: a list declared in the spec rather than imported must sit **above** the `given`,
not below it as a helper would. `each` runs when the file is collected, so a `const` underneath is
still in the temporal dead zone.

If the setup differs between criteria, that is a second `when`, not a shared one — see
`ChoosingABoard.test.ts`, where "the board is changed" and "the board is changed after a piece set
was chosen" are separate because the order is what one of them is about. The single exemption in the
suite is the loop in `ChoosingAPieceSet.test.ts`, where choosing every set in turn _is_ the
criterion; it carries a scoped `eslint-disable` saying so.

**The root `AGENTS.md` ban on a wrapper `describe` does not apply to these specs.** There it stops a
unit test file restating its own filename; here the `given`/`when` nesting _is_ the acceptance
criterion, and it is expected on every spec — write the full three levels even when a `given` holds
one `when`. The ban does still apply to the Vitest tests for DSL helpers, which are unit tests like
any other.

## What a spec may reach

The DSL, and nothing else — no `page`, `context`, `browser` or `testInfo`. **`@janggi/shared` is the
exception, and is meant to be used**: it holds the janggi vocabulary, so an assertion naming a piece
type or a setting is checked against the same union the app is. `{side: "cho", type: "bishop"}` and
`setPieceSetTo("Hanguul")` are both compile errors. Enforced three ways: the
argument type, `withDslOnly` rebuilding the argument object at runtime, and a lint rule banning both
Playwright and `@src/dsl/**` under `src/tests/`.

**Do not work around it.** To give a spec a new capability, add the locator work to a
`*Playwright`, then the one-line wrapper for it on the `*Dsl` beside it.

## Name a method for how it reads in a spec

A criterion should read as a sentence, so the method name has to carry its own grammar. Three
shapes, and every method is one of them:

| Shape                                  | Named                                                                | Reads as                                                 |
| -------------------------------------- | -------------------------------------------------------------------- | -------------------------------------------------------- |
| **Action** — does something to the app | a verb: `tap`, `hover`, `setTo`, `resizeWindowTo`                    | `await janggi.board.tap(1, 7)`                           |
| **Question** — answers yes or no       | `is…` / `can…`: `isSelected`, `canMoveTo`, `isFullyOnScreen`         | `expect(await janggi.board.isSelected(1, 7)).toBe(true)` |
| **Query** — fetches a value            | `get…`: `getPieceAt`, `getTurn`, `getSelectedBoard`, `getPieceCount` | `expect(await janggi.status.getTurn()).toBe("han")`      |

A bare noun phrase — `turn()`, `pieceAt()` — reads like a property that happens to need brackets,
and a verb that returns a value — `countPieces()` — reads like an instruction whose answer you are
meant to ignore. Both were renamed for that reason.

This is not only style: **the lint rule above tells an arrangement from an assertion by name**, so
the split has to stay clean. A new method that fetches a value and is not called `get…` will slip
past it.

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
