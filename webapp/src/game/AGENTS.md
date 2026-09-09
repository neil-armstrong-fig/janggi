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
CanPass.ts        canPass(state): boolean
Pass.ts           pass(state): GameState                 — throws when the turn may not be rested
OutcomeOf.ts      outcomeOf(state): Outcome              — how the game ended, or that it has not
MaterialFor.ts    materialFor(state, side): number       — the piece score, no 덤 in it
ScoreFor.ts       scoreFor(state, side): number          — that plus Han's 덤

types/            GameState, Move, Mover, Outcome
board/            the 9x10 geometry: positions, dimensions, palaces. react/ reads this too
setups/           the five opening arrangements and the 32 pieces they produce
moves/            one generator per piece type, and what they share
```

Those are the whole public surface; everything under `moves/` is reached through `MovesFrom.ts`'s
dispatch table.

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
- **A pass is not a `Move` and is not in `legalMovesFor`** — "한수 쉼은 행마(수)에 해당하지
  않으며". It has its own entry point, `pass`, with `canPass` standing to it as `movesFrom` stands
  to `applyMove`. Keeping it out of the move list is what leaves the 31 openings and `isCheckmate`
  saying what they always said.
- **A result is derived, never stored.** `outcomeOf` reads the position and the pass count;
  `GameState` carries no result, the same way it carries no "in check". The one thing it does carry
  is `consecutivePasses`, because a rested turn leaves no mark on the board to read it off.
- **Material is summed off the board.** Every setup deals the same sixteen pieces, so what is
  missing is what was taken and there is no captured pile to keep. `materialFor` is the piece score
  bikjang's threshold will want; `scoreFor` is that plus the 덤, which is what a game is won on.
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

Bikjang and repetition, both recorded in `docs/rules.md` §6.2 and §6.4 with their sources and the
disagreement between them. Bikjang needs the casual-or-scored setting decided before it needs code;
repetition needs a position history, which `GameState` still does not carry. Everything else is
done — check and checkmate, the pass move, and scoring.

A general can no longer be captured, because no move that leaves one attacked is ever offered.

There is no move history and no captured pile. Adding a field to `GameState` before a rule asks for
it fixes its shape too early — `consecutivePasses` is there because a rule asked.

## When Redux arrives

The engine owns the rules; the store owns the state. A reducer should be one line into here:

```ts
moved: (state, action: PayloadAction<Move>) => applyMove(state, action.payload);
```

The store imports the engine, never the reverse — which the lint boundary enforces.

`GameStatusOf.ts` relays `outcomeOf` rather than deciding a result of its own, and adds only the one
state the engine has no opinion about — a general under attack while the game goes on. **How a game
ends is this package's to say**, and a second copy of it up there is exactly what would drift.

One thing the engine deliberately does not do for the board: `legalMovesFor` keeps answering after
two rested turns have stopped the game, because `isCheckmate` asks it whether a check has any reply
and that question is about the position rather than about whether anyone is still playing. The board
closes itself over the top, in `react/…/board/utils/GameIsOver.ts`.
