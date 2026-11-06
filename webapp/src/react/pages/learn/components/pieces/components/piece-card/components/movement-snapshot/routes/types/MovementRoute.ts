import type {MovementPoint} from "@src/react/pages/learn/components/pieces/components/piece-card/components/movement-snapshot/types/MovementPoint";

/** Every point a horse or elephant passes over on its way to one destination, from where it stands to where it lands. */
export interface MovementRoute {
  readonly points: readonly MovementPoint[];
}
