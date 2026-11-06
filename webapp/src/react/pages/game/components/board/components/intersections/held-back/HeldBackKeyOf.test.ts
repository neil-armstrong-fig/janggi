import {expect, it} from "vitest";
import {heldBackKeyOf} from "@src/react/pages/game/components/board/components/intersections/held-back/HeldBackKeyOf";
import type {TutorialStep} from "@src/react/pages/game/tutorial/types/TutorialStep";

const STEP: TutorialStep = {
  actor: "player",
  turn: {kind: "move", move: {from: {file: 1, rank: 9}, to: {file: 1, rank: 5}}},
};

const HOLDING_BACK: TutorialStep = {...STEP, heldBack: {from: {file: 1, rank: 9}, to: {file: 1, rank: 10}}};

it("marks where the held-back move would have gone", () => {
  expect(heldBackKeyOf({scene: 2, step: HOLDING_BACK, number: 8})).toBe("f1r10");
});

it("marks nothing on a step that holds nothing back", () => {
  expect(heldBackKeyOf({scene: 2, step: STEP, number: 8})).toBeUndefined();
});

it("marks nothing outside the tutorial", () => {
  expect(heldBackKeyOf(undefined)).toBeUndefined();
});
