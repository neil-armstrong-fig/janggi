import type {MovementBlock} from "@src/react/pages/learn/components/pieces/components/piece-card/components/movement-snapshot/blocking/types/MovementBlock";
import type {MovementRoute} from "@src/react/pages/learn/components/pieces/components/piece-card/components/movement-snapshot/routes/types/MovementRoute";

/**
 * The piece standing on a route's way, if one does: on any point between where the piece starts and where it lands.
 * A piece on the destination itself would be captured, so it blocks nothing.
 */
export function blockOnRoute(route: MovementRoute, blocks: readonly MovementBlock[]): MovementBlock | undefined {
  const between = route.points.slice(1, -1);

  return blocks.find(block => {
    return between.some(point => point.file === block.at.file && point.rank === block.at.rank);
  });
}
