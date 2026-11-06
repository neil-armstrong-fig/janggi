import type {MovementPoint} from "@src/react/pages/learn/components/pieces/components/piece-card/components/movement-snapshot/types/MovementPoint";
import type {MovementRoute} from "@src/react/pages/learn/components/pieces/components/piece-card/components/movement-snapshot/routes/types/MovementRoute";

/**
 * The eight routes of a piece that steps one point straight, then the given number of points diagonally outward:
 * one diagonal step for the horse (마), two for the elephant (상). Each route keeps every point it passes over,
 * because any of them taken by a piece stops it (`docs/rules.md` 4.3 and 4.4).
 */
export function routesOf(diagonalSteps: number): MovementRoute[] {
  return STRAIGHT_STEPS.flatMap(straight => {
    return sidewaysOf(straight).map(sideways => routeOf({straight, sideways, diagonalSteps}));
  });
}

interface RouteShape {
  readonly straight: MovementPoint;
  readonly sideways: MovementPoint;
  readonly diagonalSteps: number;
}

function sidewaysOf(straight: MovementPoint): MovementPoint[] {
  return [
    {file: -straight.rank, rank: straight.file},
    {file: straight.rank, rank: -straight.file},
  ].sort((first, second) => first.file - second.file || first.rank - second.rank);
}

function routeOf({straight, sideways, diagonalSteps}: RouteShape): MovementRoute {
  const leg = {file: CENTRE + straight.file, rank: CENTRE + straight.rank};
  const diagonal = {file: straight.file + sideways.file, rank: straight.rank + sideways.rank};
  const onward = Array.from({length: diagonalSteps}, (_, index) => {
    return {file: leg.file + diagonal.file * (index + 1), rank: leg.rank + diagonal.rank * (index + 1)};
  });

  return {points: [{file: CENTRE, rank: CENTRE}, leg, ...onward]};
}

const CENTRE = 3;

/** Up, right, down and left, in that order. */
const STRAIGHT_STEPS: readonly MovementPoint[] = [
  {file: 0, rank: -1},
  {file: 1, rank: 0},
  {file: 0, rank: 1},
  {file: -1, rank: 0},
];
