import type {Vector} from "@src/react/pages/game/components/board/types/Vector";
import {expect, it} from "vitest";
import {shakeImpulse} from "@src/react/pages/game/components/board/components/impact/utils/ShakeImpulse";

it("pushes the board down a file when a capture travels down it", () => {
  const impulse = shakeImpulse({from: {file: 3, rank: 2}, to: {file: 3, rank: 7}}, "chariot");

  expect(impulse.x).toBeCloseTo(0);
  expect(impulse.y).toBeGreaterThan(0);
});

it("pushes the board across a rank when a capture travels across it", () => {
  const impulse = shakeImpulse({from: {file: 8, rank: 5}, to: {file: 2, rank: 5}}, "chariot");

  expect(impulse.x).toBeLessThan(0);
  expect(impulse.y).toBeCloseTo(0);
});

it("pushes harder when a chariot is taken than when a soldier is", () => {
  const move = {from: {file: 1, rank: 5}, to: {file: 1, rank: 6}} as const;

  expect(strength(shakeImpulse(move, "chariot"))).toBeGreaterThan(strength(shakeImpulse(move, "soldier")));
});

it("pushes no harder for a capture from far away than from the next point", () => {
  const near = shakeImpulse({from: {file: 1, rank: 5}, to: {file: 1, rank: 6}}, "cannon");
  const far = shakeImpulse({from: {file: 1, rank: 1}, to: {file: 1, rank: 6}}, "cannon");

  expect(strength(far)).toBeCloseTo(strength(near));
});

function strength({x, y}: Vector): number {
  return Math.hypot(x, y);
}
