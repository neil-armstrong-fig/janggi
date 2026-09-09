import {CellLines} from "@src/react/pages/game/components/board/components/cell/components/cell-lines/CellLines";
import {CELL_SVG_PROPS} from "@src/react/pages/game/components/board/components/cell/utils/CellViewBox";
import {Marker} from "@src/react/pages/game/components/board/components/cell/components/marker/Marker";
import {MovableMark} from "@src/react/pages/game/components/board/components/cell/components/movable-mark/MovableMark";
import {MoveHint} from "@src/react/pages/game/components/board/components/cell/components/move-hint/MoveHint";
import {Piece} from "@src/react/pages/game/components/board/components/piece/Piece";
import type {Piece as PieceIdentity} from "@janggi/shared/janggi/pieces/Piece";
import type {BoardStyle} from "@src/react/pages/game/components/board/cell-styles/types/BoardStyle";
import type {PieceSetStyle} from "@src/react/pages/game/components/board/piece-styles/types/PieceSetStyle";
import type {MovableEmphasis} from "@src/react/pages/game/components/board/components/cell/types/MovableEmphasis";
import type {Position} from "@src/game/board/types/Position";
import {cellShapeAt} from "@src/react/pages/game/components/board/utils/CellShapes";
import {resolveCellStyle} from "@src/react/pages/game/components/board/components/cell/utils/ResolveCellStyle";
import {toPositionKey} from "@src/game/board/utils/PositionKeys";

/**
 * One intersection. Takes its geometry from the board and its appearance from the style, and is the
 * only thing that knows how to turn a `CellStyle` into pixels — which is what lets a style be plain
 * data a user can author.
 *
 * A piece standing here is drawn over the lines rather than among them, in its own square element,
 * so it keeps its shape on a board whose cells are wider than they are tall.
 *
 * It is a `<button>` because it is tapped: a whole cell is a far bigger target than the piece drawn
 * on it, which is why `Piece` stays `pointer-events-none` and lets the tap fall through to here.
 * `aria-pressed` says which piece is in hand, matching what `OptionButton` already does.
 */
interface Props {
  readonly position: Position;
  readonly style: BoardStyle;
  readonly pieceStyle: PieceSetStyle;
  readonly piece?: PieceIdentity;
  readonly selected: boolean;
  readonly canMoveTo: boolean;
  /** How loudly to mark the piece here as one its owner may move, or undefined not to. */
  readonly movable?: MovableEmphasis;
  readonly hovered: boolean;
  readonly onTap: (position: Position) => void;
  readonly onHover: (position: Position | undefined) => void;
}

export function Cell({
  position,
  style,
  pieceStyle,
  piece,
  selected,
  canMoveTo,
  movable,
  hovered,
  onTap,
  onHover,
}: Props): React.JSX.Element {
  const cellStyle = resolveCellStyle(style, position);

  return (
    <button
      type="button"
      data-testid={`cell-${toPositionKey(position)}`}
      aria-pressed={selected}
      data-can-move-to={canMoveTo || undefined}
      data-can-be-moved={movable}
      onClick={() => onTap(position)}
      onPointerEnter={() => onHover(position)}
      onPointerLeave={() => onHover(undefined)}
      // Only where a tap does something: a piece to pick up or look at, or a point to put one on.
      // Every other intersection is scenery, and a pointer over it would promise otherwise.
      className={`relative h-full w-full ${piece || canMoveTo ? "cursor-pointer" : ""}`}
      style={{background: cellStyle.surface}}
    >
      <svg {...CELL_SVG_PROPS} className="h-full w-full">
        <CellLines shape={cellShapeAt(position)} style={cellStyle} />

        {cellStyle.marker && <Marker marker={cellStyle.marker} />}
      </svg>

      {movable && <MovableMark emphasis={movable} />}

      {piece && <Piece piece={piece} style={pieceStyle} emphasised={hovered} />}

      {selected && <span className="pointer-events-none absolute inset-0 bg-white/20" />}

      {canMoveTo && <MoveHint overPiece={piece !== undefined} />}
    </button>
  );
}
