import {useMessages} from "@src/react/pages/game/hooks/use-messages/UseMessages";
import {Piece} from "@src/react/pages/game/components/board/components/piece/Piece";
import type {PieceSetStyle} from "@src/styles/types/PieceSetStyle";
import type {PieceType} from "@janggi/shared/janggi/pieces/PieceType";
import type {Side} from "@janggi/shared/janggi/pieces/Side";
import {clsx} from "clsx";
import {takenSlotsFrom} from "@src/react/pages/game/components/status/components/player-plaque/components/taken-tray/slots/TakenSlotsFrom";

/**
 * What one army has lost: one place per kind, most valuable first, each with the piece drawn small in the set the board
 * is wearing and, where more than one has gone, how many.
 *
 * **A kind always stands in its own place**, and a place with nothing in it stays empty and keeps its space. So the tray
 * is the same width from the first capture to the last, nothing moves when a piece is taken, and the two armies' trays
 * line up. Fifteen separate pieces squeezed together across a phone were too noisy to read.
 *
 * Only on the narrowest phones, under 340px, are the places a little smaller, which is all it takes for the plaque to fit.
 *
 * Drawn with the board's own `Piece` rather than a second, smaller drawing of it, so a set someone authors is worn here
 * without anything learning it exists. A kind's place says what it holds in `data-type` and `data-count`, which is what
 * the acceptance tests read.
 *
 * The piece is keyed by its count, so that another of a kind being lost pops it again.
 */
interface Props {
  readonly side: Side;
  readonly taken: readonly PieceType[];
  readonly pieceStyle: PieceSetStyle;
  /** Whether a piece newly lost pops into the tray, rather than simply appearing. */
  readonly popping: boolean;
}

export function TakenTray({side, taken, pieceStyle, popping}: Props): React.JSX.Element {
  const {pieceName, plaque} = useMessages();

  return (
    <ol data-testid={`taken-${side}`} aria-label={plaque.takenFrom(side)} className="flex h-6 shrink-0 items-center">
      {takenSlotsFrom(taken).map(({type, count}) => (
        <li
          key={type}
          data-testid="taken-slot"
          data-type={type}
          data-count={count}
          aria-hidden={count === 0 || undefined}
          className="relative h-6 w-6 shrink-0 max-[339px]:h-5 max-[339px]:w-5"
        >
          {count > 0 && (
            <span
              key={count}
              className={clsx(
                "absolute inset-0",
                popping && "animate-[tray-pop_420ms_cubic-bezier(0.2,1.5,0.4,1)_both]",
              )}
            >
              <Piece
                piece={{side, type}}
                name={nameWithCount(pieceName({side, type}), count)}
                style={pieceStyle}
                emphasised={false}
              />
            </span>
          )}

          {count > 1 && (
            <span
              aria-hidden
              className="absolute top-0 right-0 rounded-full bg-ground px-0.5 text-[10px] leading-none font-bold text-white tabular-nums"
            >
              {count}
            </span>
          )}
        </li>
      ))}
    </ol>
  );
}

/** A piece's name for a screen reader, which cannot see the count drawn beside it. */
function nameWithCount(name: string, count: number): string {
  if (count === 1) return name;

  return `${name} ×${count}`;
}
