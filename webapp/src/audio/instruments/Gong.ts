import type {SoundOutput} from "@src/audio/types/SoundOutput";
import {strike} from "@src/audio/instruments/utils/Strike";

/** One stroke of the gong. */
export interface GongStrike {
  /** The lowest note it sounds, in hertz. */
  readonly frequency: number;
  /** From nought to one. */
  readonly weight: number;
  /** How long it rings, in seconds. */
  readonly length: number;
}

/** One partial of the gong: how far above the lowest note it sits, and how loud it is beside it. */
interface Overtone {
  readonly ratio: number;
  readonly loudness: number;
}

/**
 * A 징, the gong of Korean court and farmers' music, struck for the things that end a game: a mate, a
 * win on points, a bikjang called.
 *
 * A gong is not a note but a cluster of them that do not line up the way a string's do, so it is built
 * from a handful of partials at inharmonic ratios, the higher ones dying first — which is what gives a
 * gong its bloom and its long, darkening tail. Each partial slips very slightly flat as it rings.
 */
export function gong({context, destination}: SoundOutput, when: number, gongStrike: GongStrike): void {
  const {frequency, weight, length} = gongStrike;

  OVERTONES.forEach(({ratio, loudness}, index) => {
    const tone = context.createOscillator();
    tone.type = "sine";
    tone.frequency.setValueAtTime(frequency * ratio, when);
    tone.frequency.exponentialRampToValueAtTime(frequency * ratio * SAG, when + length);

    const level = context.createGain();
    strike(level.gain, {
      when,
      peak: weight * loudness * 0.35,
      attack: 0.012 + index * 0.004,
      decay: length * (1 - index * 0.14),
    });

    tone.connect(level).connect(destination);
    tone.start(when);
    tone.stop(when + length + 0.1);
  });
}

const OVERTONES: readonly Overtone[] = [
  {ratio: 1, loudness: 1},
  {ratio: 1.47, loudness: 0.55},
  {ratio: 2.09, loudness: 0.4},
  {ratio: 2.56, loudness: 0.22},
  {ratio: 3.14, loudness: 0.14},
];

/** How far each partial slips flat by the time it has died. */
const SAG = 0.994;
