import {expect, it} from "vitest";
import {lookAtOf} from "@src/react/pages/game/components/tutorial/look-at/LookAtOf";
import type {TutorialScene} from "@src/react/pages/game/tutorial/types/TutorialScene";
import type {TutorialStep} from "@src/react/pages/game/tutorial/types/TutorialStep";
import {THE_WHOLE_GAME} from "@src/react/pages/game/tutorial/scenes/TheWholeGame";

const LOOKING_AT_HAN: TutorialScene = {...THE_WHOLE_GAME, endingLookAt: "han"};
const ABOUT_THE_MOVE: TutorialStep = {actor: "player", turn: {kind: "pass"}};

it("looks where the step that is up says, and nowhere where it says nothing, whatever the ending says", () => {
  expect(lookAtOf(LOOKING_AT_HAN, {scene: 0, step: ABOUT_THE_MOVE, number: 1})).toBeUndefined();
});

it("looks where the ending says once the steps have run out", () => {
  expect(lookAtOf(LOOKING_AT_HAN, {scene: 0, step: undefined, number: 36})).toBe("han");
});
