import {FILES, RANKS} from "@src/react/pages/game/components/board/utils/BoardDimensions";
import type {Position} from "@src/react/pages/game/components/board/types/Position";

/**
 * Every intersection of the board, in reading order — the order a CSS grid wants them in.
 *
 * Janggi is played on the intersections of 9 files and 10 ranks rather than inside squares, so this
 * is 90 points, not 72 boxes. The board's shape never changes, so it is built once when the module
 * loads rather than on every render.
 */
export const BOARD_POSITIONS: readonly Position[] = RANKS.flatMap(rank => FILES.map(file => ({file, rank})));
