# AGENTS.md — webapp

Vite + React 19 + Redux Toolkit + Tailwind v4, client-side rendered, installable as a PWA.

## Layout

```
src/main.tsx          game entry — createRoot + <Provider store>
src/References.tsx    references entry — independent of the game and store
src/react/            components, nested by who uses them
src/redux/            Store.ts, typed Hooks.ts, one folder per slice
src/game/             the janggi engine — rules, move generation, game state, and the record a
                      game is taken back through. No React, no Redux
src/audio/            the sound — synthesised effects and adaptive music. Plays what it is handed;
                      imports nothing of the game, the store or the page
src/bot/              the opponent — Fairy-Stockfish, asked only for moves the engine allows. Reads
                      the engine; never the store or the page
src/sw/               the service worker — the offline cache, and the headers the bot's engine needs
src/index.css         Tailwind import, the colour tokens, the base layer and the motion keyframes
```

`src/game/` is the bottom of this package's dependency graph and has its own `AGENTS.md` — read it
before touching a rule. `src/audio/` sits beside it knowing nothing of it — the page decides what is
heard — and has its own `AGENTS.md` too.

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
          hooks/             hooks only <Thing> calls
            <use-thing>/
              <UseThing>.ts  with its .test.ts beside it
              types/         types only <UseThing> uses
              utils/         helpers only <UseThing> calls
          <subject>/         plain functions on one subject, each with its .test.ts beside it —
                             intersections/ has movable-pieces/, last-move/ and motion/
          types/
          utils/             the last resort: a plain function no subject claims
```

**A hook gets its own folder exactly as a component does**, and what only it calls goes beneath it —
`hooks/use-haptics/utils/VibrationFor.ts`. Anything shared by two siblings moves up to the folder
that contains them both, and no higher: `cuesFor`, called by `useGameAudio` and `useHaptics`, sits
in `pages/game/hooks/utils/`.

**A page is divided into sections before it is divided into components.** `pages/game/` is
`Status`, `Board`, `Settings` and `RecordSheet`, and every control lives under whichever draws it —
`status/components/controls/components/pass-button/`, `settings/components/option-picker/`. That is the same locality
rule one level up, and it is what keeps a page's `components/` from becoming a flat list of
everything on screen; it also matches how `acceptance-tests/` already names the page, whose DSL is
`components/{board,settings,status}`. Reach for a new section when a page grows a region that is
genuinely its own, not to file loose components.

`Status` **frames** the board rather than sitting above it. It is handed the board as `children` and
puts Han's plaque above it and Cho's below, so each army's score and losses sit on its own side, with
the herald under Han's plaque, the controls under Cho's, and a result announced over the board
itself. `Settings` is a sheet that slides up over the page; whether it is open is `GamePage`'s state,
because the button that opens it is drawn by `Status`.

Naming a folder for its subject rather than its shape (root `AGENTS.md`) bites here in one
particular way: Tailwind means presentation lives in the JSX, so a folder called `styles/` reads as
CSS and is almost always wrong — `board/cell-styles/` and `board/piece-styles/` hold the data
describing how cells and pieces are painted, and say so.

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
  `Props<Option extends WithName>` in `settings/components/option-picker/`, never
  `Option extends {name: string}`.
- **Every element an acceptance test needs gets a `data-testid`.** That attribute is the contract
  with `acceptance-tests/` — renaming one breaks specs.
- Redux: use `useAppSelector` / `useAppDispatch` from `@src/redux/Hooks`, never the untyped
  `react-redux` hooks. Add state as a slice via `createSlice`. **State more than one section reads
  belongs in a slice, not in `useState` on the page** — `useState` is for what one component owns,
  like the piece in hand or whether the settings sheet is open.
- **A fact the engine can work out is derived where it is shown, never stored.** Check, the winner
  and each army's score are not fields on `GameState` and not slices — `GameStatusOf.ts` asks the
  engine on every render and returns one discriminated union, `Status` asks `scoreFor` and
  `takenFrom` the same way, and all of it is rendered straight out. Storing any of them would mean a
  second copy of the position's truth to keep in step with the position. `GameStatusOf` goes one
  further and relays the engine's own `outcomeOf` rather than deciding a result here, adding only the
  one state the engine has no opinion about — a general under attack while the game goes on.

  `playHasBegun` in `components/settings/utils/` is the same rule applied late: the store used to
  carry a `turnsTaken` counter to lock the setup pickers, and a counter that only ever climbs went
  wrong the moment a game could be taken back — a board returned to its starting position would have
  sat there with the arrangement that produced it out of reach. It reads `played.past` instead, so
  it falls again as the game does.

- **The store holds the setup phase, not two loose setups.** `state.game.phase` is the engine's
  `SetupPhase` — the format and what each army has chosen, where "has not chosen" is a real state
  and not a default. A scored game sits in it until both have laid out, and while it does there is
  no game on the board: `isArranged` is what gates the board, Pass and Bikjang, and `canPlace` is
  what locks each picker. A casual game is dealt already arranged and never sits there, because the
  order is a regulation of official play — `docs/rules.md` §6.6.

  `redux/game/dealing/board-shown-for/BoardShownFor.ts` is the one seam worth knowing. A half-laid-out board still has
  to be drawn, so it stands `DEFAULT_SETUP` in for the army that has not chosen. That is a display
  decision and stays on this side of the line — the engine refuses to know about a default, because
  a phase handed one could never be waiting on anybody.

- **The store holds a `PlayedGame`, not a `GameState`.** `state.game.played.present` is the
  position, and everything drawn takes that. The record beside it is what `UndoButton` and
  `RedoButton` act on, and those two are the only controls in here **not** gated on the game still
  being undecided — taking back the turn that ended a game is the ordinary reason to reach for one.
  `src/game/AGENTS.md` says why the engine keeps it that way.
- **The board closes when the game does.** A mate needs no help, having no legal move in it; a game
  stopped by two rested turns or by a called bikjang is full of moves the rules will not accept, so
  `gameIsOver` in `board/components/intersections/movable-pieces/game-is-over/` is asked before a piece is marked, picked up
  or offered anywhere.
  Without it the board lights a piece up and `applyMove` throws when it is put down.
- **A setting that is part of the game is dealt, not applied.** The two setups and the match format
  all go through `dealtGame`, which starts a fresh game rather than changing the one under way, and
  all three pickers lock on `playHasBegun` for the same reason: a back rank is arranged before play,
  and which of janggi's two games is being played is settled before it too. Contrast the board
  style, the piece set, the movable-piece mark, the effects, the sound effects and the music, which
  are preferences about how a game is drawn or heard: the `preferences` slice, applied the moment
  they are chosen.
- **Preferences are stored by name.** `state.preferences` holds `BoardStyleName`, `PieceSetName` and
  the rest from `@janggi/shared`, never the style objects — `src/redux/` may not import `src/react/`,
  and a name is also what a picker shows, a spec asks for and storage keeps. `usePreferences`
  (`pages/game/hooks/use-preferences/`) is the one place a name becomes what it names; read them
  through it rather than selecting `state.preferences` directly.
- **The whole store is kept on the device.** `Store.ts` loads every slice from `localStorage` and
  writes each back when it changes, so a closed page reopens on the same game, preferences and record.
  **What is read back is untrusted**: each slice has a loader under its own `storage/` that checks every
  field against the vocabulary it claims — `redux/untrusted/` — and falls back to a fresh start. The
  game is refused whole if any position fails (a crash in `applyMove` is what a half-trusted board
  buys); the ratings keep what they can. A new field on a slice needs its loader taught about it, and a
  change to a slice's shape needs its storage key's version raised.
- **A page section reads the store; a component below it takes props.** `Status`, `Board` and
  `Settings` call `useAppSelector`/`useAppDispatch` and `usePreferences` themselves, so `GamePage`
  hands them only what it works out — the moment, the sound callbacks, and whether the settings
  sheet is open, the one `useState` it keeps. Below that line every component stays pure and knows
  nothing about Redux — which is what lets `Piece`, `Cell`, `PlayerPlaque` and the rest be reasoned
  about from their props alone.
- **Something a player does that touches no intersection is a control, not a gesture.** Resting a
  turn and calling a bikjang are the two, so `PassButton` and `BikjangButton` sit in `Status`, in the
  row under the board — each enabled off a pure question the engine answers (`canPass`,
  `canCallBikjang`), and disabled rather than hidden so the row does not reflow under a thumb.
- **Marks are information; motion is an effect.** A mark says something a player needs to see — the
  last move's two points, a general under attack and each piece attacking it, a called bikjang's
  file — and is drawn however much the board may move. Motion shows a change happening — a piece flying, a
  capture landing, a shake, a deal, a lift, a rolling score, a haptic buzz — and is drawn only while
  `effects.full`. The Effects setting starts in full on every device and is the only thing that
  decides; the chrome's own small transitions still follow `motion-reduce:`. Keep the split when
  adding either: the default acceptance projects run with effects reduced and assert on marks, and
  the specs under
  `acceptance-tests/src/tests/effects/` assert on motion.
- **Motion and sound key off one moment.** `useGameMoment` compares the record the page last drew with
  the one it holds now, through the engine's `changeBetween`, and hands out a `GameMoment` whose `id`
  changes once per change. The board's flights and flourishes, the ending shake, the sound and the
  haptics all read that one moment and remember the last id they answered, so none of them runs twice
  for a change and none can disagree about what the change was. Nothing dispatches an event.

  **What that moment sounds like is decided here, not in `src/audio/`.** `cuesFor` turns it into
  cues, in `pages/game/hooks/utils/` because `useHaptics` buzzes off the same cues, and `moodOf`
  turns the position into a mood, beneath `use-game-audio/` — and the director only plays what it is
  handed. A new sound for a new rule is a change to `cuesFor`; the playback hears of it only as
  a cue name.

- **Motion is drawn over the cells, never by moving them.** A flight, a capture landing and the lines
  of a check are overlays inside the board's grid; a lift and a flourish happen inside a piece's own
  wrappers. Every cell stays exactly where the game says it is, a tap mid-flight lands on the point
  under it, and nothing an ordinary spec reads ever waits on an animation.
- `BASE_PATH` sets where the app is served from (`/` locally, `/<repo>/` on GitHub Pages) and drives
  the PWA manifest's `start_url`/`scope`. Do not hardcode absolute asset paths.
- Tailwind v4 has no config file — use utilities in JSX. The colours around the board are tokens in
  the `@theme` block in `index.css` (`bg-ground`, `text-cho`, `border-danger` and the rest), never hex
  in JSX; the motion keyframes live in that file too, and genuinely global rules go in its
  `@layer base` block. A class list that changes with state is built with `clsx` — the fixed classes
  as one string, then each conditional one as `flag && "class"` — never a template string.
- Import with the `@src/*` alias. This package may import `@janggi/shared` and nothing else from
  the workspace; **`src/redux/` may not import from `src/react/`** — components depend on state,
  never the reverse — **`src/game/` may import neither**, nor React or Redux themselves, and
  **`src/audio/` may import nothing else of this package's** — `src/game/` included — nor React,
  Redux or `@janggi/shared`. **`src/bot/` may import `src/game/` and `@janggi/shared` only** — never
  the store, the page or the sound, nor React or Redux; it has its own `AGENTS.md`.
  All five are lint errors.
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
| Playback's decisions (`src/audio/`)  | Vitest; its node graph is checked by ear |

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

**One test plays the real engine.** `pages/game/PlayingTheBotToTheEnd.test.ts` starts Fairy-Stockfish
under Node (`src/testing/CreateNodeFairyStockfish.ts`) and plays whole games between the weakest and
the strongest bot, through `botDutyFor`, `botReplyFor` and the game reducer. Its searches are capped
at 100ms, so both games take seconds. It asserts that each game ends and never who wins, because the
engine is not deterministic. `pnpm test` leaves it out, as it does the property tests:
`vitest.bot-games.config.ts` runs it (`pnpm test:bot-games`), in `.github/workflows/bot-games.yml`,
which gates no deploy.

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

A cell can carry **several marks**, and none of them is a `CellStyle` field — a board style is plain
data a user may author, and whose turn it is has no business written into one. They are overlay
elements in `Cell`: `MovableMark` rings a piece its owner may move this turn, the selected wash
fills the cell of the piece in hand, `MoveHint` puts a dot or a ring where that piece may go,
`CoverHint` a dashed ring on each piece of its own army it would land on were that point empty,
`LastMoveMark` brackets the corners of the last move's two points over a wash, and `ThreatMark` rings a
general in check and each piece attacking it. Only the first is switchable — the "Movable pieces"
picker — because in the opening it marks most of an army, and earns itself in check and against a pin.

A mark's _colours_ may still belong to the board — whether it is drawn never does. The last move is the
case: a `BoardStyle` carries `lastMove` (`LastMoveStyle` has why), because one warm wash vanished into
Classic's pale wood, and a wash alone is hidden under the piece that arrived — the brackets sit in the
corners, the one part of a cell no piece set reaches.

**The cell `<svg>` is `preserveAspectRatio="none"`,** so it stretches with the cell and a `<circle>`
drawn inside it comes out an ellipse. That is why both `Piece` and `MoveHint` use a square overlay
`div` of their own rather than another element in that svg — anything that must stay round has to
sit outside it.

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

- The PWA manifest points at a single `public/icon.svg`. Proper 192px/512px PNGs including a
  maskable variant are still to do.
- No Korean font is bundled, so the character sets fall back to whatever the device has, and the
  traditional set approximates Cho's cursive script by leaning it. A self-hosted subset face would
  fix both.

## Decided against

Written down so they are not re-opened as though they were oversights.

- **Keyboard navigation.** Mouse and touch are the interaction model here. A consequence worth
  knowing before you "fix" it: a cell is a `<button>`, and an occupied one takes its accessible name
  from the piece's own `aria-label`, so an **empty cell is a button with no accessible name**. That
  is known and accepted, not a defect.
- **Visual regression snapshots.** The board's pixels churn constantly while it is being designed,
  and a suite that goes red on every restyle teaches people to ignore it. This is why the piece sets
  are tested by character and by size rather than by appearance — and why Traditional and Hanja are
  not fully separable by acceptance test at all: they write the same characters, so a spec tells
  them apart by the selected setting plus the size distribution, and the wood-versus-disc difference
  goes uncovered.

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
pnpm --filter @janggi/webapp test:bot-games   # whole games on the real engine, left out of `test`
pnpm --filter @janggi/webapp compile    # tsc --noEmit && vite build, output in build/
```
