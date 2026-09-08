# AGENTS.md — the engine

`src/game/` is the rules of janggi and nothing else. Pure TypeScript: no React, no Redux, no DOM,
no clock, no I/O. A state goes in and a state comes out.

`docs/rules.md` is where those rules are written down, with sources. **Read it before changing a
move rule** — every mover cites the section it implements, and several rules are contested between
sources in ways the code had to decide.

It is not in `shared/` for a reason worth keeping: `acceptance-tests/` can import anything there, and
a spec that recomputed its expectation from the engine would agree with it whatever either of them
did. The engine needs a home the specs cannot reach.

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

Those three exports are the whole public surface; everything under `moves/` is reached through
`MovesFrom.ts`'s dispatch table.

`board/` is the one part `react/` imports, and that is deliberate: the diagonals drawn inside a
palace **are** the lines pieces travel along, so `CellShapes.ts` and `PalaceDiagonals.ts` must not
hold separate copies of that geometry.

## Conventions particular to here

- **A mover is `getLegal<Piece>Moves` and matches the `Mover` type** —
  `(pieces, from, side) => readonly Position[]`. It is handed the board already indexed and told
  which army is moving, never a whole `GameState`, so a movement rule cannot accidentally depend on
  whose turn it is. The two shared bodies — `getPalaceStepMoves`, `getStepThenTurnMoves` — take the
  same verb without the "legal", because a shared body is not any one piece's legal moves.
- **Legal means legal.** `movesFrom` filters out anything that would leave its own general
  attacked, so a pinned piece cannot step off the pin and a general cannot walk onto a covered
  point. The seven movers below it are **pseudo-legal** — `pseudoLegalMovesFrom` is what a piece
  _attacks_, which is the right question for check, because a pinned piece still gives check.
- **The filter cannot go through `applyMove`.** `applyMove` validates by asking `movesFrom`, so
  filtering with it would recurse forever. `positionAfter` is the transition with nothing checked,
  and exists for that reason.
- **`moves/utils/` holds only what two or more movers share.** A helper with one caller is a
  `function` declaration below that caller in the mover's own file — `FORWARD_RANK_STEP` belongs to
  the soldier, `slideAlong` to the chariot.
- **`movesFrom` ignores whose turn it is**, so a board can light up either army's options. The turn
  is a rule of the game and lives in `applyMove`.
- **`applyMove` throws** on an illegal move. Its input is not untrusted the way `parsePieceKey`'s is
  — the caller has just been handed the legal destinations — so an illegal move is a bug at the call
  site, not a case to thread through every caller.
- **`GameState` must stay JSON-serialisable.** `pieces` is a flat array rather than a `Map` so it
  drops into a Redux slice, `structuredClone` or storage untouched. Index it per call with
  `piecesByPosition`; never store the index.

## Testing

Every mover has a test file named after it, one `it(...)` per rule, no wrapper `describe`.

Two files are named after no export, and each says in its own header why it exists and what to
preserve when editing it:

- **`PlayingAGame.test.ts`** — one scripted game, nested so each `describe` plays a move onto its
  parent's position. Catches a loop through the rules being broken while each rule is right alone.
- **`PlayingRandomGames.test.ts`** — thousands of random legal games via fast-check, asserting what
  must hold after every move. Not run by `pnpm checks`; see the root `AGENTS.md`.

**The counts in both are derived, not recorded.** The 31 openings are worked out by hand in
`docs/rules.md` §5. If a count changes, a rule has changed — find out which before editing the
number.

## What is not modelled yet

Bikjang, the pass move, repetition, and scoring — each recorded in `docs/rules.md` §6 with its
source, and where sources disagree, the disagreement. Two need a decision before they need code.
Check and checkmate are done: `isInCheck`, `isCheckmate` and `legalMovesFor`.

A general can no longer be captured, because no move that leaves one attacked is ever offered.

There is also no move history and no captured pile, because nothing needs them yet. Adding a field
to `GameState` before a rule asks for it fixes its shape too early.

## When Redux arrives

The engine owns the rules; the store owns the state. A reducer should be one line into here:

```ts
moved: (state, action: PayloadAction<Move>) => applyMove(state, action.payload);
```

The store imports the engine, never the reverse — which the lint boundary enforces.
