import {noiseBuffer} from "@src/audio/instruments/utils/NoiseBuffer";

/** A breath drawn in. */
export interface BreathSwell {
  /** From nought to one. */
  readonly weight: number;
  /** How long it swells for, in seconds, before it is cut. */
  readonly length: number;
}

/**
 * Soft noise that swells and is cut off short — the shape of a sound played backwards, which is what a
 * turn taken back should sound like: the game drawing in the move it had played.
 */
export function breath(context: BaseAudioContext, destination: AudioNode, when: number, swell: BreathSwell): void {
  const {weight, length} = swell;

  const air = context.createBufferSource();
  air.buffer = noiseBuffer(context);

  const soften = context.createBiquadFilter();
  soften.type = "lowpass";
  soften.frequency.value = 900;
  soften.Q.value = 0.5;

  const level = context.createGain();
  level.gain.setValueAtTime(SILENCE, when);
  level.gain.exponentialRampToValueAtTime(0.05 + 0.2 * weight, when + length);
  level.gain.linearRampToValueAtTime(0, when + length + CUT);

  air.connect(soften).connect(level).connect(destination);
  air.start(when, Math.random() * 0.5);
  air.stop(when + length + CUT + 0.02);
}

/** Quiet enough to be silence, and still above the nought an exponential ramp cannot start from. */
const SILENCE = 0.0001;

/** How quickly the swell is cut off once it peaks, in seconds. */
const CUT = 0.03;
