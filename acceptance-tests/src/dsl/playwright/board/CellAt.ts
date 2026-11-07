import type {Locator} from "@playwright/test";

/** The composed cell test-id contract, shared by game and preview boards. */
export function cellAt(board: Locator, file: number, rank: number): Locator {
  return board.getByTestId(`cell-f${file}r${rank}`);
}
