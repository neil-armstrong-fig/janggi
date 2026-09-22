import {expect, it} from "vitest";
import {sideOfPosition} from "@src/game/board/halves/SideOfPosition";

it("names han's half the top five ranks", () => {
  for (let rank = 1; rank <= 5; rank++) {
    expect(sideOfPosition({file: 5, rank: rank as 1 | 2 | 3 | 4 | 5})).toBe("han");
  }
});

it("names cho's half the bottom five ranks", () => {
  for (let rank = 6; rank <= 10; rank++) {
    expect(sideOfPosition({file: 5, rank: rank as 6 | 7 | 8 | 9 | 10})).toBe("cho");
  }
});

it("draws the line exactly where the palaces do", () => {
  // Han's palace centre is rank 2, Cho's rank 9 (Palaces.ts) — the halves meet at the midline between them.
  expect(sideOfPosition({file: 5, rank: 2})).toBe("han");
  expect(sideOfPosition({file: 5, rank: 9})).toBe("cho");
});

it("ignores the file", () => {
  expect(sideOfPosition({file: 1, rank: 3})).toBe("han");
  expect(sideOfPosition({file: 9, rank: 3})).toBe("han");
});
