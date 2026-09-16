import {expect, it} from "vitest";
import {progressReducer, xpEarned} from "@src/redux/progress/ProgressSlice";
import type {RewardedGame} from "@src/redux/progress/types/RewardedGame";
import {freshProgress} from "@src/redux/progress/fresh-progress/FreshProgress";
import {noCustomStyles} from "@src/redux/custom-styles/no-custom-styles/NoCustomStyles";
import {saveLoaded} from "@src/redux/saves/SaveLoaded";

const won: RewardedGame = {format: "Casual", botElo: 800, playerSide: "cho", result: "won"};

it("starts a newcomer with no XP and no bot beaten", () => {
  expect(progressReducer(undefined, {type: "test/initialised"})).toEqual(freshProgress());
});

it("adds what a decided game is worth", () => {
  expect(progressReducer({...freshProgress(), xp: 100}, xpEarned({...won, format: "Scored", result: "lost"})).xp).toBe(
    120,
  );
});

it("records a win on the ladder it was won on, and on no other", () => {
  expect(progressReducer(freshProgress(), xpEarned(won)).beaten).toEqual({
    Casual: {cho: [800], han: []},
    Scored: {cho: [], han: []},
  });
});

it("records a scored win on the scored ladder", () => {
  expect(progressReducer(freshProgress(), xpEarned({...won, format: "Scored"})).beaten).toEqual({
    Casual: {cho: [], han: []},
    Scored: {cho: [800], han: []},
  });
});

it("records a win as Han on Han's ladder", () => {
  expect(progressReducer(freshProgress(), xpEarned({...won, botElo: 1000, playerSide: "han"})).beaten).toEqual({
    Casual: {cho: [], han: [1000]},
    Scored: {cho: [], han: []},
  });
});

it("records no bot beaten by a game that was not won", () => {
  expect(progressReducer(freshProgress(), xpEarned({...won, result: "drawn"})).beaten).toEqual(freshProgress().beaten);
});

it("records each strength beaten once, however often it is beaten", () => {
  const twice = progressReducer(progressReducer(freshProgress(), xpEarned(won)), xpEarned(won));

  expect(twice.beaten.Casual.cho).toEqual([800]);
});

it("never counts XP past the largest whole number it can hold", () => {
  const nearlyFull = {...freshProgress(), xp: Number.MAX_SAFE_INTEGER - 5};

  expect(progressReducer(nearlyFull, xpEarned(won)).xp).toBe(Number.MAX_SAFE_INTEGER);
});

it("is replaced whole by a loaded save, even one holding less", () => {
  const loaded = {...freshProgress(), xp: 5};
  const climbed = {xp: 900, beaten: {...freshProgress().beaten, Casual: {cho: [800 as const], han: []}}};

  expect(progressReducer(climbed, saveLoaded({progress: loaded, customStyles: noCustomStyles()}))).toEqual(loaded);
});
