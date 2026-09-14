import type {File, Rank} from "@src/game/board/types/Position";

/**
 * How big the board is. Nine files by ten ranks, and pieces stand on the intersections rather than
 * inside the squares, so this is 90 points rather than 72 boxes.
 *
 * `FILES` and `RANKS` are the source: spelling the coordinates out as literals is what lets
 * positions be built without a cast, since the values carry their own types.
 *
 * How the board is *proportioned* is not here — a cell being wider than it is tall is a drawing
 * decision and lives beside the board that draws it.
 */
export const FILES: readonly File[] = [1, 2, 3, 4, 5, 6, 7, 8, 9];
export const RANKS: readonly Rank[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

export const FILE_COUNT = FILES.length;
export const RANK_COUNT = RANKS.length;
