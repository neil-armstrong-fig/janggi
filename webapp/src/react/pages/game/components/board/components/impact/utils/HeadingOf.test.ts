import {expect, it} from "vitest";
import {headingOf} from "@src/react/pages/game/components/board/components/impact/utils/HeadingOf";

it("points one unit along a straight move, however far it went", () => {
  expect(headingOf({from: {file: 1, rank: 10}, to: {file: 1, rank: 4}})).toEqual({x: 0, y: -1});
  expect(headingOf({from: {file: 1, rank: 4}, to: {file: 2, rank: 4}})).toEqual({x: 1, y: 0});
});

it("points along a diagonal move, still one unit long", () => {
  const heading = headingOf({from: {file: 4, rank: 1}, to: {file: 5, rank: 2}});

  expect(heading.x).toBeCloseTo(Math.SQRT1_2);
  expect(heading.y).toBeCloseTo(Math.SQRT1_2);
});

it("points nowhere for a move that went nowhere, rather than dividing by nothing", () => {
  expect(headingOf({from: {file: 5, rank: 5}, to: {file: 5, rank: 5}})).toEqual({x: 0, y: 0});
});
