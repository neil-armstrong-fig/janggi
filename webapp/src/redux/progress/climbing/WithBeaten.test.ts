import {expect, it} from "vitest";
import {freshProgress} from "@src/redux/progress/fresh-progress/FreshProgress";
import {withBeaten} from "@src/redux/progress/climbing/WithBeaten";

const NOTHING_BEATEN = freshProgress().beaten;

it("marks a rung beaten on the ladder it was beaten on", () => {
  expect(withBeaten(NOTHING_BEATEN, "Casual", "cho", 800)).toEqual({
    Casual: {cho: [800], han: []},
    Scored: {cho: [], han: []},
  });
});

it("leaves the other three ladders alone", () => {
  expect(withBeaten(NOTHING_BEATEN, "Scored", "han", 1000)).toEqual({
    Casual: {cho: [], han: []},
    Scored: {cho: [], han: [1000]},
  });
});

it("keeps the rungs already climbed", () => {
  const climbed = withBeaten(NOTHING_BEATEN, "Casual", "cho", 800);

  expect(withBeaten(climbed, "Casual", "cho", 1000).Casual.cho).toEqual([800, 1000]);
});

it("adds a rung already beaten no second time", () => {
  const climbed = withBeaten(NOTHING_BEATEN, "Casual", "cho", 800);

  expect(withBeaten(climbed, "Casual", "cho", 800)).toBe(climbed);
});
