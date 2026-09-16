import type {SoundOutput} from "@src/audio/types/SoundOutput";
import {noiseBuffer} from "@src/audio/instruments/utils/NoiseBuffer";

/** One held note on the flute. */
export interface DaegeumNote {
  /** In hertz. */
  readonly frequency: number;
  /** From nought to one. */
  readonly weight: number;
  /** How long the note is held, in seconds. */
  readonly length: number;
}

/**
 * A long breathy note in the manner of the 대금, the great bamboo flute, which carries the melody over
 * the game once the fight has opened.
 *
 * Swelled into rather than struck, with a thread of air through it, and a vibrato that is not there at
 * the start of the note and grows as it is held — the way a 대금 player leans into a long tone.
 */
export function daegeum({context, destination}: SoundOutput, when: number, daegeumNote: DaegeumNote): void {
  const {frequency, weight, length} = daegeumNote;
  const end = when + length;

  const tone = context.createOscillator();
  tone.type = "sine";
  tone.frequency.setValueAtTime(frequency, when);

  const vibrato = context.createOscillator();
  vibrato.type = "sine";
  vibrato.frequency.value = VIBRATO_HZ;

  const vibratoDepth = context.createGain();
  vibratoDepth.gain.setValueAtTime(0, when);
  vibratoDepth.gain.linearRampToValueAtTime(frequency * VIBRATO_DEPTH, when + length * 0.6);

  const air = context.createBufferSource();
  air.buffer = noiseBuffer(context);
  air.loop = true;

  const airBand = context.createBiquadFilter();
  airBand.type = "bandpass";
  airBand.frequency.value = frequency * 2;
  airBand.Q.value = 1;

  const airLevel = context.createGain();
  airLevel.gain.value = 0.03 * weight;

  const level = context.createGain();
  level.gain.setValueAtTime(SILENCE, when);
  level.gain.exponentialRampToValueAtTime(0.1 + 0.12 * weight, when + SWELL);
  level.gain.setValueAtTime(0.1 + 0.12 * weight, end - RELEASE);
  level.gain.exponentialRampToValueAtTime(SILENCE, end);

  vibrato.connect(vibratoDepth).connect(tone.frequency);
  tone.connect(level);
  air.connect(airBand).connect(airLevel).connect(level);
  level.connect(destination);

  tone.start(when);
  vibrato.start(when);
  air.start(when, Math.random() * 0.5);
  tone.stop(end + 0.05);
  vibrato.stop(end + 0.05);
  air.stop(end + 0.05);
}

/** How long the note takes to swell to full, and to fall away at the end, in seconds. */
const SWELL = 0.18;
const RELEASE = 0.25;

const VIBRATO_HZ = 5.2;

/** How wide the vibrato grows, as a share of the note's own frequency. */
const VIBRATO_DEPTH = 0.006;

/** Quiet enough to be silence, and still above the nought an exponential ramp cannot reach. */
const SILENCE = 0.0001;
