import type {File, Rank} from "@src/react/pages/game/components/board/types/Position";

/**
 * How big the board is, and how it is proportioned. Kept together because the grid consumes all of
 * it at once to lay itself out.
 *
 * `FILES` and `RANKS` are the source: spelling the coordinates out as literals is what lets
 * positions be built without a cast, since the values carry their own types.
 */
export const FILES: readonly File[] = [1, 2, 3, 4, 5, 6, 7, 8, 9];
export const RANKS: readonly Rank[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

export const FILE_COUNT = FILES.length;
export const RANK_COUNT = RANKS.length;

/**
 * How much wider a cell is than it is tall. Traditional boards space the files slightly further
 * apart than the ranks, which is what stops the board reading as a square grid. Approximate, and
 * deliberately a single knob to turn.
 */
export const CELL_ASPECT_RATIO = 1.1;
