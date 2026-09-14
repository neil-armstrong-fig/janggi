import type {Spring} from "@src/react/pages/game/components/board/hooks/use-board-shake/types/Spring";
import {expect, it} from "vitest";
import {springStep} from "@src/react/pages/game/components/board/hooks/use-board-shake/utils/SpringStep";

it("pulls a board pushed off centre back towards it", () => {
  const after = springStep(pushedRight(10), 1);

  expect(after.position.x).toBeLessThan(10);
});

/** A spring rather than an ease: it overshoots, which is what makes a shake read as a shake. */
it("swings past centre before it settles", () => {
  const positions = run(pushedRight(10), 120).map(({position}) => position.x);

  expect(Math.min(...positions)).toBeLessThan(0);
});

it("comes to rest", () => {
  const settled = run(pushedRight(10), 600).at(-1);

  expect(Math.abs(settled?.position.x ?? Infinity)).toBeLessThan(0.01);
  expect(Math.abs(settled?.velocity.x ?? Infinity)).toBeLessThan(0.01);
});

it("leaves a board at rest where it is", () => {
  expect(springStep(AT_REST, 1)).toEqual(AT_REST);
});

it("moves each axis on its own, so a push along a file swings the board along it and never across", () => {
  const visited = run({position: {x: 0, y: 10}, velocity: {x: 0, y: 0}}, 60);

  expect(visited.every(({position}) => position.x === 0)).toBe(true);
  expect(Math.min(...visited.map(({position}) => position.y))).toBeLessThan(0);
});

/** A slow frame is one long step, and a shake must die away as quickly in those as in short ones. */
it("settles in about the same time whether stepped one frame at a time or two", () => {
  const steady = framesToSettle(pushedRight(10), 1);
  const halting = framesToSettle(pushedRight(10), 2);

  expect(halting).toBeGreaterThan(steady * 0.8);
  expect(halting).toBeLessThan(steady * 1.25);
});

function pushedRight(pixels: number): Spring {
  return {position: {x: pixels, y: 0}, velocity: {x: 0, y: 0}};
}

function framesToSettle(spring: Spring, frames: number): number {
  let current = spring;
  let elapsed = 0;

  while (Math.abs(current.position.x) > 0.01 || Math.abs(current.velocity.x) > 0.01) {
    current = springStep(current, frames);
    elapsed += frames;
    if (elapsed > 10_000) return Infinity;
  }

  return elapsed;
}

function run(spring: Spring, steps: number, frames = 1): Spring[] {
  const visited: Spring[] = [];
  let current = spring;

  for (let step = 0; step < steps; step += 1) {
    current = springStep(current, frames);
    visited.push(current);
  }

  return visited;
}

const AT_REST: Spring = {position: {x: 0, y: 0}, velocity: {x: 0, y: 0}};
