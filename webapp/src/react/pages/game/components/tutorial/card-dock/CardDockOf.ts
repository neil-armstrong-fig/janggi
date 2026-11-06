import type {BoardEdge} from "@src/react/pages/game/components/tutorial/card-dock/types/BoardEdge";
import type {CardDock} from "@src/react/pages/game/components/tutorial/card-dock/types/CardDock";
import type {CardDocking} from "@src/react/pages/game/components/tutorial/card-dock/types/CardDocking";
import type {TargetRect} from "@src/react/pages/game/hooks/use-target-rect/UseTargetRect";
import {BOARD_EDGES} from "@src/react/pages/game/components/tutorial/card-dock/types/BoardEdge";

/** Where the card may stand away from each edge of the board, in the order it would rather. */
const AWAY_FROM: Record<BoardEdge, readonly CardDock[]> = {
  top: ["bottom", "lowest"],
  bottom: ["top"],
};

/**
 * Where the tutorial's card stands: never over the ring; then away from the side of the board the words are about,
 * where the words say (`TutorialStep.lookAt`) — over the row of controls if nothing higher is clear, the one place
 * it covers Settings; and otherwise at whichever edge covers less of the board. Only standing away from the ring put a
 * phone's card over Han's palace whenever the ring was on Cho's side, though the words were about Han's general. Where
 * neither edge is better, or before the card and the board are measured, it stands away from the ring.
 */
export function cardDockOf(docking: CardDocking): CardDock {
  const away = awayFromTheRing(docking);
  const {ring, board, card, lookingAt} = docking;
  if (board === undefined || card === undefined) return away;

  const clearOfTheRing = (dock: CardDock): boolean => {
    return ring === undefined || overlapOf(cardAt(dock, card, docking), ring) === 0;
  };

  if (lookingAt !== undefined) {
    const clear = AWAY_FROM[lookingAt].find(clearOfTheRing);
    if (clear !== undefined) return clear;
  }

  const open = BOARD_EDGES.filter(clearOfTheRing);
  if (open.length === 0) return away;

  const [first] = open;
  if (open.length === 1 && first !== undefined) return first;

  const coveredAtTop = overlapOf(cardAt("top", card, docking), board);
  const coveredAtBottom = overlapOf(cardAt("bottom", card, docking), board);
  if (coveredAtTop === coveredAtBottom) return away;

  if (coveredAtTop < coveredAtBottom) {
    return "top";
  }

  return "bottom";
}

function awayFromTheRing({ring, viewportHeight}: CardDocking): CardDock {
  if (ring !== undefined && ring.top + ring.height / 2 > viewportHeight / 2) {
    return "top";
  }

  return "bottom";
}

/** Where the card would stand at `dock`: the same size, and the same left and right, wherever it stands. */
function cardAt(dock: CardDock, card: TargetRect, {topEdge, bottomEdge, lowestEdge}: CardDocking): TargetRect {
  if (dock === "top") {
    return {...card, top: topEdge};
  }

  if (dock === "bottom") {
    return {...card, top: bottomEdge - card.height};
  }

  return {...card, top: lowestEdge - card.height};
}

/** How many square pixels two rectangles share. */
function overlapOf(a: TargetRect, b: TargetRect): number {
  const width = Math.min(a.left + a.width, b.left + b.width) - Math.max(a.left, b.left);
  const height = Math.min(a.top + a.height, b.top + b.height) - Math.max(a.top, b.top);

  return Math.max(width, 0) * Math.max(height, 0);
}
