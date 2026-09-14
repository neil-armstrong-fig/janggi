import type {Beat} from "@src/audio/music/types/Beat";
import {JANGDAN} from "@src/audio/music/cycle/jangdan/Jangdan";

/** Which beat of the 장단 cycle a step falls in, and whether it is where that beat begins. */
export function beatAt(step: number): Beat {
  const inCycle = ((step % STEPS_PER_CYCLE) + STEPS_PER_CYCLE) % STEPS_PER_CYCLE;
  let start = 0;

  for (const [index, length] of JANGDAN.entries()) {
    if (inCycle < start + length) return {index, onset: inCycle === start, length, last: index === JANGDAN.length - 1};

    start += length;
  }

  throw new Error(`The cycle's beats do not add up to its ${STEPS_PER_CYCLE} steps`);
}

const STEPS_PER_CYCLE = JANGDAN.reduce((sum, length) => sum + length, 0);
