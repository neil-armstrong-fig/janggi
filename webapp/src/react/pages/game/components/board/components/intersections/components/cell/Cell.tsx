import {CellLines} from "@src/react/pages/game/components/board/components/intersections/components/cell/components/cell-lines/CellLines";
import {CoverHint} from "@src/react/pages/game/components/board/components/intersections/components/cell/components/cover-hint/CoverHint";
import {CELL_SVG_PROPS} from "@src/react/pages/game/components/board/components/intersections/components/cell/utils/CellViewBox";
import type {Flourish} from "@src/react/pages/game/components/board/types/Flourish";
import {LastMoveMark} from "@src/react/pages/game/components/board/components/intersections/components/cell/components/last-move-mark/LastMoveMark";
import {Marker} from "@src/react/pages/game/components/board/components/intersections/components/cell/components/marker/Marker";
import {MovableMark} from "@src/react/pages/game/components/board/components/intersections/components/cell/components/movable-mark/MovableMark";
import {MoveHint} from "@src/react/pages/game/components/board/components/intersections/components/cell/components/move-hint/MoveHint";
import {Piece} from "@src/react/pages/game/components/board/components/piece/Piece";
import type {Piece as PieceIdentity} from "@janggi/shared/janggi/pieces/Piece";
import type {BoardStyle} from "@src/react/pages/game/components/board/cell-styles/types/BoardStyle";
import type {LastMoveEnd} from "@src/react/pages/game/components/board/components/intersections/types/LastMoveEnd";
import type {PieceLift} from "@src/react/pages/game/components/board/types/PieceLift";
import type {PieceSetStyle} from "@src/react/pages/game/components/board/piece-styles/types/PieceSetStyle";
import type {MovableEmphasis} from "@src/react/pages/game/components/board/components/intersections/types/MovableEmphasis";
import type {Position} from "@src/game/board/types/Position";
import {ThreatMark} from "@src/react/pages/game/components/board/components/intersections/components/cell/components/threat-mark/ThreatMark";
import {cellShapeAt} from "@src/react/pages/game/components/board/components/intersections/components/cell/utils/CellShapes";
import {resolveCellStyle} from "@src/react/pages/game/components/board/components/intersections/components/cell/utils/ResolveCellStyle";
import {clsx} from "clsx";
import {toPositionKey} from "@src/game/board/PositionKeys";

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
 *
 * A point the last move went between carries a wash under its piece and brackets in its corners over
 * it, both in the colours the board style gives in `lastMove`, and says which end it was in
 * `data-last-move`. A point in a check is ringed in red — the general under attack in
 * `data-under-attack`, each piece attacking it in `data-attacking`. All of these are marks rather than
 * motion, so they stay when effects are reduced.
 */
interface Props {
  readonly position: Position;
  readonly style: BoardStyle;
  readonly pieceStyle: PieceSetStyle;
  readonly piece?: PieceIdentity;
  readonly selected: boolean;
  readonly canMoveTo: boolean;
  /** Whether the piece in question would land here, but for the piece of its own army standing here. */
  readonly covered: boolean;
  /** How loudly to mark the piece here as one its owner may move, or undefined not to. */
  readonly movable?: MovableEmphasis;
  readonly hovered: boolean;
  /** Which end of the last move this point was, or undefined where the last move did not touch it. */
  readonly lastMove?: LastMoveEnd;
  /** Hides the piece here, while a copy of it is shown flying in. */
  readonly concealed: boolean;
  /** Whether the general standing here is in check. */
  readonly underAttack: boolean;
  /** Whether the piece standing here is giving check. */
  readonly attacking: boolean;
  readonly lift: PieceLift;
  /** A flourish for the piece here to play in place, or undefined for it to stand still. */
  readonly flourish: Flourish | undefined;
  /** How long the move hint here waits before popping in, or undefined for it to appear at once. */
  readonly hintDelay: number | undefined;
  /** Whether marks that can move — the ring round a general in check — should. */
  readonly pulsing: boolean;
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
  covered,
  movable,
  hovered,
  lastMove,
  concealed,
  underAttack,
  attacking,
  lift,
  flourish,
  hintDelay,
  pulsing,
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
      data-covered={covered || undefined}
      data-can-be-moved={movable}
      data-last-move={lastMove}
      data-under-attack={underAttack || undefined}
      data-attacking={attacking || undefined}
      onClick={() => onTap(position)}
      onPointerEnter={() => onHover(position)}
      onPointerLeave={() => onHover(undefined)}
      // Only where a tap does something: a piece to pick up or look at, or a point to put one on.
      // Every other intersection is scenery, and a pointer over it would promise otherwise.
      className={clsx("relative h-full w-full", (piece !== undefined || canMoveTo) && "cursor-pointer")}
      style={{background: cellStyle.surface}}
    >
      <svg {...CELL_SVG_PROPS} className="h-full w-full">
        <CellLines shape={cellShapeAt(position)} style={cellStyle} />

        {cellStyle.marker && <Marker marker={cellStyle.marker} />}
      </svg>

      {lastMove && <span className="pointer-events-none absolute inset-0" style={{background: style.lastMove.wash}} />}

      {underAttack && <ThreatMark role="underAttack" pulsing={pulsing} />}

      {attacking && <ThreatMark role="attacking" pulsing={pulsing} />}

      {movable && <MovableMark emphasis={movable} />}

      {piece && (
        // Keyed by its flourish, so a new flourish is played from the start rather than picked up mid-way.
        <Piece
          key={flourish?.id ?? "still"}
          piece={piece}
          style={pieceStyle}
          emphasised={hovered}
          concealed={concealed}
          lift={lift}
          flourish={flourish}
        />
      )}

      {lastMove && <LastMoveMark colour={style.lastMove.brackets} />}

      {selected && <span className="pointer-events-none absolute inset-0 bg-white/20" />}

      {canMoveTo && <MoveHint overPiece={piece !== undefined} delay={hintDelay} />}

      {covered && <CoverHint delay={hintDelay} />}
    </button>
  );
}
