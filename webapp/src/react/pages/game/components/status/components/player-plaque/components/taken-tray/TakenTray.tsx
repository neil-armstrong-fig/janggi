import type {KeyedPiece} from "@src/react/pages/game/components/status/components/player-plaque/components/taken-tray/types/KeyedPiece";
import {Piece} from "@src/react/pages/game/components/board/components/piece/Piece";
import type {PieceSetStyle} from "@src/react/pages/game/components/board/piece-styles/types/PieceSetStyle";
import type {PieceType} from "@janggi/shared/janggi/pieces/PieceType";
import type {Side} from "@janggi/shared/janggi/pieces/Side";
import {clsx} from "clsx";
import {sideName} from "@src/react/pages/game/utils/SideNames";

/**
 * The pieces one army has lost, drawn small in the set the board is wearing, most valuable first.
 *
 * Drawn with the board's own `Piece` rather than a second, smaller drawing of it, so a set someone
 * authors is worn here without anything learning it exists — and so each carries the same
 * `data-piece` the acceptance tests already read a piece by.
 *
 * The pieces squeeze together rather than wrapping or scrolling as the list grows. Fifteen losses
 * will not fit across a phone at full size, and a plaque that grew a second row would push the board.
 */
interface Props {
  readonly side: Side;
  readonly taken: readonly PieceType[];
  readonly pieceStyle: PieceSetStyle;
  /** Whether a piece newly lost pops into the tray, rather than simply appearing. */
  readonly popping: boolean;
}

export function TakenTray({side, taken, pieceStyle, popping}: Props): React.JSX.Element {
  return (
    <ol
      data-testid={`taken-${side}`}
      aria-label={`Taken from ${sideName(side)}`}
      className="flex h-6 min-w-0 flex-1 items-center"
    >
      {keyed(taken).map(({type, key}) => (
        <li
          key={key}
          className={clsx(
            "relative h-6 w-6 min-w-2 shrink",
            popping && "animate-[tray-pop_420ms_cubic-bezier(0.2,1.5,0.4,1)_both]",
          )}
        >
          <Piece piece={{side, type}} style={pieceStyle} emphasised={false} />
        </li>
      ))}
    </ol>
  );
}

/**
 * Each lost piece with a key of its own. A list of repeated kinds has none to give — two soldiers
 * are the same soldier — so each is numbered among those of its kind.
 */
function keyed(taken: readonly PieceType[]): readonly KeyedPiece[] {
  const counted = new Map<PieceType, number>();

  return taken.map(type => {
    const nth = (counted.get(type) ?? 0) + 1;
    counted.set(type, nth);

    return {type, key: `${type}-${nth}`};
  });
}
