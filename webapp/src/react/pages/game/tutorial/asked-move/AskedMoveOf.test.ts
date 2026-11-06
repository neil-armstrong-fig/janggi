import {expect, it} from "vitest";
import {askedMoveOf} from "@src/react/pages/game/tutorial/asked-move/AskedMoveOf";
import type {TutorialStep} from "@src/react/pages/game/tutorial/types/TutorialStep";

const MOVE = {from: {file: 3, rank: 7}, to: {file: 3, rank: 6}} as const;
const PLAYERS: TutorialStep = {actor: "player", turn: {kind: "move", move: MOVE}};
const OPPONENTS: TutorialStep = {actor: "opponent", turn: {kind: "move", move: MOVE}};
const A_PASS: TutorialStep = {actor: "player", turn: {kind: "pass"}};

it("is the step's move, for the one whose step it is", () => {
  expect(askedMoveOf({scene: 0, step: PLAYERS, number: 1}, "player")).toBe(MOVE);
  expect(askedMoveOf({scene: 0, step: OPPONENTS, number: 2}, "opponent")).toBe(MOVE);
});

it("is nothing for the other", () => {
  expect(askedMoveOf({scene: 0, step: PLAYERS, number: 1}, "opponent")).toBeUndefined();
});

it("is nothing where the step is a control rather than a move", () => {
  expect(askedMoveOf({scene: 3, step: A_PASS, number: 1}, "player")).toBeUndefined();
});

it("is nothing once the scene has run out, or outside the tutorial", () => {
  expect(askedMoveOf({scene: 0, step: undefined, number: 9}, "player")).toBeUndefined();
  expect(askedMoveOf(undefined, "player")).toBeUndefined();
});
