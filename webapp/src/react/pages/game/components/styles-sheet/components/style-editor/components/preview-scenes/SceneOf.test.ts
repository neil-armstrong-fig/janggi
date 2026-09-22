import {SCENE_NAMES} from "@src/react/pages/game/components/styles-sheet/components/style-editor/components/preview-scenes/types/SceneName";
import {bikjangLineIn} from "@src/react/pages/game/components/board/components/bikjang-line/utils/BikjangLineIn";
import {expect, it} from "vitest";
import {sceneOf} from "@src/react/pages/game/components/styles-sheet/components/style-editor/components/preview-scenes/SceneOf";

it("puts all thirty-two pieces on the board in every scene, none having been taken", () => {
  for (const name of SCENE_NAMES) {
    expect(sceneOf(name).game.pieces).toHaveLength(32);
  }
});

it("shows all fourteen kinds of piece in the opening", () => {
  const kinds = new Set(sceneOf("opening").game.pieces.map(({piece}) => `${piece.side}-${piece.type}`));

  expect(kinds.size).toBe(14);
});

it("marks a move just made in the opening", () => {
  expect(sceneOf("opening").lastMove).toEqual({from: {file: 1, rank: 7}, to: {file: 1, rank: 6}});
});

it("holds a piece in the hints scene, and no other scene holds one", () => {
  expect(sceneOf("hints").held).toEqual({file: 1, rank: 10});

  for (const name of SCENE_NAMES.filter(candidate => candidate !== "hints")) {
    expect(sceneOf(name).held).toBeUndefined();
  }
});

it("has han's general in check, from the chariot giving it, in the check scene", () => {
  expect(sceneOf("check").threat).toEqual({general: {file: 4, rank: 2}, attackers: [{file: 4, rank: 9}]});
});

it("is in check in no scene but the check one", () => {
  for (const name of SCENE_NAMES.filter(candidate => candidate !== "check")) {
    expect(sceneOf(name).threat).toBeUndefined();
  }
});

it("draws a bikjang down file 5 in the bikjang scene", () => {
  expect(bikjangLineIn(sceneOf("bikjang").game)).toEqual({from: {file: 5, rank: 2}, to: {file: 5, rank: 9}});
});
