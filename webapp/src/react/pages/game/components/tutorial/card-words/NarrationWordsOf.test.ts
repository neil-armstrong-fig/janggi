import {expect, it} from "vitest";
import {narrationWordsOf} from "@src/react/pages/game/components/tutorial/card-words/NarrationWordsOf";
import type {TutorialSceneWords} from "@src/language/tutorial/tutorial-scene-words/TutorialSceneWords";
import type {TutorialStep} from "@src/react/pages/game/tutorial/types/TutorialStep";

const FIRST = {title: "First", body: "The first step."};
const SECOND = {title: "Second", body: "The second step."};
const ENDING = {title: "Over", body: "The scene is over."};
const WORDS: TutorialSceneWords = {name: "A scene", steps: [FIRST, SECOND], ending: ENDING};
const STEP: TutorialStep = {actor: "player", turn: {kind: "pass"}};

it("says the words at the step's place in the scene, counting from one", () => {
  expect(narrationWordsOf(WORDS, {scene: 0, step: STEP, number: 2})).toBe(SECOND);
});

it("says the ending once the scene's steps have run out", () => {
  expect(narrationWordsOf(WORDS, {scene: 0, step: undefined, number: 3})).toBe(ENDING);
});
