# AGENTS.md — the engine

`src/game/` is the rules of janggi, and `record/` beside them for stepping back through a game. Pure
TypeScript either way: no React, no Redux, no DOM, no clock, no I/O. A state goes in and a state comes
out.

`docs/rules.md` is where those rules are written down, with sources. **Read it before changing a move
rule** — every mover cites the section it implements, and several rules are contested between sources
in ways the code had to decide. The engine is not in `shared/` because `acceptance-tests/` can import
anything there, and a spec that recomputed its expectation from the engine would agree with it
whatever either of them did.

Five files at the root are the whole of the loop — deal a game (`NewGame.ts`), ask what a piece may do
(`MovesFrom.ts`), ask what the army may do (`LegalMovesFor.ts`), do it (`ApplyMove.ts`), and judge what
that did (`OutcomeOf.ts`). Everything else is a rule family in a folder of its own — `bikjang/`,
`check/`, `passing/`, `repetition/`, `scoring/` — and **each folder holds the question together with
the transition it guards**: `canPass` stands to `pass` as `movesFrom` stands to `applyMove`. `react/`
calls into `check/`, `passing/`, `bikjang/` and `scoring/` directly.

`setups/` holds the phase before the game, which **is** a rule of janggi (`docs/rules.md` §6.6).
`record/` is the one folder that is not a rule of janggi: a turn leaves no event behind and a record
keeps positions rather than moves, so what a turn did is derived from the positions either side of it
(`TransitionBetween.ts`, `ChangeBetween.ts`) — what the board's motion and the sound both hear.

Everything under `moves/` is reached through `MovesFrom.ts`'s dispatch table, except
`moves/CoveredFrom.ts` (the points of its own army a piece would land on were they empty), which the
board asks directly.

## Conventions particular to here

- **A new rule joins a family folder; the root is not where things land.** The five root files are the
  loop, and nothing joins them unless it is part of it.
- **A mover is `getLegal<Piece>Moves` and matches the `Mover` type** (`moves/types/Mover.ts`) —
  `(pieces, from, side) => readonly Position[]`. It is handed the board already indexed and told which
  army is moving, never a whole `GameState`, so a movement rule cannot accidentally depend on whose
  turn it is. The two shared bodies — `getPalaceStepMoves`, `getStepThenTurnMoves` — take the same
  verb without the "legal", because a shared body is not any one piece's legal moves.
- **Legal means legal.** `movesFrom` filters out anything that would leave its own general attacked,
  so a pinned piece cannot step off the pin and a general cannot walk onto a covered point. The seven
  movers below it are **pseudo-legal** — `pseudoLegalMovesFrom` is what a piece _attacks_, which is
  the right question for check, because a pinned piece still gives check.
- **The filter cannot go through `applyMove`.** `applyMove` validates by asking `movesFrom`, so
  filtering with it would recurse forever. `positionAfter` is the transition with nothing checked, and
  exists for that reason — do not "simplify" it away.
- **`moves/utils/` holds only what two or more movers share.** A helper with one caller is a
  `function` declaration below that caller in the mover's own file.
- **`movesFrom` ignores whose turn it is**, so a board can light up either army's options. The turn is
  a rule of the game and lives in `applyMove`. That makes it a **precondition on the caller**: a point
  offered by `movesFrom` is only playable if the caller asked about a piece the army to move owns.
  `useMoveSelection` re-derives what it holds on every render for exactly this reason — a piece held
  across an undo is one the position no longer agrees is anybody's.
- **A pass is not a `Move` and is not in `legalMovesFor`** — "한수 쉼은 행마(수)에 해당하지 않으며". It
  has its own entry point, `pass`, with `canPass` standing to it as `movesFrom` stands to `applyMove`.
  Keeping it out of the move list is what leaves the 31 openings and `isCheckmate` saying what they
  always said.
- **A result is derived, never stored.** `outcomeOf` reads the position, the pass count and whether a
  bikjang was called; `GameState` carries no result, the same way it carries no "in check".
- **A field arrives on `GameState` when a rule asks and the board cannot answer** — and not before.
  `seen` is the same test applied to history — a position the game has left behind is gone from the
  board by definition.
- **The format is dealt, not threaded.** It cannot change mid-game any more than a back rank can, so
  `newGame` takes it and it rides on the state, rather than becoming a second argument to every
  function. It is asked for rather than defaulted, because `docs/rules.md` §6.2's whole point is that
  picking a reading silently decides the game for every player.
- **The setup phase is a phase, not a position.** `SetupPhase` wraps the two choices and the format
  the way `PlayedGame` wraps a game. The order — Han lays out first and may not revise, Cho answers
  and may keep answering — is a regulation of official play, so `canPlace` enforces it in the
  **scored** format alone; a casual game keeps choosing freely. Neither setup is defaulted: with
  `DEFAULT_SETUP` already in place the rule would not weaken, it would vanish, and every test of it
  would pass saying nothing.
- **The elephant pairing is classified, and nothing is barred.** `elephantPairingOf` says whether two
  arrangements come to 맞상 or 엇상 and refuses no one — the ban on 맞상 in official play is a
  professional's claim with no rulebook text behind it (`docs/opening-setups.md` §5.4). It reads the
  elephant _files_ rather than the setup's name, because which shape a name denotes is the one thing
  that research rates Low confidence.
- **Bikjang is called, and repetition is reported.** Neither ends a game on its own. `callBikjang` is
  an entry point beside `pass`, and `isRepetition` answers a question without acting on it, because
  who is at fault in a repetition is clause ②'s judgement about intent and there is no referee here.
  What the engine _does_ do is refuse the move that would make one, in `movesFrom`.
- **Material is summed off the board.** Every setup deals the same sixteen pieces, so what is missing
  is what was taken and there is no captured pile to keep. `materialFor` is the piece score bikjang's
  threshold will want; `scoreFor` is that plus the 덤.
- **`applyMove` throws** on an illegal move. Its input is not untrusted the way `parsePieceKey`'s is
  — the caller has just been handed the legal destinations — so an illegal move is a bug at the call
  site, not a case to thread through every caller.
- **`GameState` must stay JSON-serialisable.** `pieces` is a flat array rather than a `Map` so it
  drops into a Redux slice, `structuredClone` or storage untouched. Index it per call with
  `piecesByPosition`; never store the index.
- **A record keeps positions, not moves.** Undo is then a step between three lists with nothing to
  replay, and a list of moves would have had to carry the `Move | "pass"` union the pass move was kept
  out of `Move` to avoid. `PlayedGame` wraps `GameState` and is never a field on it.
- **`undo` and `redo` never ask `outcomeOf`, and must not learn to.** `applyMove` and `pass` both
  refuse once the game is decided; undo is what a player reaches for _because_ it is decided — taking
  back the move that delivered 외통, or the second rested turn that settled the game on points.
  Nothing is recomputed to do it: the position being restored was legal when it was played and is the
  same value still. A guard added there by analogy would be a real bug, and `PlayingAGame.test.ts` has
  two blocks that catch it.
- **`playMove` and `restTurn` stay two verbs**, for the reason `applyMove` and `pass` are two: a rested
  turn is not a move.

## Testing

Every mover has a test file named after it, one `it(...)` per rule, no wrapper `describe`.

Two files are named after no export, and each says in its own header why it exists and what to
preserve when editing it:

- **`PlayingAGame.test.ts`** — one scripted game, nested so each `describe` plays a move onto its
  parent's position. Catches a loop through the rules being broken while each rule is right alone.
- **`PlayingRandomGames.test.ts`** — thousands of random legal games via fast-check, asserting what
  must hold after every move. Not run by `pnpm checks`; see the root `AGENTS.md`.

**The counts in both are derived, not recorded.** The 31 openings are worked out by hand in
`docs/rules.md` §5. If a count changes, a rule has changed — find out which before editing the number.

**Construct an interesting position; do not search for a line to it.** Walking `legalMovesFor` for a
check was tried and works, but the shortest one is 3 plies deep and needs Han to walk its general out
for no reason, which reads as nonsense in a test — and a mate is far deeper than that. Keep the one
fact the search bought, that **no check exists before ply 3**, and build everything else piece by
piece in a `beforeEach`.

**fast-check's arrays are biased short**, so at the default RUNS most generated games end after a few
plies and never reach a capture at all. Every property keyed on "did this move take a piece" is
therefore weaker than it looks — a mutation that stopped a capture clearing the repetition history
passed the whole property suite, and only bit at RUNS=500. Raise RUNS when you are touching capture
behaviour, and do not read a green default run as cover.

**There is no perft table for janggi.** Chess, shogi and xiangqi all have published counts of the
positions reachable in N moves; janggi has none, which is why invariants over random games carry the
property suite instead of an external oracle. The one oracle that exists is Fairy-Stockfish, which
ships `tests/perft.sh` — worth a one-off offline cross-check of movement-only counts, never CI: it is
a C++ binary, and its janggi takes positions on the endgame rules `docs/rules.md` §6 records as
contested.

**The two filters in `movesFrom` are what the suite costs.** The check filter made the properties
about 7x slower and repetition another 1.9x on top, so `vitest.properties.config.ts` sets a 300s
`testTimeout`. If it ever has to be faster, **the fix is not to weaken the rule**: count a candidate's
standing in `state.seen` rather than `after.seen` (same answer), which lets the `positionAfter` append
move out into `applyMove` and `pass`. It stays where it is because `positionAfter` is the one place a
transition is described.

## What is not modelled yet

Nothing that is a rule of play. What `docs/rules.md` §6 still lists is 묵장 and 자장 — tournament rules
about human mistakes (a check both players overlooked, a general moved into one) rather than rules
about a board; neither can arise on screen, because a move that overlooks a check is never offered.
There is no move history and no captured pile **on `GameState`** — adding a field before a rule asks
for one fixes its shape too early; `record/` wraps `GameState` precisely so undo needn't put one there.
