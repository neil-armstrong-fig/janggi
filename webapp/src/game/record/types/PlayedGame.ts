import type {GameState} from "@src/game/types/GameState";

/**
 * A game together with where it has been and what has been taken back out of it.
 *
 * Positions rather than moves, for two reasons that stand on their own. Undo is then a step between
 * three lists with nothing to replay — every engine function already hands back a fresh, immutable
 * `GameState` rather than mutating in place, so the positions are all still there and only need
 * keeping. And a pass is deliberately not a `Move`: a list of moves would have to carry the
 * `Move | "pass"` union the engine went out of its way to avoid, while a position does not care what
 * reached it.
 *
 * This sits beside `GameState` and never inside it. `GameState` is what the rules need in order to
 * say what may happen next, and taking a game back is not a rule of janggi at all — it is what lets
 * a caller step through one.
 *
 * `past` holds the same positions `isRepetition` asks about, and deliberately is **not** where it
 * asks them. Repetition is a rule of janggi, so it is measured on `GameState.seen`, which every
 * entry point can see; `movesFrom` and `applyMove` take a position rather than a record, and a rule
 * enforced only here would be one a caller holding a bare `GameState` never met. What that leaves
 * is undo getting repetition right for nothing: `seen` rides on each position restored, so taking a
 * move back rewinds the history with it, and nothing here had to learn the rule to do it. See
 * `docs/rules.md` §6.4.
 */
export interface PlayedGame {
  /** Every position the game has left behind, oldest first. */
  readonly past: readonly GameState[];

  /** The game as it stands. */
  readonly present: GameState;

  /**
   * Positions taken back, the nearest first, so `redo` restores the front of the list. Emptied the
   * moment play goes somewhere new, because a branch nobody returned to is stale.
   */
  readonly future: readonly GameState[];
}
