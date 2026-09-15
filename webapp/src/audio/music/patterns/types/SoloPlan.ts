/** Which motifs one phrase of the solo is built from: the call it makes and repeats, and its answer. */
export interface SoloPlan {
  readonly call: number;
  readonly answer: number;
}
