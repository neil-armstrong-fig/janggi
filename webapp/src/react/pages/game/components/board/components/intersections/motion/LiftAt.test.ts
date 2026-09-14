import {expect, it} from "vitest";
import {liftAt} from "@src/react/pages/game/components/board/components/intersections/motion/LiftAt";
import {toPositionKey} from "@src/game/board/PositionKeys";

const HELD = toPositionKey({file: 1, rank: 7});
const HOVERED = toPositionKey({file: 3, rank: 7});
const ELSEWHERE = toPositionKey({file: 5, rank: 7});

it("lifts the piece in hand clean off the board", () => {
  expect(liftAt(HELD, HELD, HOVERED, true)).toBe("held");
});

it("nudges up the piece under the pointer", () => {
  expect(liftAt(HOVERED, HELD, HOVERED, true)).toBe("hovered");
});

it("lifts the piece in hand rather than nudging it when the pointer rests on it too", () => {
  expect(liftAt(HELD, HELD, HELD, true)).toBe("held");
});

it("leaves every other piece flat", () => {
  expect(liftAt(ELSEWHERE, HELD, HOVERED, true)).toBe("resting");
});

it("lifts nothing while effects are reduced", () => {
  expect(liftAt(HELD, HELD, HOVERED, false)).toBe("resting");
  expect(liftAt(HOVERED, HELD, HOVERED, false)).toBe("resting");
});
