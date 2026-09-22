/** The numbers one group of a path command was written with, and where in the data reading them ended. */
export interface NumbersRead {
  readonly numbers: readonly number[];
  readonly end: number;
}
