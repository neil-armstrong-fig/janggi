import {dealDelay} from "@src/react/pages/game/components/board/components/intersections/motion/flourishes-of/deal-delay/DealDelay";
import {expect, it} from "vitest";

it("sets out each army's back rank first", () => {
  expect(dealDelay({file: 5, rank: 1})).toBe(0);
  expect(dealDelay({file: 5, rank: 10})).toBe(0);
});

it("sets out each army from its back rank towards the river", () => {
  expect(dealDelay({file: 1, rank: 4})).toBeGreaterThan(dealDelay({file: 1, rank: 1}));
  expect(dealDelay({file: 1, rank: 7})).toBeGreaterThan(dealDelay({file: 1, rank: 10}));
});

it("sets out a rank from the middle file outwards", () => {
  expect(dealDelay({file: 1, rank: 10})).toBeGreaterThan(dealDelay({file: 4, rank: 10}));
  expect(dealDelay({file: 9, rank: 10})).toBe(dealDelay({file: 1, rank: 10}));
});

it("sets out the two armies at once, mirrored across the river", () => {
  expect(dealDelay({file: 3, rank: 3})).toBe(dealDelay({file: 3, rank: 8}));
});

it("finishes setting out a rank before starting on the next", () => {
  expect(dealDelay({file: 5, rank: 2})).toBeGreaterThan(dealDelay({file: 1, rank: 1}));
});
