import type {Beat} from "@src/audio/music/types/Beat";
import type {Rhythm} from "@src/audio/music/rhythm/types/Rhythm";

/** Which beat of a 장단's cycle a step falls in, and whether it is where that beat begins. */
export function beatIn(rhythm: Rhythm, step: number): Beat {
  const cycle = rhythm.beats.reduce((sum, length) => sum + length, 0);
  const inCycle = ((step % cycle) + cycle) % cycle;
  let start = 0;

  for (const [index, length] of rhythm.beats.entries()) {
    if (inCycle < start + length) {
      return {index, onset: inCycle === start, length, last: index === rhythm.beats.length - 1};
    }

    start += length;
  }

  throw new Error(`${rhythm.name}'s beats do not add up to its cycle`);
}
