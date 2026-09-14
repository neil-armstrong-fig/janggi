import type {Flight} from "@src/react/pages/game/components/board/hooks/use-move-flight/types/Flight";
import type {GameMoment} from "@src/react/pages/game/types/GameMoment";

/**
 * The flight a change to the game should be shown with, or nothing where no piece travelled.
 *
 * A move played or played again flies from where it started and knocks off what it took. A move
 * taken back flies the other way and knocks nothing off: the piece it took reappears where it stood,
 * rather than being taken a second time. A rested turn, a called bikjang and a new deal move no piece
 * anywhere.
 */
export function flightOf(moment: GameMoment | undefined): Flight | undefined {
  if (moment?.transition?.kind !== "moved") return undefined;

  const {move, mover, taken} = moment.transition;

  if (moment.direction === "takenBack") {
    return {id: moment.id, piece: mover, move: {from: move.to, to: move.from}, taken: undefined};
  }

  return {id: moment.id, piece: mover, move, taken};
}
