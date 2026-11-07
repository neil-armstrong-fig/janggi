import {expect, it} from "vitest";
import {withSceneReached} from "@src/redux/slices/tutorial/progress/WithSceneReached";

it("moves on to a scene further than any reached", () => {
  expect(withSceneReached({reached: 1, completed: false}, 3)).toEqual({reached: 3, completed: false});
});

it("keeps the furthest reached when an earlier scene is started", () => {
  const progress = {reached: 3, completed: true};

  expect(withSceneReached(progress, 0)).toBe(progress);
});
