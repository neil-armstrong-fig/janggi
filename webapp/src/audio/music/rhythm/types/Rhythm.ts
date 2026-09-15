/** The three 장단 the game's music moves through. */
export type RhythmName = "jungmori" | "jungjungmori" | "jajinmori";

/** Whether a 장단's beats are counted in twos or in threes. */
export type Meter = "duple" | "triple";

/** A 장단 the game's music is counted in. */
export interface Rhythm {
  readonly name: RhythmName;
  /** Each beat of one cycle, in steps. */
  readonly beats: readonly number[];
  /** Duple beats swing their off-steps; triple beats already lilt, and are played straight. */
  readonly meter: Meter;
  /** The stretch of tension this 장단 is played across, from its first moment to the next 장단's. */
  readonly tension: {readonly from: number; readonly to: number};
  /** How long a step lasts, in seconds, at the calm and the tense end of that stretch. */
  readonly stepSeconds: {readonly calm: number; readonly tense: number};
}
