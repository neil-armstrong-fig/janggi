import {expect, it} from "vitest";
import {A_REPETITION} from "@src/react/pages/game/tutorial/scenes/ARepetition";
import {TUTORIAL_SCENES} from "@src/react/pages/game/tutorial/TutorialScenes";
import {tutorialEntryOf} from "@src/react/pages/game/tutorial/entry/TutorialEntryOf";

it("resumes at the start of the furthest scene reached", () => {
  expect(tutorialEntryOf({reached: 2, completed: false})).toEqual({scene: 2, start: A_REPETITION.start});
});

it("has nothing to resume where no scene after the first was reached", () => {
  expect(tutorialEntryOf({reached: 0, completed: true})).toBeUndefined();
});

it("resumes nowhere at a scene there no longer is", () => {
  expect(tutorialEntryOf({reached: TUTORIAL_SCENES.length, completed: false})).toBeUndefined();
});
