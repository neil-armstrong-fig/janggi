# AGENTS.md — record

Stepping back and forward through a game: `PlayedGame` wraps the engine's `GameState` (`@janggi/engine/...`) with the positions
before and after it. It is not a rule of janggi, so it is not in `engine/`; the API's Worker has no use for it. A turn
leaves no event behind and a record keeps positions rather than moves, so what a turn did is derived from the positions
either side of it (`TransitionBetween.ts`, `ChangeBetween.ts`) — what the board's motion and the sound both hear.

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

- **`PlayingAGame.test.ts`** — one scripted game, nested so each `describe` plays a move onto its parent's position.
  Catches a loop through the rules being broken while each rule is right alone.
- **`PlayingRandomGames.test.ts`** — thousands of random legal games via fast-check, asserting what must hold after every
  move. Not run by `pnpm checks`; see the root `AGENTS.md`.
