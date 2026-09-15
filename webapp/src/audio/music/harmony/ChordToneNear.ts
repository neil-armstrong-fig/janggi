import type {Chord} from "@src/audio/music/harmony/types/Chord";

/**
 * The tone of `chord` nearest to `degree`: the degree itself where it is already in the chord, and
 * otherwise the nearest one that is, looking first the way `leaning` points — up where it is positive or
 * nought, down where it is negative — so a line bent onto the chord still goes the way it was going.
 */
export function chordToneNear(degree: number, chord: Chord, leaning: number): number {
  const first = leaning < 0 ? -1 : 1;

  for (let distance = 0; distance < DEGREES_PER_OCTAVE; distance += 1) {
    if (isTone(degree + first * distance, chord)) return degree + first * distance;
    if (isTone(degree - first * distance, chord)) return degree - first * distance;
  }

  return degree;
}

function isTone(degree: number, chord: Chord): boolean {
  return chord.tones.includes(((degree % DEGREES_PER_OCTAVE) + DEGREES_PER_OCTAVE) % DEGREES_PER_OCTAVE);
}

/** 평조 has five notes, so a degree five above another is the same note an octave up. */
const DEGREES_PER_OCTAVE = 5;
