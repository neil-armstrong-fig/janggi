/**
 * How much wider a cell is drawn than it is tall. Traditional boards space the files slightly
 * further apart than the ranks, which is what stops the board reading as a square grid.
 * Approximate, and deliberately a single knob to turn.
 *
 * Purely a drawing decision — the rules know nothing about it — which is why it sits here rather
 * than with the board's dimensions in `@src/game/board/`.
 */
export const CELL_ASPECT_RATIO = 1.1;
