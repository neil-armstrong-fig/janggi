/** Where the line through a point of the seven-by-seven crop falls, as a percentage of the drawn board. */
export function pointAt(index: number): number {
  return BOARD_START + index * BOARD_STEP;
}

const BOARD_START = 8;
const BOARD_STEP = 14;
