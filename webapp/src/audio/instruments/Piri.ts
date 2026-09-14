import type {Slide} from "@src/audio/instruments/types/Slide";
import {noiseBuffer} from "@src/audio/instruments/utils/NoiseBuffer";

/** One held note on the reed. */
export interface PiriNote {
  /** In hertz. */
  readonly frequency: number;
  /** From nought to one. */
  readonly weight: number;
  /** How long the note is held, in seconds. */
  readonly length: number;
  readonly slide: Slide;
}

/**
 * A long note in the manner of the 피리, the double-reed pipe that leads the slow music of the court.
 *
 * Reedy and a little nasal: a buzzing tone pushed through two narrow resonances, with a breath of air
 * under it. A note can be scooped into from nearly a whole tone below, or let fall away at its end, and
 * a slow vibrato grows into it the longer it is held — the ornaments a piri player puts on a note that
 * lasts several seconds, without which it would be only a tone.
 */
export function piri(context: BaseAudioContext, destination: AudioNode, when: number, note: PiriNote): void {
  const {frequency, weight, length, slide} = note;
  const end = when + length;

  const reed = context.createOscillator();
  reed.type = "sawtooth";

  const bore = context.createOscillator();
  bore.type = "square";

  for (const oscillator of [reed, bore]) shapePitch(oscillator.frequency, frequency, when, end, slide);

  const boreLevel = context.createGain();
  boreLevel.gain.value = 0.35;

  const vibrato = context.createOscillator();
  vibrato.type = "sine";
  vibrato.frequency.value = VIBRATO_HZ;

  const vibratoDepth = context.createGain();
  vibratoDepth.gain.setValueAtTime(0, when);
  vibratoDepth.gain.linearRampToValueAtTime(frequency * VIBRATO_DEPTH, when + length * 0.6);

  const mix = context.createGain();

  const nasal = context.createBiquadFilter();
  nasal.type = "bandpass";
  nasal.frequency.value = 1150;
  nasal.Q.value = 2.5;

  const bright = context.createBiquadFilter();
  bright.type = "bandpass";
  bright.frequency.value = 2700;
  bright.Q.value = 3.5;

  const brightLevel = context.createGain();
  brightLevel.gain.value = 0.6;

  const body = context.createBiquadFilter();
  body.type = "lowpass";
  body.frequency.value = 3200;

  const bodyLevel = context.createGain();
  bodyLevel.gain.value = 0.25;

  const air = context.createBufferSource();
  air.buffer = noiseBuffer(context);
  air.loop = true;

  const airBand = context.createBiquadFilter();
  airBand.type = "bandpass";
  airBand.frequency.value = 1800;
  airBand.Q.value = 0.8;

  const airLevel = context.createGain();
  airLevel.gain.value = 0.03 * weight;

  const peak = 0.06 + 0.08 * weight;
  const level = context.createGain();
  level.gain.setValueAtTime(SILENCE, when);
  level.gain.exponentialRampToValueAtTime(peak, when + SWELL_S);
  level.gain.setValueAtTime(peak, Math.max(when + SWELL_S, end - RELEASE_S));
  level.gain.exponentialRampToValueAtTime(SILENCE, end);

  vibrato.connect(vibratoDepth);
  vibratoDepth.connect(reed.frequency);
  vibratoDepth.connect(bore.frequency);

  reed.connect(mix);
  bore.connect(boreLevel).connect(mix);
  mix.connect(nasal).connect(level);
  mix.connect(bright).connect(brightLevel).connect(level);
  mix.connect(body).connect(bodyLevel).connect(level);
  air.connect(airBand).connect(airLevel).connect(level);
  level.connect(destination);

  for (const source of [reed, bore, vibrato]) {
    source.start(when);
    source.stop(end + 0.05);
  }

  air.start(when, Math.random() * 0.5);
  air.stop(end + 0.05);
}

/** Scoops up into the note, or lets its end fall away — or holds it steady throughout. */
function shapePitch(pitch: AudioParam, frequency: number, when: number, end: number, slide: Slide): void {
  if (slide === "scoop") {
    pitch.setValueAtTime(frequency * SCOOP_FROM, when);
    pitch.exponentialRampToValueAtTime(frequency, when + SCOOP_S);
  } else {
    pitch.setValueAtTime(frequency, when);
  }

  if (slide === "fall") {
    pitch.setValueAtTime(frequency, end - (end - when) * FALL_SHARE);
    pitch.exponentialRampToValueAtTime(frequency * FALL_TO, end);
  }
}

/** Where a scooped note starts — close to a whole tone below — and how long it takes to arrive. */
const SCOOP_FROM = 0.89;
const SCOOP_S = 0.22;

/** How much of a falling note's length the fall takes, and how far it drops by the end. */
const FALL_SHARE = 0.3;
const FALL_TO = 0.92;

const VIBRATO_HZ = 4.6;

/** How wide the vibrato grows, as a share of the note's own frequency. */
const VIBRATO_DEPTH = 0.009;

/** How long the note takes to swell to full, and to fall away at the end, in seconds. */
const SWELL_S = 0.12;
const RELEASE_S = 0.3;

/** Quiet enough to be silence, and still above the nought an exponential ramp cannot reach. */
const SILENCE = 0.0001;
