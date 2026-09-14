import type {JangguHead} from "@src/audio/instruments/types/JangguHead";
import {noiseBuffer} from "@src/audio/instruments/utils/NoiseBuffer";
import {strike} from "@src/audio/instruments/utils/Strike";

/** One stroke on the 장구. */
export interface JangguStrike {
  readonly head: JangguHead;
  /** From nought to one. */
  readonly weight: number;
}

/**
 * The 장구, the hourglass drum at the heart of Korean folk rhythm, which is what drives the music as a
 * game grows tense and what sounds a check.
 *
 * Its two heads are two different sounds and are drawn that way: 궁편 a round low boom that drops in
 * pitch as it rings, and 채편 a dry bright crack from the thin stick.
 */
export function janggu(context: BaseAudioContext, destination: AudioNode, when: number, stroke: JangguStrike): void {
  if (stroke.head === "gung") gung(context, destination, when, stroke.weight);

  if (stroke.head === "chae") chae(context, destination, when, stroke.weight);
}

function gung(context: BaseAudioContext, destination: AudioNode, when: number, weight: number): void {
  const skin = context.createOscillator();
  skin.type = "sine";
  skin.frequency.setValueAtTime(150, when);
  skin.frequency.exponentialRampToValueAtTime(62, when + 0.16);

  const skinLevel = context.createGain();
  strike(skinLevel.gain, when, weight * 0.9, 0.003, 0.32);

  skin.connect(skinLevel).connect(destination);
  skin.start(when);
  skin.stop(when + 0.45);

  const palm = context.createBufferSource();
  palm.buffer = noiseBuffer(context);

  const muffle = context.createBiquadFilter();
  muffle.type = "lowpass";
  muffle.frequency.value = 400;

  const palmLevel = context.createGain();
  strike(palmLevel.gain, when, weight * 0.25, 0.002, 0.05);

  palm.connect(muffle).connect(palmLevel).connect(destination);
  palm.start(when, Math.random() * 0.5);
  palm.stop(when + 0.1);
}

function chae(context: BaseAudioContext, destination: AudioNode, when: number, weight: number): void {
  const stick = context.createBufferSource();
  stick.buffer = noiseBuffer(context);

  const band = context.createBiquadFilter();
  band.type = "bandpass";
  band.frequency.value = 3200;
  band.Q.value = 2;

  const stickLevel = context.createGain();
  strike(stickLevel.gain, when, weight * 0.5, 0.001, 0.05);

  stick.connect(band).connect(stickLevel).connect(destination);
  stick.start(when, Math.random() * 0.5);
  stick.stop(when + 0.1);

  const ring = context.createOscillator();
  ring.type = "triangle";
  ring.frequency.setValueAtTime(820, when);
  ring.frequency.exponentialRampToValueAtTime(640, when + 0.05);

  const ringLevel = context.createGain();
  strike(ringLevel.gain, when, weight * 0.2, 0.001, 0.06);

  ring.connect(ringLevel).connect(destination);
  ring.start(when);
  ring.stop(when + 0.12);
}
