import {noiseBuffer} from "@src/audio/instruments/utils/NoiseBuffer";
import {strike} from "@src/audio/instruments/utils/Strike";

/** How a wooden piece meets the board. */
export interface WoodBlockStrike {
  /** From nought to one: a piece set down gently, or slapped down hard. */
  readonly weight: number;
  /** The note of the wood's body, in hertz. Lower for a heavier blow. */
  readonly pitch: number;
}

/**
 * A wooden piece striking a wooden board — the sound janggi is played to, where a capture is
 * traditionally slapped down hard enough to be heard across the room.
 *
 * Three parts, each synthesised: a crack of filtered noise for the instant of contact, a short woody
 * tone for the body of the piece ringing, and — for a heavy blow only — a low thud of the board itself
 * taking it. The weight scales all three, so one instrument covers a soldier nudged forward and a
 * chariot slammed onto a general's guard.
 */
export function woodBlock(
  context: BaseAudioContext,
  destination: AudioNode,
  when: number,
  blow: WoodBlockStrike,
): void {
  crack(context, destination, when, blow);
  body(context, destination, when, blow);

  if (blow.weight > THUD_FROM) thud(context, destination, when, blow.weight);
}

function crack(
  context: BaseAudioContext,
  destination: AudioNode,
  when: number,
  {weight, pitch}: WoodBlockStrike,
): void {
  const noise = context.createBufferSource();
  noise.buffer = noiseBuffer(context);

  const band = context.createBiquadFilter();
  band.type = "bandpass";
  band.frequency.value = pitch * 4;
  band.Q.value = 1.5;

  const level = context.createGain();
  strike(level.gain, when, 0.3 + 0.5 * weight, 0.001, 0.025 + 0.04 * weight);

  noise.connect(band).connect(level).connect(destination);
  noise.start(when, Math.random() * 0.5);
  noise.stop(when + 0.15);
}

function body(context: BaseAudioContext, destination: AudioNode, when: number, {weight, pitch}: WoodBlockStrike): void {
  const tone = context.createOscillator();
  tone.type = "triangle";
  tone.frequency.setValueAtTime(pitch * 1.5, when);
  tone.frequency.exponentialRampToValueAtTime(pitch, when + 0.015);

  const level = context.createGain();
  strike(level.gain, when, 0.2 + 0.3 * weight, 0.002, 0.07 + 0.09 * weight);

  tone.connect(level).connect(destination);
  tone.start(when);
  tone.stop(when + 0.25);
}

function thud(context: BaseAudioContext, destination: AudioNode, when: number, weight: number): void {
  const tone = context.createOscillator();
  tone.type = "sine";
  tone.frequency.setValueAtTime(110, when);
  tone.frequency.exponentialRampToValueAtTime(48, when + 0.14);

  const level = context.createGain();
  strike(level.gain, when + 0.008, (weight - THUD_FROM) * 1.6, 0.004, 0.2);

  tone.connect(level).connect(destination);
  tone.start(when);
  tone.stop(when + 0.35);
}

/** Below this weight a piece is set down; above it the board is heard taking the blow. */
const THUD_FROM = 0.5;
