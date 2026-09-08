# AGENTS.md — the engine

`src/game/` is the rules of janggi and nothing else. Pure TypeScript: no React, no Redux, no DOM,
no clock, no I/O. A state goes in and a state comes out.

`docs/rules.md` is where those rules are written down, with sources. **Read it before changing a
move rule** — every mover here cites the section it implements, and several of the rules are
contested between sources in ways the code had to decide.

## Why it is here rather than anywhere else

- **Not in `shared/`.** `acceptance-tests/` can import anything in `shared/`, and a spec that
  recomputed its expected outcome from the engine would agree with it no matter what either of them
  did. `shared/AGENTS.md` says so directly. The engine needs a home the specs cannot reach.
- **Not in `react/`.** Rules that can only be exercised by rendering something are rules you will
  not test exhaustively, and move generation needs dozens of cases per piece.
- **Not in `redux/`.** A slice exposes actions, not functions — `getLegalChariotMoves` would be unreachable
  except through a dispatch and a selector, and `createSlice` would hand every rule an Immer
  `WritableDraft` to write against instead of a plain state.

## The boundary

Enforced by ESLint in `webapp/eslint.config.js`, so a violation fails `pnpm checks`:

| Direction                                                      | Allowed |
| -------------------------------------------------------------- | ------- |
| `react/` → `game/`                                             | yes     |
| `redux/` → `game/`                                             | yes     |
| `game/` → `react/` or `redux/`                                 | **no**  |
| `game/` → react, redux, testing-library, any framework package | **no**  |

The packages are denied by name and not only by folder, because `@src/react` was already
unreachable — `import {useMemo} from "react"` was not.

## Layout

```
NewGame.ts        newGame(hanSetup, choSetup): GameState
MovesFrom.ts      movesFrom(state, from): readonly Position[]
ApplyMove.ts      applyMove(state, move): GameState      — throws on an illegal move

types/            GameState, Move, Mover
board/            the 9x10 geometry: positions, dimensions, palaces. react/ reads this too
setups/           the five opening arrangements and the 32 pieces they produce
moves/            one generator per piece type, and what they share
```

Three exports are the whole public surface. Everything under `moves/` is reached through
`MovesFrom.ts`'s dispatch table.

`board/` is the one part `react/` imports — `Position`, `PositionKey`, `FILES`/`RANKS` and the
palace geometry. That is deliberate: the diagonals drawn inside a palace **are** the lines pieces
travel along, so `CellShapes.ts` and `PalaceDiagonals.ts` must not hold separate copies of it.

## Conventions particular to here

- **A mover is `getLegal<Piece>Moves`, and matches the `Mover` type** —
  `(pieces, from, side) => readonly Position[]`. It is handed the board already indexed and told
  which army is moving, never a whole `GameState`, so a movement rule cannot accidentally depend on
  whose turn it is. The two shared bodies behind them — `getPalaceStepMoves` for the general and
  guard, `getStepThenTurnMoves` for the horse and elephant — take the same verb without the claim,
  because a shared body is not any one piece's legal moves.
- **"Legal" currently means "legal ignoring check"**, which is the whole of the rules the engine
  models. Once check detection lands, a move that leaves its own general attacked will have to be
  filtered out of these, and until then the name promises slightly more than it delivers. That
  filtering belongs in one place — `movesFrom` — rather than in seven.
- **`moves/utils/` holds only what two or more movers share.** A helper with one caller is a
  `function` declaration below that caller in the mover's own file — `FORWARD_RANK_STEP` belongs to
  the soldier, `slideAlong` to the chariot.
- **`movesFrom` ignores whose turn it is**, so a board can light up either army's options. The turn
  is a rule of the game and lives in `applyMove`.
- **`applyMove` throws** on an illegal move. Its input is not untrusted the way `parsePieceKey`'s
  is — the caller has just been handed the legal destinations — so an illegal move is a bug at the
  call site, not a case to thread through every caller.
- **`GameState` must stay JSON-serialisable.** `pieces` is a flat array and not a `Map` precisely so
  it can drop into a Redux slice, `structuredClone` or storage untouched. Index it per call with
  `piecesByPosition`; never store the index.

## Testing

Every mover has a test file named after it, holding one `it(...)` per rule, with no wrapper
`describe` — the root `AGENTS.md` convention.

`PlayingAGame.test.ts` is the deliberate exception, and the only file here not named after an
export. It drives the engine from outside the way a caller would: start a game, ask what may happen,
apply one of those things, feed the result back in. A rule can be individually correct while the
loop through it is broken, and that is what this catches.

It is nested like an acceptance spec — each `describe` plays one move onto the position its parent
left behind, and asserts only what that move changed, so two `describe`s at the same level branch
from one position rather than replaying the opening by hand. **The ban on a wrapper `describe` does
not apply to it**: that rule stops a unit test file restating the one export it is named after, and
this file is named after no export, while every level below has a genuinely different setup — the
grouping the same rule calls earned.

**Keep its counts honest.** They are derived, not recorded: the 31 openings are worked out by hand
in `docs/rules.md` §5, and the 961 positions after two moves from the fact that no opening cho has
changes what han may do. If a count changes, a rule has changed — find out which before editing the
number. Removing the cannon-screen restriction, or letting a soldier retreat, each fails three of
these tests.

`PlayingRandomGames.test.ts` is the other half of it, and uses **fast-check**. It plays thousands of
random legal games and asserts what must be true of every move whatever it was — turn alternation,
capture accounting, no two pieces on a point, no piece transmuting, generals never leaving their
palace, soldiers never losing ground, and that a replayed move list reproduces the game exactly. It
closes with a count of the games following each opening move, checked against its own mirror image.

Why it earns a dependency: chess validates move generation with a **perft** — from one position,
generate every legal move, recurse to a fixed depth, count the positions reached, and compare
against a published table. The count is exquisitely sensitive, so one wrong rule anywhere changes
it. **Janggi has no such table** — the Chess Programming Wiki carries them for chess, shogi and
xiangqi and nothing for janggi. With no external oracle to compare a count against, invariants that
hold in every position are the strongest check available, and fast-check's shrinking is what turns a
failure into something you can read.

It is **not** run by `pnpm checks`, and that is the point of it — a fresh seed every run means a
failure is not reproducible from the same commit, so it must not gate a deploy. `pnpm test:properties`
runs it, and `.github/workflows/property-tests.yml` runs it per push, nightly, and on demand, going
red without blocking anything. Run it yourself before finishing work in here.

Three things to preserve if you touch it:

- **Games are generated as indices into the legal move list**, not as squares, so every game is legal
  by construction and nothing is discarded. Shrinking then collapses a 40-move failure to the few
  moves that matter.
- **Failures rethrow naming the moves played.** fast-check's own counterexample is a list of raw
  integers; the `Caused by:` line turns it into `After f5r9-f4r9, f1r1-f1r2, …`. Without that a
  failure is a puzzle.
- **The mirror count only holds for a symmetric setup.** Inner, Outer and Central Chariot are
  left-right symmetric; Left and Right Elephant are asymmetric by definition and the same assertion
  is false for them. Verified against the engine, not assumed.

## What is not modelled yet

Check and checkmate, bikjang, the pass move, repetition, scoring and Han's 1.5 덤 — every one is
recorded in `docs/rules.md` §6 with its source and, where the sources disagree, with the
disagreement spelled out. Two of them need a decision before they need code.

There is also no move history and no captured pile, because nothing needs them yet. Adding a field
to `GameState` before a rule asks for it fixes its shape too early.

## When Redux arrives

The engine owns the rules; the store owns the state. `GameSlice.ts` — still a `status: "idle"`
placeholder — should hold a `GameState`, and its reducers should each be one line calling in here:

```ts
moved: (state, action: PayloadAction<Move>) => applyMove(state, action.payload);
```

The store imports the engine and never the reverse. The lint block above is what keeps that arrow
pointing one way.

## Commands

```bash
pnpm --filter @janggi/webapp exec vitest run src/game
pnpm --filter @janggi/webapp exec eslint src/game
```
