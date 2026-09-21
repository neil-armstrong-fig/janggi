# AGENTS.md — dsl

`src/dsl/` holds two halves of each thing, side by side:

- **`<Thing>Dsl.ts`** — what a spec is allowed to say. It holds no locators. Each method is a call
  straight down into its counterpart, wrapped in a `try`/`catch` that rethrows a `DslError` naming
  the intention, so a failure reads as "Failed to read the piece at file 5, rank 2" rather than as a
  raw locator timeout. Most are one-to-one; occasionally one sequences two calls or decides something
  between them, and that exception is why the layer is written by hand.

  **It takes a `Page` and builds its own counterpart with it, privately, in the constructor** — and
  that is the only thing it may do with a page. It never keeps one, so the page is out of scope in
  every method and the browser can only be reached through the counterpart — both are lint rules:
  `Page` is the single name a `*Dsl` may import from `@playwright/test`, and storing it or reaching
  `this.page` is a `no-restricted-syntax` error. This is what keeps the pairing genuinely one-to-one:
  a parent used to have to hold its children's `*Playwright` objects to pass them down, which put a
  construction detail in its public API. Now a parent builds its children from the same page it was
  given, and a `*Playwright` is nobody's parent.

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
rather than `janggi.settings.setBoardTo(...)`. A spec then says which control it means before it says
what to do with it, and a picker's methods, its error messages and its test ids all sit in one folder.
What stays on the parent is only what belongs to no single child: `setBothSetupsTo` and
`canChooseSetups` each reach across both armies' pickers, and `startNewGame` presses the button under
them.

**The settings live in a sheet that is closed until it is opened**, and no spec ever opens it. Every
settings `*Playwright` extends `SettingsSheetComponent`, whose `inSheet` opens the sheet, acts, and
closes it again — so a spec that chooses a setting reads exactly as it did before there was a sheet.
The sheet's sections fold too, so `inSheet` unfolds the section holding the control it is about to
press, and folds it away again after — the fixture turns effects down before every spec, so anything
left open would be every spec's starting state.

A child that is only ever driven through its parent still gets its own `*Dsl`. The same shape repeats
at every depth: a thing owns its `playwright/` counterpart, and everything inside that thing goes in
its `components/` folder — no matter how deep, a folder tells you what it is by the same two names.

**This tree and the app's are deliberately the same shape.** `janggi/components/` is `board/`,
`record-sheet/`, `settings/` and `status/`, matching the four sections
`webapp/src/react/pages/game/components/` is divided into. The specs had the better vocabulary first
— split or rename a section on one side and do the same on the other, or the two drift apart.

**Only a `playwright/` folder may import Playwright**, and that is a lint rule rather than a
convention — a locator written in a `*Dsl` will not compile past `pnpm checks`. The one exception is
the `Page` a `*Dsl` names in its constructor, above. `AcceptanceTestFixtures` is exempt from all of
it, since handing the browser to the DSL has to happen somewhere.

`JanggiPlaywright` and `SettingsPlaywright` are worth looking at for what a `*Playwright` is **not**:
neither holds another component. Each owns only its own part of the screen, and the areas beneath
them are built by their own `*Dsl`s.

## How a `*Dsl` is laid out

The counterpart first, then the children, and the constructor in the same order as the members — so
the two read down the file the same way:

```ts
export class SettingsDsl {
  private readonly settings: SettingsPlaywright;

  readonly board: BoardSettingDsl;
  readonly pieceSet: PieceSetSettingDsl;

  constructor(page: Page) {
    this.settings = new SettingsPlaywright(page);

    this.board = new BoardSettingDsl(page);
    this.pieceSet = new PieceSetSettingDsl(page);
  }
```

The blank line is the point: **the counterpart and the children are two different things.** The first
is this object's own half of the pair, private and the only route to the browser; the rest are areas
of the screen that happen to hang off this one, public because a spec reaches them by name. A `*Dsl`
with no children — every picker — is the same rule with nothing after the blank line.

**`*Playwright` constructors take the page and set up locators; some take it and do nothing else.**
`BasePage` and `BaseComponent` both declare a `protected` constructor, so a subclass with no locators
of its own still has to write `constructor(page) { super(page) }` to be constructible at all —
`JanggiPlaywright` is that case today, and says so in a comment, or it reads as deletable boilerplate.

**A `*Playwright` file puts its constants above the class and keeps class-owned detail inside the
class.** Implementation used only by that adapter is a private method, immediately below its caller
(or below its smallest contiguous group of callers) — not a loose function after the class. If the
detail gets complex enough to obscure the adapter, move it beneath the `playwright/` folder in a
subject-named subfolder; use `utils/` only as the last resort, following the webapp's own locality
rule.

**A `*Playwright` keeps no state between calls.** Its members are locators and helpers; every other
method is a pure act on, or question of, the page, and what it needs to know comes from the webapp —
the DOM, the URL, or a flag the page itself carries — never from a field written by an earlier call.
A spec's steps can then be reordered, repeated or split across a `beforeEach` without the object
disagreeing with the browser, which is the one thing a stale field can do.

## Where a method goes

`janggi` is the whole application and every area of it hangs off that as a member, so a spec reads
`janggi.board.getPieceAt(5, 2)` or `janggi.settings.board.setTo("Neon")`.

**The root owns the browser** — opening the app, and the window it is viewed through. **Each member
answers for its own part of the screen.** A window belongs to nothing on the board, so
`resizeWindowTo` is on `JanggiDsl`; whether the board fits inside that window is a question about the
board, so `isFullyOnScreen` is on `board`. Add an area as a new member rather than as a new fixture —
a second fixture would be a second thing to navigate and keep in step.

## Naming a DSL method

A criterion should read as a sentence, so the method name has to carry its own grammar. Three shapes,
and every method is one of them:

| Shape                                  | Named                                                                | Reads as                                                 |
| -------------------------------------- | -------------------------------------------------------------------- | -------------------------------------------------------- |
| **Action** — does something to the app | a verb: `tap`, `hover`, `setTo`, `resizeWindowTo`                    | `await janggi.board.tap(1, 7)`                           |
| **Question** — answers yes or no       | `is…` / `can…`: `isSelected`, `canMoveTo`, `isFullyOnScreen`         | `expect(await janggi.board.isSelected(1, 7)).toBe(true)` |
| **Query** — fetches a value            | `get…`: `getPieceAt`, `getTurn`, `getSelectedBoard`, `getPieceCount` | `expect(await janggi.status.getTurn()).toBe("han")`      |

A bare noun phrase (`turn()`, `pieceAt()`) reads like a property that happens to need brackets, and a
verb that returns a value (`countPieces()`) reads like an instruction whose answer you're meant to
ignore — both were renamed for that reason. This is not only style: `src/tests/AGENTS.md`'s
action-in-a-`then` lint rule tells an arrangement from an assertion **by this name**, so a new method
that fetches a value and is not called `get…` will slip past it.

**A new fixture (or a new area) must be named in `withDslOnly`'s destructuring**
(`AcceptanceCriteriaMapping.ts`). Playwright reads that destructuring to decide which fixtures to
build, so one missing from it is silently never constructed. There is one fixture for the app —
`janggi` — and new areas belong on it as members rather than as fixtures of their own. `anotherDevice`
— the app open in a second browser context, for a spec that plays a game between two copies of it —
is the one other fixture there is; `src/tests/AGENTS.md` has how it's used.

## Locators

Locate by `data-testid` — that attribute is the contract with the webapp. `testid-contract.md` in
this folder spells the whole contract out (kept as prose rather than a count, because a count went
stale twice). Prefer waiting over sampling, since React mounts after `goto` resolves:

```ts
await this.container.waitFor({state: "visible"}); // not locator.isVisible()
```

## Traps

- **`getCharacterAt` reaches into a piece's `<text>` element.** It's the one DSL method coupled to how
  a piece is rendered rather than to a `data-` attribute, and it's what makes the piece sets testable
  at all — it breaks if a glyph stops being `<text>`.
- **A piece is wrapped in three layers** — hidden while its flight is shown, playing a flourish, and
  lifted in hand — and two effects queries lean on that. `isPieceRaisedAt` reads the `scale` of the
  piece's own parent, the lift layer; `isPieceFullyShownAt` multiplies the opacity of every ancestor,
  since the hiding happens a layer up from the piece. Reorder the layers and both need changing.
