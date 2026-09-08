import type {Step} from "@src/game/board/types/Step";

/**
 * The four directions the board's lines run in. Every piece except the elephant and the horse moves
 * along these; those two start along one and then turn.
 *
 * Diagonals are deliberately not here beside them. Outside a palace there are none, and inside one
 * only five of the nine points carry any — so a diagonal is always asked for by position, through
 * `palaceDiagonalStepsAt`, never taken from a list.
 */
export const ORTHOGONAL_STEPS: readonly Step[] = [
  {fileStep: 0, rankStep: -1},
  {fileStep: 0, rankStep: 1},
  {fileStep: -1, rankStep: 0},
  {fileStep: 1, rankStep: 0},
];
