import {expect, it} from "vitest";
import {routesOf} from "@src/react/pages/learn/components/pieces/components/piece-card/components/movement-snapshot/routes/RoutesOf";

it("gives a horse one straight step and one diagonal step outward, eight ways", () => {
  const routes = routesOf(1);

  expect(routes).toHaveLength(8);
  expect(routes[0]?.points).toEqual([
    {file: 3, rank: 3},
    {file: 3, rank: 2},
    {file: 2, rank: 1},
  ]);
  expect(routes.map(route => route.points.at(-1))).toEqual(
    expect.arrayContaining([
      {file: 1, rank: 2},
      {file: 1, rank: 4},
      {file: 2, rank: 1},
      {file: 4, rank: 1},
      {file: 5, rank: 2},
      {file: 5, rank: 4},
      {file: 2, rank: 5},
      {file: 4, rank: 5},
    ]),
  );
});

it("gives an elephant one straight step and two diagonal steps outward, eight ways", () => {
  const routes = routesOf(2);

  expect(routes).toHaveLength(8);
  expect(routes[0]?.points).toEqual([
    {file: 3, rank: 3},
    {file: 3, rank: 2},
    {file: 2, rank: 1},
    {file: 1, rank: 0},
  ]);
  expect(routes.map(route => route.points.at(-1))).toEqual(
    expect.arrayContaining([
      {file: 0, rank: 1},
      {file: 0, rank: 5},
      {file: 1, rank: 0},
      {file: 5, rank: 0},
      {file: 6, rank: 1},
      {file: 6, rank: 5},
      {file: 1, rank: 6},
      {file: 5, rank: 6},
    ]),
  );
});
