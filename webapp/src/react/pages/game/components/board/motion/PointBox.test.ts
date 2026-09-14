import {FILE_COUNT, RANK_COUNT} from "@src/game/board/BoardDimensions";
import {BOARD_POSITIONS} from "@src/react/pages/game/components/board/components/intersections/utils/BoardPositions";
import {expect, it} from "vitest";
import {pointBox} from "@src/react/pages/game/components/board/motion/PointBox";

it("puts the first intersection in the top left cell", () => {
  expect(pointBox({file: 1, rank: 1})).toEqual({left: 0, top: 0, width: 1 / FILE_COUNT, height: 1 / RANK_COUNT});
});

it("puts the last intersection in the bottom right cell", () => {
  expect(pointBox({file: 9, rank: 10})).toMatchObject({left: 8 / FILE_COUNT, top: 9 / RANK_COUNT});
});

/**
 * The grid places a cell by its index in `BOARD_POSITIONS`, not by its file and rank. An overlay put
 * on a point by arithmetic lands on the right cell only if the two agree, for every point.
 */
it("agrees with the order the board lays its cells out in, for every intersection", () => {
  BOARD_POSITIONS.forEach((position, index) => {
    expect({position, box: pointBox(position)}).toMatchObject({
      position,
      box: {left: (index % FILE_COUNT) / FILE_COUNT, top: Math.floor(index / FILE_COUNT) / RANK_COUNT},
    });
  });
});
