import {expect, it} from "vitest";
import {blockOnRoute} from "@src/react/pages/learn/components/pieces/components/piece-card/components/movement-snapshot/blocking/BlockOnRoute";
import type {MovementBlock} from "@src/react/pages/learn/components/pieces/components/piece-card/components/movement-snapshot/blocking/types/MovementBlock";
import type {MovementRoute} from "@src/react/pages/learn/components/pieces/components/piece-card/components/movement-snapshot/routes/types/MovementRoute";

const ELEPHANT_UP_LEFT: MovementRoute = {
  points: [
    {file: 3, rank: 3},
    {file: 3, rank: 2},
    {file: 2, rank: 1},
    {file: 1, rank: 0},
  ],
};

it("finds a piece standing on the straight step", () => {
  const blocks: MovementBlock[] = [{turn: "first", at: {file: 3, rank: 2}}];

  expect(blockOnRoute(ELEPHANT_UP_LEFT, blocks)).toBe(blocks[0]);
});

it("finds a piece standing on a diagonal step", () => {
  const blocks: MovementBlock[] = [
    {turn: "first", at: {file: 4, rank: 3}},
    {turn: "second", at: {file: 2, rank: 1}},
  ];

  expect(blockOnRoute(ELEPHANT_UP_LEFT, blocks)).toBe(blocks[1]);
});

it("leaves a route alone where nothing stands on it", () => {
  expect(blockOnRoute(ELEPHANT_UP_LEFT, [{turn: "first", at: {file: 4, rank: 2}}])).toBeUndefined();
});

it("does not count a piece on the destination, which is a capture, not a block", () => {
  expect(blockOnRoute(ELEPHANT_UP_LEFT, [{turn: "first", at: {file: 1, rank: 0}}])).toBeUndefined();
});

it("does not count the point the piece starts from", () => {
  expect(blockOnRoute(ELEPHANT_UP_LEFT, [{turn: "first", at: {file: 3, rank: 3}}])).toBeUndefined();
});
