import {expect, it} from "vitest";
import {askedTargetOf} from "@src/react/pages/game/components/tutorial/asked-target/AskedTargetOf";
import type {TutorialStep} from "@src/react/pages/game/tutorial/types/TutorialStep";

const A_MOVE: TutorialStep = {
  actor: "player",
  turn: {kind: "move", move: {from: {file: 3, rank: 7}, to: {file: 3, rank: 6}}},
};
const A_CALL: TutorialStep = {actor: "player", turn: {kind: "bikjang"}};
const HANS_PASS: TutorialStep = {actor: "opponent", turn: {kind: "pass"}};

it("is a point on the board for a move", () => {
  expect(askedTargetOf({scene: 0, step: A_MOVE, number: 1})).toBe("point");
});

it("is the control a step asks the player to press", () => {
  expect(askedTargetOf({scene: 1, step: A_CALL, number: 3})).toBe("bikjang");
});

it("is nothing on Han's step, once the scene is over, or outside the tutorial", () => {
  expect(askedTargetOf({scene: 3, step: HANS_PASS, number: 2})).toBeUndefined();
  expect(askedTargetOf({scene: 1, step: undefined, number: 4})).toBeUndefined();
  expect(askedTargetOf(undefined)).toBeUndefined();
});
