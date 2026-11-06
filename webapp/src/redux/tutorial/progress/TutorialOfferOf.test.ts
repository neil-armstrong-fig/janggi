import {expect, it} from "vitest";
import {tutorialOfferOf} from "@src/redux/tutorial/progress/TutorialOfferOf";

it("offers to start a tutorial never begun", () => {
  expect(tutorialOfferOf({reached: 0, completed: false})).toBe("start");
});

it("offers to resume one come part way through", () => {
  expect(tutorialOfferOf({reached: 2, completed: false})).toBe("resume");
});

it("offers to play one completed again", () => {
  expect(tutorialOfferOf({reached: 0, completed: true})).toBe("again");
});

it("offers to resume one part way through a second time", () => {
  expect(tutorialOfferOf({reached: 3, completed: true})).toBe("resume");
});
