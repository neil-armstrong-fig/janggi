import type {SoundOutput} from "@src/audio/types/SoundOutput";
import {strike} from "@src/audio/instruments/utils/Strike";

/** One plucked note. */
export interface GayageumPluck {
  /** In hertz. */
  readonly frequency: number;
  /** From nought to one. */
  readonly weight: number;
  /** How long the string rings, in seconds. */
  readonly length: number;
}

/**
 * A plucked string in the manner of the 가야금, the zither the music's melodies and plucked lines are
 * played on.
 *
 * Bright at the pluck and mellowing as it rings — a filter closing over the string — with a second,
 * softer voice an octave up for the string's own shimmer. As the note dies the pitch sags a touch, a
 * nod to 농현, the player's hand pressing the string behind the bridge, which more than anything is what
 * makes a plucked note sound Korean rather than merely plucked.
 */
export function gayageum({context, destination}: SoundOutput, when: number, gayageumPluck: GayageumPluck): void {
  const {frequency, weight, length} = gayageumPluck;
  const end = when + length + 0.05;

  const string = context.createOscillator();
  string.type = "sawtooth";
  string.frequency.setValueAtTime(frequency, when);
  string.frequency.setValueAtTime(frequency, when + length * 0.45);
  string.frequency.linearRampToValueAtTime(frequency * BEND, when + length);

  const shimmer = context.createOscillator();
  shimmer.type = "triangle";
  shimmer.frequency.setValueAtTime(frequency * 2, when);
  shimmer.detune.value = 4;

  const shimmerLevel = context.createGain();
  shimmerLevel.gain.value = 0.3;

  const mellow = context.createBiquadFilter();
  mellow.type = "lowpass";
  mellow.Q.value = 0.7;
  mellow.frequency.setValueAtTime(Math.min(BRIGHTEST, frequency * 10), when);
  mellow.frequency.exponentialRampToValueAtTime(frequency * 1.8, when + length * 0.6);

  const level = context.createGain();
  strike(level.gain, {when, peak: 0.12 + 0.18 * weight, attack: 0.004, decay: length});

  string.connect(mellow);
  shimmer.connect(shimmerLevel).connect(mellow);
  mellow.connect(level).connect(destination);

  string.start(when);
  shimmer.start(when);
  string.stop(end);
  shimmer.stop(end);
}

/** How far the pitch sags by the end of the note — 농현, gently. */
const BEND = 0.985;

/** The filter never opens above this, however high the note. */
const BRIGHTEST = 12_000;
