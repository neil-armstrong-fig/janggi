import type {Mode} from "@src/audio/modes/types/Mode";

/**
 * The frequency, in hertz, of one degree of a mode above a root: nought is the root, the mode's own
 * length is the root an octave up, and a negative degree walks down below it.
 *
 * Counting in degrees rather than in notes is what keeps every line the music generates inside the
 * mode — a melody that steps up by one always lands on a note that belongs.
 */
export function pitchOf(root: number, mode: Mode, degree: number): number {
  const length = mode.steps.length;
  const octave = Math.floor(degree / length);
  const step = mode.steps[((degree % length) + length) % length] ?? 0;

  return root * 2 ** (octave + step / 12);
}
