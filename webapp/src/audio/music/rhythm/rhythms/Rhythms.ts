import type {Rhythm} from "@src/audio/music/rhythm/types/Rhythm";

/**
 * 중모리 — a lilting walk of twelve beats, two steps each, the swing of its off-steps what makes it
 * walk. The game opens in it.
 */
export const JUNGMORI: Rhythm = {
  name: "jungmori",
  beats: Array.from({length: 12}, () => 2),
  meter: "duple",
  tension: {from: 0, to: 0.35},
  stepSeconds: {calm: 0.46, tense: 0.42},
};

/** 중중모리 — the same twelve beats felt as four swaying groups of three, a little quicker. */
export const JUNGJUNGMORI: Rhythm = {
  name: "jungjungmori",
  beats: [3, 3, 3, 3],
  meter: "triple",
  tension: {from: 0.35, to: 0.7},
  stepSeconds: {calm: 0.42, tense: 0.37},
};

/** 자진모리 — four quick groups of three, driving: the height of the fight. */
export const JAJINMORI: Rhythm = {
  name: "jajinmori",
  beats: [3, 3, 3, 3],
  meter: "triple",
  tension: {from: 0.7, to: 1},
  stepSeconds: {calm: 0.34, tense: 0.31},
};

/**
 * The 장단 the game's music moves through, calm to tense, in the manner of 산조 — which begins
 * unhurried and moves into quicker and quicker 장단 as it goes, and is the shape the game's music takes.
 * Each figure played in them is this game's own, shaped after the 장단 it is named for and not
 * transcribed. There is no 진양조: the opening of a game should not crawl.
 */
export const RHYTHMS: readonly Rhythm[] = [JUNGMORI, JUNGJUNGMORI, JAJINMORI];

/**
 * How many steps a round lasts: a cycle of 중모리, or two of either twelve-step 장단. Every 장단 fills a
 * round exactly, so a change of 장단 always waits for the same boundary and never lands mid-cycle; and a
 * round is three of the check theme's eight-step bars, so its bar lines still fall where they did.
 */
export const STEPS_PER_ROUND = 24;
