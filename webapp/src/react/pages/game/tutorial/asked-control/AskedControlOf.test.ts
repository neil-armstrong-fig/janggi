import {expect, it} from "vitest";
import {askedControlOf} from "@src/react/pages/game/tutorial/asked-control/AskedControlOf";
import type {TutorialStep} from "@src/react/pages/game/tutorial/types/TutorialStep";

const PLAYERS_PASS: TutorialStep = {actor: "player", turn: {kind: "pass"}};
const HANS_PASS: TutorialStep = {actor: "opponent", turn: {kind: "pass"}};
const A_MOVE: TutorialStep = {
  actor: "player",
  turn: {kind: "move", move: {from: {file: 3, rank: 7}, to: {file: 3, rank: 6}}},
};

it("is the control the player's step asks for", () => {
  expect(askedControlOf({scene: 3, step: PLAYERS_PASS, number: 1})).toBe("pass");
});

it("is nothing on Han's step, which the script takes", () => {
  expect(askedControlOf({scene: 3, step: HANS_PASS, number: 2})).toBeUndefined();
});

it("is nothing where the step is a move, or there is none", () => {
  expect(askedControlOf({scene: 0, step: A_MOVE, number: 1})).toBeUndefined();
  expect(askedControlOf({scene: 0, step: undefined, number: 36})).toBeUndefined();
  expect(askedControlOf(undefined)).toBeUndefined();
});
