# AGENTS.md — acceptance-tests

Playwright runs the specs. Four layers, and imports only ever point downwards:

```
src/tests/                        the mapping, "@src/shared/*" and @janggi/shared, nothing else
src/acceptance-criteria-mapping/  src/dsl/ and src/shared/; never src/tests/
src/dsl/                          itself and src/shared/; never upwards
src/shared/                       helpers more than one layer needs — building share keys
```

Every arrow above is a lint rule, so a violation fails `pnpm checks`.

## Every DSL object is a pair

`src/dsl/` holds two halves of each thing, side by side:

- **`<Thing>Dsl.ts`** — what a spec is allowed to say. It holds no locators. Each method is a call
  straight down into its counterpart, wrapped in a `try`/`catch` that rethrows a `DslError` naming
  the intention, so a failure reads as "Failed to read the piece at file 5, rank 2" rather than as a
  raw locator timeout. Most are one-to-one; occasionally one sequences two calls or decides
  something between them, and that exception is why the layer is written by hand.

  **It takes a `Page` and builds its own counterpart with it, privately, in the constructor** — and
  that is the only thing it may do with a page. It never keeps one, so the page is out of scope in
  every method and the browser can only be reached through the counterpart. Both halves are lint
  rules: `Page` is the single name a `*Dsl` may import from `@playwright/test`, and storing it or
  reaching `this.page` is a `no-restricted-syntax` error.

  The point of doing it there rather than being handed a counterpart is that **the pairing is then
  genuinely one-to-one**. A parent used to have to hold its children's `*Playwright` objects so it
  could pass them down, which put a construction detail in its public API and made the tree read as
  `Dsl → parent Playwright → child Playwright` even though no call ever went that way. Now a parent
  builds its children from the same page it was given, and a `*Playwright` is nobody's parent.

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
`canChooseSetups` each reach across both armies' pickers, and `startNewGame` presses the button under
them.

**The settings live in a sheet that is closed until it is opened**, and no spec ever opens it. Every
settings `*Playwright` extends `SettingsSheetComponent`, whose `inSheet` opens the sheet, acts, and
closes it again — so a spec that chooses a setting reads exactly as it did before there was a sheet,
and the sheet is out of the way before the next line taps the board it would be covering. Reading a
picker needs none of that: the sheet is always in the page, only moved out of sight. The sheet's
sections fold too, so `inSheet` is handed the control it is about to press, unfolds the section
holding it, and folds it away again after — the fixture turns the effects down before every spec, so
anything it left open would be every spec's starting state.

A child that is only ever driven through its parent still gets its own `*Dsl`. The exception is a
component with genuinely nothing to say — none exist here today.

The same shape repeats at every depth: a thing owns its `playwright/` counterpart, and everything
inside that thing goes in its `components/` folder. So a piece of the board would be
`janggi/components/board/components/<thing>/<Thing>Dsl.ts`, with
`janggi/components/board/components/<thing>/playwright/<Thing>Playwright.ts` beside it — no matter
how deep, a folder tells you what it is by the same two names.

**This tree and the app's are deliberately the same shape.** `janggi/components/` is `board/`,
`record-sheet/`, `settings/` and `status/`, and those are the four sections
`webapp/src/react/pages/game/components/` is divided into. The app was brought into line with the
DSL rather than the other way round — the specs had the better vocabulary first, having always
described the page the way a player sees it. Split or rename a section on one side and do the same
on the other, or the two drift into different names for one screen.

**Only a `playwright/` folder may import Playwright**, and that is a lint rule rather than a
convention — a locator written in a `*Dsl` will not compile past `pnpm checks`. The one exception is
the `Page` a `*Dsl` names in its constructor, above; `Locator`, `expect` and the rest stay out. A
`*Dsl` builds the counterpart beside it and no other object's. `AcceptanceTestFixtures` is exempt
from all of it, since handing the browser to the DSL has to happen somewhere.

`JanggiPlaywright` and `SettingsPlaywright` are worth looking at together for what a `*Playwright`
is **not**: neither holds another component. Each owns only its own part of the screen — the browser
and the window for one, the 맞상/엇상 line and New game for the other — and the areas beneath them are
built by their own `*Dsl`s.

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

The blank line is the point: **the counterpart and the children are two different things.** The
first is this object's own half of the pair, private and the only route to the browser; the rest are
areas of the screen that happen to hang off this one, public because a spec reaches them by name.
Running them together as one block reads as though the counterpart were another child.

A `*Dsl` with no children — every picker — is the same rule with nothing after the blank line: one
private field, a one-line constructor, and no separator to draw.

**`*Playwright` constructors take the page and set up locators; some take it and do nothing else.**
`BasePage` and `BaseComponent` both declare a `protected` constructor, so a subclass that has no
locators of its own still has to write `constructor(page) { super(page) }` to be constructible at
all. `JanggiPlaywright` is the one such case today, and it says so in a comment — without it the
constructor reads as deletable boilerplate, and deleting it stops `JanggiDsl` compiling.

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
build, so one missing from it is silently never constructed. There is one fixture for the app —
`janggi` — and new areas belong on it as members rather than as fixtures of their own.

**A second device is the one other fixture.** `anotherDevice` is the app open in a second browser
context, for a spec that plays a game between two copies of it: `PlayingTheBotToTheEnd.test.ts` has
the strongest bot choose the player's moves on one, and relays every turn to the other by hand. Only
`beforeEach.withAnotherDevice` names it — named in `withDslOnly`, it would open a second context for
every spec in the suite. A test that opens one is given ten minutes, since a game played out is minutes
of bots thinking, and a spec's own helper is handed a device typed as `Janggi`, from the mapping.

That spec is left out of `pnpm acceptance-tests`: the default projects ignore `BOT_GAME_SPECS`, and
`playwright.bot-games.config.ts` (`pnpm acceptance-tests:bot-games`) runs it alone, in
`.github/workflows/bot-games.yml`, which gates no deploy.

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

### The contract, written out

Rename any of these in the webapp and specs break. Listed rather than counted, because a count of
them went stale twice while it was being kept.

- **`data-testid`, fixed** — `board`, `turn`, `piece`, `settings`, `elephant-pairing`, `result`,
  `record` (the record sheet, `inert` while closed) with `record-elo` carrying `data-elo`, and the
  controls `new-game`, `result-new-game`, `pass`, `bikjang`, `undo`, `redo`, `settings-open`,
  `settings-close`, `record-open`, `record-close`, `record-reset`, `references-open`, and the
  question reset opens, `record-reset-confirm` and `record-reset-cancel`. The progress section:
  `progress-xp` and `progress-next-unlock` carrying `data-xp`, `save-copy` and the `save-key` it shows,
  and `save-load-input`, `save-load-submit` and `save-load-message` carrying `data-accepted`. The styles
  sheet: `styles` (`inert` while closed), `styles-open`, `styles-close`, `style-import-input`,
  `-submit` and `-message` (`data-accepted`), and the editor's `style-editor-kind`, `-from`, `-name`,
  `-json`, `-save` and `-message` (`data-accepted`), or `style-editor-locked` in their place. On the
  result, `result-xp` carrying `data-xp`, and `result-unlocked`. On
  `pass`, `bikjang`, `undo` and `redo` the `disabled` attribute is part of the contract: they are
  disabled rather than hidden. `move-flight` and `impact` are drawn over the board only while motion
  is shown, and only the effects specs look for them.
- **`data-testid`, composed** — `cell-f<file>r<rank>`; `score-<side>`, `taken-<side>` and
  `plaque-<side>`, whose `plaque-player-<side>` carries `data-player` and `data-elo` and whose
  `plaque-xp-<side>` carries `data-xp` (the player's own plaque only, and the words are shortened —
  read the attribute); `record-tab-<format>` and `record-row-<elo>`, a row carrying `data-played`,
  `data-won`, `data-drawn` and `data-lost`; and `<id>-picker` with an `<id>-option-<slug>` for each
  option. The ten picker ids are `board-style`, `piece-style`, `movable-highlight`, `match-format`,
  `opponent`, `bot-strength`, `your-side`, `han-setup`, `cho-setup` and `effects`. A picker that
  explains itself — only `match-format` so far — adds an `<id>-explain` toggle, never disabled, and
  an `<id>-explanation` panel present only while unfolded. A picker of two options is a row of buttons, the chosen one carrying
  `aria-pressed`; one of more is a native `<id>-select`, whose `<option>`s carry the option ids and
  are chosen and read by their `value` — a locked option's text carries a padlock and a reason, its
  `value` never does. A locked option carries `data-locked`. Grow a picker past two options and its
  `*Playwright` must switch shape. Each of the player's own styles is a `custom-style` row carrying
  `data-kind` and `data-name`, holding `custom-style-copy`, `custom-style-key` and
  `custom-style-delete`. The two volumes, `sound-effects` and `music`, are an `<id>-volume` range input and an
  `<id>-mute` button whose `aria-pressed` is what "muted" means to a spec.
- **On a piece** — `data-piece`, written `<side>-<type>` and parsed back into a `Piece` by
  `@janggi/shared`. The pieces in a `taken-<side>` tray carry it too.
- **On a cell** — `aria-pressed` (the piece in hand), `data-can-move-to` (a legal destination),
  `data-can-be-moved` (a piece its owner may move now; the value is the emphasis, `full` or `faint`,
  and no spec asserts on which), `data-last-move` (`from` or `to`; `getLastMove` reads the two cells' ids back into a move), and `data-under-attack` and
  `data-attacking` (the general in check, and each piece giving it).
- **On the turn line** — `data-side` always, plus `data-in-check`, `data-winner`, `data-drawn`,
  `data-laying-out` and `data-bot-to-move`, each present only while it applies. `waitForTheBot` waits
  on the last.
- **On a score** — `data-score`, that army's score with the 덤 folded in. The words beside it roll to
  a new value with motion on; the attribute never does.
- **On the pairing line** — `data-pairing`.
- **On the references page** — `references`, `references-repository`,
  `references-<section>-jump`, `references-<section>-heading`, and `reference-<source>`. Its link in
  Settings is `references-open`.

The turn line's attributes are written by `TurnIndicator` from `gameStatusOf()`; nothing stores
them. `BoardPlaywright` composes the cell id to find a piece.

**An attribute that is absent and an element that is absent read the same.** A DSL question reading
`data-pairing` off a missing element gets "no pairing", which is indistinguishable from a blank row
being drawn — which is exactly how a mutation that always rendered the pairing line failed to fell
anything. Where that matters, add an `is…Shown()` question beside the value one.

### Traps

- **`.tap()` needs `hasTouch`** and the desktop project has none, so it fails there. Use `.click()`,
  which both projects run.
- **`playwright test --list | tail -1` gives the spec count with no dev server running** — the
  cheapest way to confirm a slice that should not have changed behaviour did not change it.
- **On GitHub Pages the app reloads itself once, a second or two after a first visit** — its service
  worker taking control to make the page cross-origin isolated, which Pages cannot do with headers.
  Every test's context is a first visit, so `JanggiPlaywright.open()` waits for `crossOriginIsolated`
  before a spec may touch anything. Only `:production` shows it; locally the server sends the headers.
- **The dev server dies with the session that started it.** If every spec fails at once, check
  `curl localhost:3000` before debugging anything.
- **`getCharacterAt` reaches into a piece's `<text>` element.** It is the one DSL method coupled to
  how a piece is rendered rather than to a `data-` attribute, and it is what makes the piece sets
  testable at all — it breaks if a glyph stops being `<text>`.
- **A piece is wrapped in three layers** — hidden while its flight is shown, playing a flourish, and
  lifted in hand — and two effects queries lean on that. `isPieceRaisedAt` reads the `scale` of the
  piece's own parent, the lift layer; `isPieceFullyShownAt` multiplies the opacity of every ancestor,
  since the hiding happens a layer up from the piece. Reorder the layers and both need changing.

## Motion reduced, and the effects specs

**Every ordinary spec runs with the effects turned down.** The app starts with them in full, so the
`desktop` and `mobile` projects set the `effects` option to `"Reduced"`, and the `janggi` fixture
chooses that in the settings sheet before the spec begins. Those projects also run with
`reducedMotion: "reduce"`, which stills the sheet and the plaques. Nothing flies, shakes, pops or
slides, and no spec ever waits on, or races, an animation.

**Every spec also starts with everything unlocked.** A fresh device has only the first few styles and
the weakest bot, and earning the rest is far deeper than a spec can tap, so the fixture puts the player
at a million XP with every bot beaten, through the app's debug door — `janggi.debug.setProgress(...)`,
which posts a message the app answers. A spec about the locks puts them back wherever it is about first;
those are in `src/tests/progress/`.

**Ordinary specs start against a person at the same device.** The app ships against the bot, which would
answer moves and owns one army's setup picker; leaving that implicit would make every unrelated board
criterion race an opponent it never named. The fixture therefore chooses Human through Settings. A spec
about the shipped opponent calls `useShippedOpponent()` at the top of its file and is then responsible
for the bot it kept; `DefaultState.test.ts` is the example.

**The door arranges what a player has earned, and nothing else.** Everything a player does is still done
through the screen they do it on, and the save box that sets progress by hand keeps its own criteria in
`progress/MovingYourProgress.test.ts` — keys built by `saveKeyWith`, over the app's own codec and save schema
from `@janggi/shared`. A key format is a wire contract, not a behaviour under test, so the specs share it
rather than keeping a second copy that could drift from the one the app reads.
`webapp/AGENTS.md` has why the door is allowed to exist at all.

**The specs about the motion itself live under `src/tests/effects/`** and are run only by the
`desktop-effects` and `mobile-effects` projects, which leave motion on. The default projects
`testIgnore` that folder, so the two sets never mix. Keep an effects spec to what is observable without a race:

- **Where motion leaves the board**, first — a piece fully shown once its flight lands, nothing left
  drawn over the board, a shaken board back at rest, a rolled score come to rest on the true value.
  Those are what a broken animation gets wrong, and they are deterministic.
- **That motion happened at all**, where it must be checked, by waiting for an element that lasts far
  longer than a tap takes to return — a flight, a capture landing, the board being pushed.
- **Never by sampling mid-animation.** The motion queries poll (`eventually`), wait for an element
  (`appears`), or wait for every finite animation on the page to finish (`motionSettled`) before they
  answer. A query added for motion should do one of the three.

```bash
pnpm acceptance-tests --project=desktop-effects --project=mobile-effects
```

## Running

```bash
pnpm start                          # terminal 1 — the app under test
pnpm acceptance-tests               # terminal 2 — desktop + mobile projects
pnpm acceptance-tests --project=mobile
pnpm acceptance-tests:bot-games     # the whole game against the bot, which the line above leaves out
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
