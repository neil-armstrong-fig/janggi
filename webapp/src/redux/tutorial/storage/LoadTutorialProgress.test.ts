import {expect, it} from "vitest";
import {TUTORIAL_STORAGE_KEY} from "@src/redux/tutorial/storage/TutorialStorageKey";
import {loadTutorialProgress} from "@src/redux/tutorial/storage/LoadTutorialProgress";

const NOT_STARTED = {reached: 0, completed: false};

it("reads back how far the player came", () => {
  expect(loadTutorialProgress(holding({reached: 2, completed: true}))).toEqual({reached: 2, completed: true});
});

it("starts from nothing where nothing is kept, or there is no storage", () => {
  expect(loadTutorialProgress(holding(undefined))).toEqual(NOT_STARTED);
  expect(loadTutorialProgress(undefined)).toEqual(NOT_STARTED);
});

it.each([
  ["a scene that is not a whole number", {reached: 1.5, completed: false}],
  ["a scene before the first", {reached: -1, completed: false}],
  ["a completion that is not yes or no", {reached: 1, completed: "yes"}],
  ["something that is not an object", 7],
])("refuses %s, starting from nothing", (_case, stored) => {
  expect(loadTutorialProgress(holding(stored))).toEqual(NOT_STARTED);
});

function holding(value: unknown): Pick<Storage, "getItem"> {
  return {
    getItem: key => {
      if (key !== TUTORIAL_STORAGE_KEY || value === undefined) return null;

      return JSON.stringify(value);
    },
  };
}
