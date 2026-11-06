import {expect, it} from "vitest";
import type {TutorialSituation} from "@src/react/pages/game/tutorial/types/TutorialSituation";
import {tutorialPointOf} from "@src/react/pages/game/components/board/components/intersections/tutorial-point/TutorialPointOf";

const PLAYERS: TutorialSituation = {
  scene: 0,
  step: {
    actor: "player",
    turn: {kind: "move", move: {from: {file: 3, rank: 7}, to: {file: 3, rank: 6}}},
  },
  number: 1,
};
const OPPONENTS: TutorialSituation = {
  scene: 0,
  step: {
    actor: "opponent",
    turn: {kind: "move", move: {from: {file: 3, rank: 4}, to: {file: 3, rank: 5}}},
  },
  number: 2,
};
const RUN_OUT: TutorialSituation = {scene: 0, step: undefined, number: 5};
const TOUR_POINT = "f1r7";

it("points at the piece to move while nothing is in hand", () => {
  expect(tutorialPointOf(PLAYERS, undefined, TOUR_POINT)).toBe("f3r7");
});

it("points at where to put it once it is in hand", () => {
  expect(tutorialPointOf(PLAYERS, {file: 3, rank: 7}, TOUR_POINT)).toBe("f3r6");
});

it("points at nothing while the other army's answer is coming", () => {
  expect(tutorialPointOf(OPPONENTS, undefined, TOUR_POINT)).toBeUndefined();
});

it("points at nothing once the script has run out", () => {
  expect(tutorialPointOf(RUN_OUT, undefined, TOUR_POINT)).toBeUndefined();
});

it("is the tour's point outside the tutorial", () => {
  expect(tutorialPointOf(undefined, undefined, TOUR_POINT)).toBe(TOUR_POINT);
});
