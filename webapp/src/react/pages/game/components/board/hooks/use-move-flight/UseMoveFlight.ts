import type {Flight} from "@src/react/pages/game/components/board/hooks/use-move-flight/types/Flight";
import type {GameMoment} from "@src/react/pages/game/types/GameMoment";
import type {PositionKey} from "@src/game/board/types/Position";
import {flightOf} from "@src/react/pages/game/components/board/hooks/use-move-flight/utils/FlightOf";
import {toPositionKey} from "@src/game/board/PositionKeys";
import {useMemo, useState} from "react";

/** The flight the latest change is shown with, how far through being shown it is, and the two calls that move it on. */
export interface ShownFlight {
  /** Undefined where no piece travelled, or while effects are reduced. */
  readonly flight: Flight | undefined;
  /** Whether the piece is still in the air. */
  readonly flying: boolean;
  /** Whether what it took is still being knocked off its point. */
  readonly landing: boolean;
  /** The point whose own piece is hidden while its copy flies in. */
  readonly concealed: PositionKey | undefined;
  /** Called when the piece touches down. */
  readonly land: () => void;
  /** Called when everything the landing threw off has come to rest. */
  readonly settle: () => void;
}

/**
 * The flight a change to the game is shown with, and where that has got to.
 *
 * A piece in flight and the capture it lands are two overlays with lives of their own, each drawn until
 * it says it has finished, while the cell the piece is going to keeps its own copy hidden. Which has
 * finished is remembered by the id of the moment it showed rather than as a flag, so one change is shown
 * once, and the next is shown from its start with nothing to reset.
 *
 * Nothing flies while effects are reduced: the piece is simply where it now stands.
 */
export function useMoveFlight(moment: GameMoment | undefined, animated: boolean): ShownFlight {
  const flight = useMemo(() => (animated ? flightOf(moment) : undefined), [animated, moment]);
  const [landed, setLanded] = useState<number | undefined>(undefined);
  const [settled, setSettled] = useState<number | undefined>(undefined);
  const flying = flight !== undefined && landed !== flight.id;

  return {
    flight,
    flying,
    landing: flight?.taken !== undefined && settled !== flight.id,
    concealed: flight && flying ? toPositionKey(flight.move.to) : undefined,
    land: () => setLanded(flight?.id),
    settle: () => setSettled(flight?.id),
  };
}
