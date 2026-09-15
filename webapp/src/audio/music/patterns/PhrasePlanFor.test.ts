import {MOTIF_COUNT} from "@src/audio/music/patterns/SoloNotesAt";
import {expect, it} from "vitest";
import {phrasePlanFor} from "@src/audio/music/patterns/PhrasePlanFor";

const ROLLS = [0, 0.1, 0.3, 0.5, 0.7, 0.9, 1];

it("never answers a call with the same motif", () => {
  for (const call of ROLLS)
    for (const answer of ROLLS) expect(phrasePlanFor(call, answer).call).not.toBe(phrasePlanFor(call, answer).answer);
});

it("picks only motifs there are", () => {
  for (const call of ROLLS) {
    for (const answer of ROLLS) {
      const {call: called, answer: answered} = phrasePlanFor(call, answer);

      expect(called >= 0 && called < MOTIF_COUNT && answered >= 0 && answered < MOTIF_COUNT).toBe(true);
    }
  }
});

it("can pick every motif to call with", () => {
  expect(new Set(ROLLS.map(call => phrasePlanFor(call, 0.5).call)).size).toBe(MOTIF_COUNT);
});
