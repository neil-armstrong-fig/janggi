import {expect, it} from "vitest";
import {A_BIKJANG} from "@src/react/pages/game/tutorial/scenes/ABikjang";
import {ENGLISH_TUTORIAL_MESSAGES} from "@src/language/tutorial/tutorial-messages/english/EnglishTutorialMessages";
import {nextSceneNameOf} from "@src/react/pages/game/components/tutorial/card-words/NextSceneNameOf";
import type {TutorialStep} from "@src/react/pages/game/tutorial/types/TutorialStep";

const STEP: TutorialStep = {actor: "player", turn: {kind: "pass"}};

it("offers nothing next while a step is still up", () => {
  expect(nextSceneNameOf({scene: 0, step: STEP, number: 1}, A_BIKJANG, ENGLISH_TUTORIAL_MESSAGES)).toBeUndefined();
});

it("names the scene after once this one is over", () => {
  expect(nextSceneNameOf({scene: 0, step: undefined, number: 36}, A_BIKJANG, ENGLISH_TUTORIAL_MESSAGES)).toBe(
    "빅장 · Bikjang",
  );
});

it("names the closing card after the last scene", () => {
  expect(nextSceneNameOf({scene: 4, step: undefined, number: 2}, undefined, ENGLISH_TUTORIAL_MESSAGES)).toBe(
    "시간패 · Time",
  );
});
