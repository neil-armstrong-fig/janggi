import type {BoardEdge} from "@src/react/pages/game/components/tutorial/card-dock/types/BoardEdge";
import type {Side} from "@janggi/shared/janggi/pieces/Side";

/** The edge of the board an army's side is drawn at in the tutorial, which never turns the board: Han's at the top. */
export function edgeOf(side: Side | undefined): BoardEdge | undefined {
  if (side === undefined) return undefined;

  if (side === "han") {
    return "top";
  }

  return "bottom";
}
