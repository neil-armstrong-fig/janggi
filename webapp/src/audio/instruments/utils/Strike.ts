/**
 * Shapes a gain into a struck note: silent until `when`, up to `peak` over `attack` seconds, and away
 * again over `decay`.
 *
 * Exponential both ways, which is how a struck or plucked thing actually rises and dies — a linear fade
 * sounds like a volume knob being turned. An exponential ramp cannot start or end at nought, so it runs
 * from and to something too quiet to hear instead.
 */
export function strike(gain: AudioParam, when: number, peak: number, attack: number, decay: number): void {
  gain.setValueAtTime(SILENCE, when);
  gain.exponentialRampToValueAtTime(Math.max(SILENCE, peak), when + attack);
  gain.exponentialRampToValueAtTime(SILENCE, when + attack + decay);
}

/** Quiet enough to be silence, and still above the nought an exponential ramp cannot reach. */
const SILENCE = 0.0001;
