/** The shape of a struck note: when it lands, how loud it gets, and how quickly it rises and dies. */
export interface Envelope {
  readonly when: number;
  readonly peak: number;
  /** How long it takes to reach `peak`, in seconds. */
  readonly attack: number;
  /** How long it takes to die away afterwards, in seconds. */
  readonly decay: number;
}

/**
 * Shapes a gain into a struck note: silent until `when`, up to `peak` over `attack` seconds, and away
 * again over `decay`.
 *
 * Exponential both ways, which is how a struck or plucked thing actually rises and dies — a linear fade
 * sounds like a volume knob being turned. An exponential ramp cannot start or end at nought, so it runs
 * from and to something too quiet to hear instead.
 */
export function strike(gain: AudioParam, {when, peak, attack, decay}: Envelope): void {
  gain.setValueAtTime(SILENCE, when);
  gain.exponentialRampToValueAtTime(Math.max(SILENCE, peak), when + attack);
  gain.exponentialRampToValueAtTime(SILENCE, when + attack + decay);
}

/** Quiet enough to be silence, and still above the nought an exponential ramp cannot reach. */
const SILENCE = 0.0001;
