import {expect, it} from "vitest";
import {DEFAULT_SETUP} from "@janggi/engine/setups/Setups";
import {drawAccepted, moved, passed} from "@src/redux/slices/game/GameSlice";
import {newGame} from "@janggi/engine/NewGame";
import {pass} from "@janggi/engine/passing/Pass";
import {scriptedAnswerOf} from "@src/react/pages/game/hooks/use-scripted-opponent/answer/ScriptedAnswerOf";
import type {TutorialStep} from "@src/react/pages/game/tutorial/types/TutorialStep";

const HANS_TURN = pass(newGame(DEFAULT_SETUP, DEFAULT_SETUP, "Casual"));
const HANS_MOVE = {from: {file: 3, rank: 4}, to: {file: 3, rank: 5}} as const;

it("is Han's move, where the rules allow it", () => {
  const step: TutorialStep = {actor: "opponent", turn: {kind: "move", move: HANS_MOVE}};

  expect(scriptedAnswerOf(step, HANS_TURN, false)).toEqual(moved(HANS_MOVE));
});

it("is nothing where the rules would refuse Han's move", () => {
  const illegal = {from: {file: 3, rank: 4}, to: {file: 3, rank: 6}} as const;
  const step: TutorialStep = {actor: "opponent", turn: {kind: "move", move: illegal}};

  expect(scriptedAnswerOf(step, HANS_TURN, false)).toBeUndefined();
});

it("is Han resting its turn", () => {
  const step: TutorialStep = {actor: "opponent", turn: {kind: "pass"}};

  expect(scriptedAnswerOf(step, HANS_TURN, false)).toEqual(passed());
});

it("accepts the draw the player was asked to offer, once they have offered it", () => {
  const step: TutorialStep = {actor: "player", turn: {kind: "draw"}};

  expect(scriptedAnswerOf(step, HANS_TURN, true)).toEqual(drawAccepted());
  expect(scriptedAnswerOf(step, HANS_TURN, false)).toBeUndefined();
});

it("is nothing on any other step of the player's, or once the scene is over", () => {
  const step: TutorialStep = {actor: "player", turn: {kind: "pass"}};

  expect(scriptedAnswerOf(step, HANS_TURN, true)).toBeUndefined();
  expect(scriptedAnswerOf(undefined, HANS_TURN, false)).toBeUndefined();
});
