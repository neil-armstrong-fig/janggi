/**
 * The cycle the game's own music is counted in: six beats of unequal length, each given in steps,
 * sixteen steps in all.
 *
 * Unequal on purpose. The slow music of the Korean court does not walk in even beats — a long beat
 * opens the cycle and shorter ones follow it — and that unevenness, more than any one melody, is what
 * makes a line breathe the way 수제천 does. The lengths here are this game's own, shaped after that
 * manner rather than taken from any piece.
 */
export const JANGDAN: readonly number[] = [4, 2, 2, 3, 3, 2];
