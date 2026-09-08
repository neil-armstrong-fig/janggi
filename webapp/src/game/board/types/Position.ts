/**
 * Where a piece sits. Janggi is played on the intersections of 9 files and 10 ranks, so a position
 * is one of exactly 90 points — files 1-9 left to right, ranks 1-10 top to bottom.
 *
 * These are literal unions rather than `number` so that an off-board coordinate cannot be written by
 * hand and compile. Anything arriving from outside the app — a stored board style, an imported
 * layout — is `number` or `string` until something parses it into these types.
 */
export type File = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
export type Rank = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;

export interface Position {
  readonly file: File;
  readonly rank: Rank;
}

/**
 * A position's stable identity, and the key a per-cell style override is stored under. Spelling it
 * as a template literal means the 90 valid keys are the only ones that type-check, so a hard-coded
 * override for a cell that does not exist is a compile error rather than a silent no-op.
 */
export type PositionKey = `f${File}r${Rank}`;
