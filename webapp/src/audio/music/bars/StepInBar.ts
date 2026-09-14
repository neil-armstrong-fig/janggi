import {STEPS_PER_BAR} from "@src/audio/music/bars/steps-per-bar/StepsPerBar";

/** Where in its bar a step falls, from nought on the downbeat to seven on the last eighth. */
export function stepInBar(step: number): number {
  return ((step % STEPS_PER_BAR) + STEPS_PER_BAR) % STEPS_PER_BAR;
}
