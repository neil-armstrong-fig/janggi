/** Where a step falls in the 장단 cycle. */
export interface Beat {
  /** Which beat of the cycle it is, from nought. */
  readonly index: number;
  /** Whether the step is the first of its beat — where anything struck or started on the beat begins. */
  readonly onset: boolean;
  /** How many steps the beat lasts. */
  readonly length: number;
  /** Whether it is the cycle's final beat. */
  readonly last: boolean;
}
