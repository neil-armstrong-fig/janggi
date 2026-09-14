import {chipPaths} from "@src/react/pages/game/components/board/components/impact/utils/ChipPaths";
import {expect, it} from "vitest";

const DOWN_A_FILE = {x: 0, y: 1};

it("throws as many chips as it is asked for", () => {
  expect(chipPaths(7, DOWN_A_FILE, 1)).toHaveLength(7);
});

it("throws every chip ahead of the capture, never back the way the piece came", () => {
  for (let seed = 1; seed <= 50; seed += 1) {
    for (const chip of chipPaths(10, DOWN_A_FILE, seed)) {
      expect({seed, chip, ahead: chip.down > 0}).toMatchObject({ahead: true});
    }
  }
});

it("throws chips ahead of a capture whichever way it travelled", () => {
  const leftwards = {x: -1, y: 0};

  expect(chipPaths(10, leftwards, 4).every(chip => chip.across < 0)).toBe(true);
});

it("throws the very same chips for the same capture, however often it is drawn", () => {
  expect(chipPaths(6, DOWN_A_FILE, 12)).toEqual(chipPaths(6, DOWN_A_FILE, 12));
});

it("scatters the chips of another capture differently", () => {
  expect(chipPaths(6, DOWN_A_FILE, 12)).not.toEqual(chipPaths(6, DOWN_A_FILE, 13));
});

it("gives each chip a key of its own", () => {
  const ids = chipPaths(10, DOWN_A_FILE, 1).map(({id}) => id);

  expect(new Set(ids).size).toBe(10);
});
