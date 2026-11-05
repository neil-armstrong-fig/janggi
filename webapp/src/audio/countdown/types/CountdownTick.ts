/** One tick of a countdown: when it falls, as `Date.now()` counts, and how hard to strike it, from nought to one. */
export interface CountdownTick {
  readonly at: number;
  readonly weight: number;
}
