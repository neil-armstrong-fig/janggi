# AGENTS.md — webapp

Vite + React 19 + Redux Toolkit + Tailwind v4, client-side rendered, installable as a PWA.

## Layout

```
src/main.tsx          entry — createRoot + <Provider store>
src/react/            components, nested by who uses them
src/redux/            Store.ts, typed Hooks.ts, one folder per slice
src/game/             the janggi engine — rules, move generation, game state. No React, no Redux
src/index.css         Tailwind import + the base layer
```

`src/game/` is the bottom of this package's dependency graph and has its own `AGENTS.md` — read it
before touching a rule.

`src/react/` follows the locality rule from the root `AGENTS.md`. The same folder set recurses at
every level, and a folder only appears once something needs it:

```
src/react/
  App.tsx                    the shell — routing and providers
  pages/
    <page>/
      <Page>.tsx
      components/
        <thing>/
          <Thing>.tsx
          components/        components only <Thing> renders, each in its own folder
          hooks/
            <UseThing>.ts    hooks only <Thing> calls, with its .test.ts beside it
            utils/           helpers only <UseThing> calls
          types/
          utils/             plain functions, each with its .test.ts beside it
```

Anything shared by two siblings moves up to the folder that contains them both, and no higher.

Name a folder for what is in it, not for the shape of it. Tailwind means presentation lives in the
JSX, so a folder called `styles/` reads as CSS and is almost always wrong — `board/cell-styles/`
and `board/piece-styles/` hold the data describing how cells and pieces are painted, and say so.

## Conventions

- **Mobile first.** This is played on phones; touch is the primary input. Assume a small viewport
  and check any layout work against the `mobile` acceptance-test project.
- **Every component gets its own file, in its own folder** — `components/<thing>/<Thing>.tsx` — no
  matter how small it is or how few callers it has. A one-caller button is still its own folder.
  This is the one place the root `AGENTS.md` rule about declaring functions below their callers does
  not apply: that is for plain functions. Inline a component only where extracting it would be
  actively misleading, and leave a comment saying why.
- **A component's props interface is called `Props`, and is not exported.** One component per file
  means there is nothing to collide with, so `BoardProps` only says twice what the filename already
  says once. A generic component constrains it against a named type rather than an inline one —
  `Props<Option extends WithName>` in `option-picker/`, never `Option extends {name: string}`.
- **Every element an acceptance test needs gets a `data-testid`.** That attribute is the contract
  with `acceptance-tests/` — renaming one breaks specs.
- Redux: use `useAppSelector` / `useAppDispatch` from `@src/redux/Hooks`, never the untyped
  `react-redux` hooks. Add state as a slice via `createSlice`.
- **A fact the engine can work out is derived where it is shown, never stored.** Check, the winner
  and each army's score are not fields on `GameState` and not slices — `GameStatusOf.ts` asks the
  engine on every render and returns one discriminated union, `Scoreboard` asks `scoreFor` the same
  way, and both are rendered straight out. Storing any of them would mean a second copy of the
  position's truth to keep in step with the position. `GameStatusOf` goes one further and relays the
  engine's own `outcomeOf` rather than deciding a result here, adding only the one state the engine
  has no opinion about — a general under attack while the game goes on.
- **The board closes when the game does.** A mate needs no help, having no legal move in it; a game
  stopped by two rested turns is full of moves the rules will not accept, so `gameIsOver` in
  `board/utils/` is asked before a piece is marked, picked up or offered anywhere. Without it the
  board lights a piece up and `applyMove` throws when it is put down.
- `BASE_PATH` sets where the app is served from (`/` locally, `/<repo>/` on GitHub Pages) and drives
  the PWA manifest's `start_url`/`scope`. Do not hardcode absolute asset paths.
- Tailwind v4 has no config file — use utilities in JSX, and put genuinely global rules in the
  `@layer base` block in `index.css`.
- Import with the `@src/*` alias. This package may import `@janggi/shared` and nothing else from
  the workspace; **`src/redux/` may not import from `src/react/`** — components depend on state,
  never the reverse — and **`src/game/` may import neither**, nor React or Redux themselves. All
  three are lint errors.
- Lint rules come from `@eslint-react/eslint-plugin` (React 19 aware, TypeScript-first) plus
  `eslint-plugin-react-hooks`. The legacy `eslint-plugin-react` is deliberately not used — do not
  reintroduce it.

## Testing

**Do not write React Testing Library tests for components or pages.** Rendering a component to
assert on its markup produces tests that restate the JSX: expensive to maintain, and they rarely
catch a real defect. Component and page behaviour is covered by the Playwright specs in
`acceptance-tests/`, which drive the real app — that is what the ATDD workflow in the root
`AGENTS.md` is for.

React Testing Library **is** used for hooks. `renderHook` on a custom hook is a genuine unit test:
a hook has inputs, state transitions and a return value, and none of that is reachable from an
acceptance test except through a page.

**Where a state cannot be _reached_ by tapping, unit test the pure function underneath it** and let
the acceptance spec cover only what a player can actually do. A checkmate is far deeper than anyone
can tap out, so `WinningAGame.test.ts` drives a real check through the UI and stops there, while
`GameStatusOf.test.ts` beside the component covers the win. Do that rather than adding a way to seed
a position: a test-only door into the app is shipped code no player can reach, and every spec then
leans on it instead of on the app.

| Code                                 | Tested by                                |
| ------------------------------------ | ---------------------------------------- |
| Components and pages (`src/react/`)  | acceptance tests, not unit tests         |
| Custom hooks                         | Vitest + `renderHook`                    |
| Reducers, selectors, plain functions | Vitest, called directly — no RTL, no DOM |

**Tests run on `node`, not `jsdom`.** Building a DOM was 75% of the time a run took, and nothing
here needed one — components are not unit tested at all, and everything that is tested is a pure
function. Dropping it cut the suite to roughly a fifth of its runtime.

A hook test needs a DOM, so it opts in and pays for it alone, with two lines of its own at the top:

```ts
// @vitest-environment jsdom
import "@src/testing/SetupDomTest";
```

The docblock gives that one file a DOM; the import brings the jest-dom matchers and the `cleanup`
that unmounts between tests. Both are needed — forget the import and the matchers are simply
missing, which is what the first failure will say. `@testing-library` stays installed and
`renderHook` works exactly as before.

## The board

`src/react/pages/game/components/board/` is the only substantial thing here so far. Two style
systems, the same shape, side by side:

```
cell-styles/     how an intersection is painted — BoardStyle over CellStyle
piece-styles/    how a piece is painted — PieceSetStyle over PieceStyle
  builtin/       one folder per set, each with its own marks/ beside it
```

Both are **plain data**: a default plus a map of per-position or per-piece overrides, with one
component that turns that data into pixels.

A cell can carry **three marks**, and none of them is a `CellStyle` field — a board style is plain
data a user may author, and whose turn it is has no business written into one. They are overlay
elements in `Cell`: `MovableMark` rings a piece its owner may move this turn, the selected wash
fills the cell of the piece in hand, and `MoveHint` puts a dot or a ring where that piece may go.
Only the first is switchable — the "Moves" picker — because in the opening it marks most of an army,
and earns itself in check and against a pin.

`MovableMark` is a **ring at the edge of the cell, not a disc behind the piece.** A disc was the
first attempt and the modern sets killed it: their pieces are themselves discs of very nearly the
same size, so the mark was hidden by the thing it marked, and the octagonal sets only showed it
through their corners. A set may draw a piece in any shape at up to 0.94 of the cell, so a mark that
must be visible on all of them belongs outside all of them.

Everything a style needs travels inside the style —
including the marks. A `CharacterGlyphStyle` carries its own `CharacterSet` and a
`PictographGlyphStyle` its own `PictographSet`, so `CharacterGlyph` is handed one character and
`Pictograph` one path. Neither knows hanja or hangul exist, and a set someone writes can bring its
own writing or its own drawings without a line of code changing.

Built-ins are named from the unions in `@janggi/shared/janggi/settings/` — `BuiltInBoardStyle` and
`BuiltInPieceSetStyle` are the plain style types with the name narrowed. Renaming or dropping one
then breaks the acceptance tests at compile time. User-authored styles stay the plain type.

A set's marks live in a `marks/` folder beside it — `builtin/hangul/marks/`, `builtin/modern/marks/`
— except where two sets share one. Traditional and Hanja write the same characters, so those rise to
`builtin/marks/` and no further, which is the locality rule doing its job: a mark set beside a set
belongs to it, one a level up is shared.

`builtin/modern/marks/JanggiPictographs.ts` carries a provenance note. Keep it accurate: those
paths were written by hand here, not traced from anything, and that is the only reason there is no
licence attached.

The board's _geometry_ is deliberately not here. Positions, dimensions and the palaces live in
`src/game/board/`, because the rules need them too and the engine may not reach into `react/`. What
stays is only what is drawn — `CellShape`, `cellShapeAt` and `CELL_ASPECT_RATIO`. `cellShapeAt` asks
`palaceDiagonalStepsAt` for the palace X rather than working it out again, so the diagonals painted
on the board and the diagonals a chariot may run down are one list, not two.

## Current placeholders

- Nothing is persisted: a reload deals a new game.
- `option-picker/` is prototype scaffolding for choosing a style, set or setup. A real settings
  screen replaces it.
- The PWA manifest points at a single `public/icon.svg`. Proper 192px/512px PNGs including a
  maskable variant are still to do.
- No Korean font is bundled, so the character sets fall back to whatever the device has, and the
  traditional set approximates Cho's cursive script by leaning it. A self-hosted subset face would
  fix both.

## The icon

`public/icon.svg` is **generated** — do not hand-edit it. `scripts/generate-icon.mjs` draws 장기 out
of line segments and one circle, so the icon carries no font and no traced artwork, and renders the
same everywhere regardless of what Hangul fonts a device has. Change the strokes there and re-run:

```bash
pnpm --filter @janggi/webapp generate-icon
```

## Commands

```bash
pnpm --filter @janggi/webapp start      # or `pnpm start` from the root
pnpm --filter @janggi/webapp test       # Vitest — hook and plain-logic tests
pnpm --filter @janggi/webapp compile    # tsc --noEmit && vite build, output in build/
```
