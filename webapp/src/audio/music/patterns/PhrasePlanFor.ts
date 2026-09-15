import {MOTIF_COUNT} from "@src/audio/music/patterns/SoloNotesAt";
import type {SoloPlan} from "@src/audio/music/patterns/types/SoloPlan";

/**
 * Which motifs the soloist builds its next phrase from: `call` picks the one it makes and repeats, and
 * `answer` the one it answers with — never the call itself, or the answer would only be a third
 * repeat. Each roll is between nought and one, handed in for the reason the patterns' rolls are.
 */
export function phrasePlanFor(call: number, answer: number): SoloPlan {
  const called = pick(call, MOTIF_COUNT);
  const others = pick(answer, MOTIF_COUNT - 1);

  return {call: called, answer: others >= called ? others + 1 : others};
}

function pick(roll: number, count: number): number {
  return Math.min(count - 1, Math.max(0, Math.floor(roll * count)));
}
