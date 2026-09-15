import {JAJINMORI, JUNGJUNGMORI, JUNGMORI, RHYTHMS} from "@src/audio/music/rhythm/rhythms/Rhythms";
import {beatIn} from "@src/audio/music/rhythm/BeatIn";
import {expect, it} from "vitest";
import {jangguHitsAt} from "@src/audio/music/patterns/JangguHitsAt";

const ROUND = Array.from({length: 24}, (_, step) => step);

it("opens every cycle of every 장단 with both heads together", () => {
  for (const rhythm of RHYTHMS) {
    const cycle = rhythm.beats.reduce((sum, length) => sum + length, 0);

    for (const step of ROUND.filter(at => at % cycle === 0)) {
      expect(jangguHitsAt(step, rhythm, rhythm.tension.from, false).map(hit => hit.head)).toEqual(["gung", "chae"]);
    }
  }
});

/** So a change of 장단 is heard in the drum first. */
it("drums each 장단 in a figure of its own", () => {
  const figureOf = (rhythm: typeof JUNGMORI): string =>
    JSON.stringify(ROUND.map(step => jangguHitsAt(step, rhythm, rhythm.tension.from, false)));

  expect(new Set([JUNGMORI, JUNGJUNGMORI, JAJINMORI].map(figureOf)).size).toBe(3);
});

it("lands strokes off the beat in every 장단, which is where the groove comes from", () => {
  for (const rhythm of RHYTHMS) {
    const offBeat = ROUND.filter(
      step => !beatIn(rhythm, step).onset && jangguHitsAt(step, rhythm, rhythm.tension.from, false).length > 0,
    );

    expect({rhythm: rhythm.name, offBeat: offBeat.length > 0}).toEqual({rhythm: rhythm.name, offBeat: true});
  }
});

it("fills the gaps with ghost strokes only once a 장단 has grown tense", () => {
  for (const rhythm of RHYTHMS) {
    const struck = (tension: number): number =>
      ROUND.flatMap(step => jangguHitsAt(step, rhythm, tension, false)).length;

    expect(struck(rhythm.tension.to)).toBeGreaterThan(struck(rhythm.tension.from));
  }
});

it("climbs into a new 장단 with a fill over the round's last steps, and only when one is coming", () => {
  expect(jangguHitsAt(22, JUNGMORI, 0, true)).not.toEqual(jangguHitsAt(22, JUNGMORI, 0, false));
  expect(jangguHitsAt(23, JAJINMORI, 0.7, true).length).toBeGreaterThan(0);
  expect(jangguHitsAt(4, JUNGMORI, 0, true)).toEqual(jangguHitsAt(4, JUNGMORI, 0, false));
});

it("never strikes anything harder than the stroke a cycle opens on", () => {
  for (const rhythm of RHYTHMS) {
    for (const step of ROUND) {
      for (const hit of jangguHitsAt(step, rhythm, rhythm.tension.to, true))
        expect(hit.weight).toBeLessThanOrEqual(0.9);
    }
  }
});
