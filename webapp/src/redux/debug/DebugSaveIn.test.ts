import {DEFAULT_BOARD_MARKS} from "@src/styles/defaults/DefaultBoardMarks";
import {expect, it} from "vitest";
import {debugSaveIn} from "@src/redux/debug/DebugSaveIn";

it("reads the progress a debug message asks for", () => {
  const progress = {xp: 640, beaten: {Casual: {cho: [800], han: []}, Scored: {cho: [], han: []}}};

  expect(debugSaveIn({janggi: "debug", progress})).toEqual({
    progress,
    customStyles: {boards: [], pieceSets: []},
  });
});

it("takes a bare amount of XP as the progress", () => {
  expect(debugSaveIn({janggi: "debug", progress: 640})?.progress.xp).toBe(640);
});

it("carries styles too, as a save does", () => {
  const board = {
    name: "Posted",
    surface: "#000000",
    defaultCell: {stroke: "#ffffff", strokeWidth: 1},
    lastMove: {wash: "rgba(255, 255, 255, 0.2)", brackets: "#ffffff"},
  };

  expect(debugSaveIn({janggi: "debug", progress: 0, customStyles: {boards: [board]}})?.customStyles.boards).toEqual([
    {...board, ...DEFAULT_BOARD_MARKS},
  ]);
});

it("leaves alone every message that is not one of ours", () => {
  expect(debugSaveIn({type: "webpackHot", progress: 640})).toBeUndefined();
  expect(debugSaveIn("janggi")).toBeUndefined();
  expect(debugSaveIn(undefined)).toBeUndefined();
});

it("leaves alone one of ours that asks for no progress", () => {
  expect(debugSaveIn({janggi: "debug"})).toBeUndefined();
  expect(debugSaveIn({janggi: "debug", progress: "lots"})).toBeUndefined();
});
