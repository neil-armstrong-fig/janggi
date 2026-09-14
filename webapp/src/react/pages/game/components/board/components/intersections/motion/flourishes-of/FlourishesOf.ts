import type {Flourish} from "@src/react/pages/game/components/board/types/Flourish";
import type {GameMoment} from "@src/react/pages/game/types/GameMoment";
import type {GameState} from "@src/game/types/GameState";
import type {PositionKey} from "@src/game/board/types/Position";
import {dealDelay} from "@src/react/pages/game/components/board/components/intersections/motion/flourishes-of/deal-delay/DealDelay";
import {toPositionKey} from "@src/game/board/PositionKeys";

/**
 * Which pieces show a change in place, keyed by the point each stands on.
 *
 * A new deal sets out every piece on the board, each at its own moment in the order `dealDelay` gives.
 * A rested turn lifts the resting army's general and sets it back down — which is how 한수쉼 is signalled
 * over a real board, a player picking up their general and putting it back.
 *
 * Nothing flourishes for a turn taken back, since nothing was done; nor for a move, which flies.
 */
export function flourishesOf(moment: GameMoment | undefined, game: GameState): ReadonlyMap<PositionKey, Flourish> {
  if (!moment) return NONE;

  if (moment.direction === "dealt") {
    return new Map<PositionKey, Flourish>(
      game.pieces.map(({position}) => [
        toPositionKey(position),
        {id: moment.id, kind: "dealt", delay: dealDelay(position)},
      ]),
    );
  }

  const transition = moment.transition;
  if (moment.direction === "takenBack" || transition?.kind !== "passed") return NONE;

  const general = game.pieces.find(({piece}) => piece.side === transition.side && piece.type === "general");
  if (!general) return NONE;

  return new Map<PositionKey, Flourish>([[toPositionKey(general.position), {id: moment.id, kind: "rested", delay: 0}]]);
}

const NONE: ReadonlyMap<PositionKey, Flourish> = new Map();
