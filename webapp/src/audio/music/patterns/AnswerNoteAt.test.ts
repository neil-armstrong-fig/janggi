import {JAJINMORI, JUNGMORI} from "@src/audio/music/rhythm/rhythms/Rhythms";
import {STEPS_PER_GAME_CHORD, chordAt} from "@src/audio/music/harmony/ChordAt";
import {answerNoteAt} from "@src/audio/music/patterns/AnswerNoteAt";
import {beatIn} from "@src/audio/music/rhythm/BeatIn";
import {expect, it} from "vitest";

const PHRASE = Array.from({length: 48}, (_, step) => step);

it("breathes only two long notes a phrase, where the phrase turns and where it closes", () => {
  expect(PHRASE.filter(step => answerNoteAt(step))).toEqual([18, 42]);
});

it("breathes in where a beat begins, whether the 장단 is counted in twos or threes", () => {
  for (const step of PHRASE.filter(at => answerNoteAt(at))) {
    expect(beatIn(JUNGMORI, step).onset).toBe(true);
    expect(beatIn(JAJINMORI, step).onset).toBe(true);
  }
});

it("holds only tones of the chord the bass is plucking", () => {
  for (const step of Array.from({length: 96}, (_, at) => at)) {
    const note = answerNoteAt(step);
    if (note) expect(chordAt(step, STEPS_PER_GAME_CHORD).tones).toContain(note.degree % 5);
  }
});

it("comes to rest on the root under the cadence", () => {
  expect(answerNoteAt(42)?.degree).toBe(chordAt(42, STEPS_PER_GAME_CHORD).root);
});
