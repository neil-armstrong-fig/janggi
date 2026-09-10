# AGENTS.md — the engine

`src/game/` is the rules of janggi, and `record/` beside them for stepping back through a game. Pure
TypeScript either way: no React, no Redux, no DOM, no clock, no I/O. A state goes in and a state
comes out.

`docs/rules.md` is where those rules are written down, with sources. **Read it before changing a
move rule** — every mover cites the section it implements, and several rules are contested between
sources in ways the code had to decide.

It is not in `shared/` for a reason worth keeping: `acceptance-tests/` can import anything there, and
a spec that recomputed its expectation from the engine would agree with it whatever either of them
did. The engine needs a home the specs cannot reach.

## Layout

```
NewGame.ts        newGame(hanSetup, choSetup, format): GameState
MovesFrom.ts      movesFrom(state, from): readonly Position[]
LegalMovesFor.ts  legalMovesFor(state): readonly Move[]
ApplyMove.ts      applyMove(state, move): GameState      — throws on an illegal move
IsInCheck.ts      isInCheck(state, side): boolean
IsCheckmate.ts    isCheckmate(state, side): boolean
CanPass.ts        canPass(state): boolean
Pass.ts           pass(state): GameState                 — throws when the turn may not be rested
IsBikjang.ts      isBikjang(state): boolean              — the two generals facing down an open file
CanCallBikjang.ts canCallBikjang(state): boolean
CallBikjang.ts    callBikjang(state): GameState          — throws when there is no call to make
IsRepetition.ts   isRepetition(state): boolean           — this position standing a third time
OutcomeOf.ts      outcomeOf(state): Outcome              — how the game ended, or that it has not
MaterialFor.ts    materialFor(state, side): number       — the piece score, no 덤 in it
ScoreFor.ts       scoreFor(state, side): number          — that plus Han's 덤

types/            GameState, Move, Mover, Outcome, Standing
board/            the 9x10 geometry: positions, dimensions, palaces. react/ reads this too
setups/           the five opening arrangements, the phase in which the two players
                  choose them, and the 32 pieces they produce
moves/            one generator per piece type, and what they share
record/           taking a game back and playing it forward again
```

`record/` is the one folder here that is not a rule of janggi:

```
record/types/PlayedGame.ts   { past, present, future } — positions, not moves
record/PlayedGameFrom.ts     playedGameFrom(game): PlayedGame
record/PlayMove.ts           playMove(played, move): PlayedGame   — throws exactly as applyMove does
record/RestTurn.ts           restTurn(played): PlayedGame         — throws exactly as pass does
record/CanUndo.ts            canUndo(played): boolean
record/Undo.ts               undo(played): PlayedGame             — throws when there is nothing to undo
record/CanRedo.ts            canRedo(played): boolean
record/Redo.ts               redo(played): PlayedGame             — throws when there is nothing to redo
record/CallBikjangIn.ts      callBikjangIn(played): PlayedGame    — throws exactly as callBikjang does
```

`setups/` holds the phase before the game, which **is** a rule of janggi — `docs/rules.md` §6.6:

```
setups/types/SetupPhase.ts        { format, hanSetup, choSetup } — what each player has chosen
setups/SetupPhaseFor.ts           setupPhaseFor(format): SetupPhase    — nobody has chosen yet
setups/CanPlace.ts                canPlace(phase, side): boolean
setups/Place.ts                   place(phase, side, setup): SetupPhase — throws
setups/IsArranged.ts              isArranged(phase): phase is ArrangedSetupPhase
setups/NewGameFrom.ts             newGameFrom(phase): GameState        — throws until arranged
setups/ElephantPairingOf.ts       elephantPairingOf(hanSetup, choSetup): ElephantPairing | undefined
                                  (the two names are `@janggi/shared` vocabulary; the rule is here)
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
  and exists for that reason — do not "simplify" it away.
- **`moves/utils/` holds only what two or more movers share.** A helper with one caller is a
  `function` declaration below that caller in the mover's own file — `FORWARD_RANK_STEP` belongs to
  the soldier, `slideAlong` to the chariot.
- **`movesFrom` ignores whose turn it is**, so a board can light up either army's options. The turn
  is a rule of the game and lives in `applyMove`. That makes it a **precondition on the caller**: a
  point offered by `movesFrom` is only playable if the caller asked about a piece the army to move
  owns. `useMoveSelection` re-derives what it holds on every render for exactly this reason — a
  piece held across an undo is one the position no longer agrees is anybody's, and offering its
  moves would light up points `applyMove` then throws on.
- **A pass is not a `Move` and is not in `legalMovesFor`** — "한수 쉼은 행마(수)에 해당하지
  않으며". It has its own entry point, `pass`, with `canPass` standing to it as `movesFrom` stands
  to `applyMove`. Keeping it out of the move list is what leaves the 31 openings and `isCheckmate`
  saying what they always said.
- **A result is derived, never stored.** `outcomeOf` reads the position, the pass count and whether
  a bikjang was called; `GameState` carries no result, the same way it carries no "in check".
- **A field arrives on `GameState` when a rule asks and the board cannot answer** — and not before.
  That is the whole of the bar, and all four fields below the board meet it: a rested turn, a call,
  and the fact that the general was the piece that took all leave the pieces exactly as they were,
  and which of the two match formats is being played is not a fact about the position at all.
  `seen` is the same test applied to history — a position the game has left behind is gone from the
  board by definition.
- **The format is dealt, not threaded.** It cannot change mid-game any more than a back rank can, so
  `newGame` takes it and it rides on the state, rather than becoming a second argument to
  `outcomeOf`, `canPass`, `applyMove` and everything in `record/`. It is asked for rather than
  defaulted, because `docs/rules.md` §6.2's whole point is that picking a reading silently decides
  the game for every player.
- **The setup phase is a phase, not a position.** `SetupPhase` wraps the two choices and the format
  the way `PlayedGame` wraps a game, and `GameState` gained nothing — its bar ("a rule asked and the
  board cannot answer") is not even reached, because before the game there is no board. The order —
  Han lays out first and may not revise, Cho answers and may keep answering — is a regulation of
  official play, so `canPlace` enforces it in the **scored** format alone and a casual game keeps
  choosing freely. Neither setup is defaulted: with `DEFAULT_SETUP` already in place the rule would
  not weaken, it would vanish, and every test of it would pass saying nothing.

- **The elephant pairing is classified, and nothing is barred.** `elephantPairingOf` says whether two
  arrangements come to 맞상 or 엇상 and refuses no one, which is `isRepetition`'s posture — the ban
  on 맞상 in official play is a professional's claim with no rulebook text behind it
  (`docs/opening-setups.md` §5.4). It reads the elephant _files_ rather than the setup's name,
  because which shape a name denotes is the one thing that research rates Low confidence.

- **Bikjang is called, and repetition is reported.** Neither ends a game on its own. `callBikjang`
  is an entry point beside `pass` for the same reason `pass` is one beside `applyMove` — a player
  does it, and it moves nothing — and `isRepetition` answers a question without acting on it,
  because who is at fault in a repetition is clause ②'s judgement about intent and there is no
  referee here. What the engine _does_ do is refuse the move that would make one, in `movesFrom`,
  so that a board never lights up a point `applyMove` would then throw on.
- **Material is summed off the board.** Every setup deals the same sixteen pieces, so what is
  missing is what was taken and there is no captured pile to keep. `materialFor` is the piece score
  bikjang's threshold will want; `scoreFor` is that plus the 덤, which is what a game is won on.
- **`applyMove` throws** on an illegal move. Its input is not untrusted the way `parsePieceKey`'s is
  — the caller has just been handed the legal destinations — so an illegal move is a bug at the call
  site, not a case to thread through every caller.
- **`GameState` must stay JSON-serialisable.** `pieces` is a flat array rather than a `Map` so it
  drops into a Redux slice, `structuredClone` or storage untouched. Index it per call with
  `piecesByPosition`; never store the index.
- **A record keeps positions, not moves.** Undo is then a step between three lists with nothing to
  replay, and a list of moves would have had to carry the `Move | "pass"` union the pass move was
  kept out of `Move` to avoid. `PlayedGame` wraps `GameState` and is never a field on it — taking a
  game back is not a rule, so nothing in `types/GameState.ts` changed to allow it. `past` happens to
  be the position list repetition will want (`docs/rules.md` §6.4); that is an observation, not a
  reason, and nothing is shaped for it.
- **`undo` and `redo` never ask `outcomeOf`, and must not learn to.** `applyMove` and `pass` both
  refuse once the game is decided; undo is what a player reaches for _because_ it is decided —
  taking back the move that delivered 외통, or the second rested turn that settled the game on
  points. Nothing is recomputed to do it: the position being restored was legal when it was played
  and is the same value still. A guard added there by analogy would be a real bug, and
  `PlayingAGame.test.ts` has two blocks that catch it.
- **`playMove` and `restTurn` stay two verbs**, for the reason `applyMove` and `pass` are two: a
  rested turn is not a move. What they leave behind is a position either way, which is why `undo`
  takes one back without knowing which it undid, and why undo is one ply rather than one round.

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

**Construct an interesting position; do not search for a line to it.** Walking `legalMovesFor` for
a check was tried and works, but the shortest one is 3 plies deep and needs Han to walk its general
out for no reason, which reads as nonsense in a test — and a mate is far deeper than that. Keep the
one fact the search bought, that **no check exists before ply 3**, and build everything else piece
by piece in a `beforeEach`. Construction is what bought a mate played into, a general stepping out
of check, and a cannon that gives check only once a soldier steps across to screen it.

**fast-check's arrays are biased short**, so at the default RUNS most generated games end after a
few plies and never reach a capture at all. Every property keyed on "did this move take a piece" is
therefore weaker than it looks — a mutation that stopped a capture clearing the repetition history
passed the whole property suite, and only bit at RUNS=500. Raise RUNS when you are touching capture
behaviour, and do not read a green default run as cover.

**There is no perft table for janggi.** Chess, shogi and xiangqi all have published counts of the
positions reachable in N moves; janggi has none, which is why invariants over random games carry the
property suite instead of an external oracle. The one oracle that exists is Fairy-Stockfish, which
supports janggi and ships `tests/perft.sh` — worth a one-off offline cross-check of movement-only
counts, never CI: it is a C++ binary, and its janggi takes positions on the endgame rules
`docs/rules.md` §6 records as contested.

**The two filters in `movesFrom` are what the suite costs.** The check filter made the properties
about 7x slower and repetition another 1.9x on top, so `vitest.properties.config.ts` sets a 300s
`testTimeout` — Vitest's 5s default is a unit-test clock, and one property plays every game twice.
If it ever has to be faster, **the fix is not to weaken the rule**: the standing `positionAfter`
appends is the parent's and identical for every candidate, so counting a candidate's standing in
`state.seen` rather than `after.seen` gives the same answer and lets the append move out into
`applyMove` and `pass`, leaving the check filter's throwaway positions free. It has been left where
it is because `positionAfter` is the one place a transition is described.

## What is not modelled yet

Nothing that is a rule of play, and nothing about a position either. What `docs/rules.md` §6 still
lists is 묵장 and 자장, and that is the whole of it: they are tournament rules about human mistakes —
a check both players overlooked, and a general moved into one — rather than rules about a board.
Neither can arise on screen anyway, because a move that overlooks a check is never offered.

Everything else is here: the seven pieces, check and checkmate, the pass move, scoring, bikjang and
repetition.

A general can no longer be captured, because no move that leaves one attacked is ever offered.

There is no move history and no captured pile **on `GameState`**. Adding a field to it before a rule
asks for one fixes its shape too early — `consecutivePasses` is there because a rule asked, and
`record/` keeps its positions in a wrapper around `GameState` precisely so that undo did not have to
put a second one there.

## The store above it

The engine owns the rules; the store owns the state, and a reducer is one line into here:

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
