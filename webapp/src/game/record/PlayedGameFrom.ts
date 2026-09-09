import type {GameState} from "@src/game/types/GameState";
import type {PlayedGame} from "@src/game/record/types/PlayedGame";

/**
 * The record a game starts as: the position handed in standing as it is, nowhere played yet and
 * nothing taken back.
 *
 * It takes a `GameState` rather than the two setups `newGame` takes, so that any position can be
 * recorded from — a game about to start is `playedGameFrom(newGame(han, cho))`, and an endgame built
 * piece by piece for a test is recorded the same way.
 */
export function playedGameFrom(game: GameState): PlayedGame {
  return {past: [], present: game, future: []};
}
