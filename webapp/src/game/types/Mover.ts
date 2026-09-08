import type {PieceLookup} from "@src/game/board/types/PieceLookup";
import type {Position} from "@src/game/board/types/Position";
import type {Side} from "@janggi/shared/janggi/pieces/Side";

/**
 * Everywhere one kind of piece may go from where it stands. One of these per piece type, and
 * `movesFrom` picks between them.
 *
 * It is handed the board already indexed and told which army is moving, rather than a whole
 * `GameState`, so that a rule cannot accidentally depend on whose turn it is — that is a question
 * about the game, not about how a horse moves — and so a test can set up a board without inventing
 * a turn to go with it.
 */
export type Mover = (pieces: PieceLookup, from: Position, side: Side) => readonly Position[];
