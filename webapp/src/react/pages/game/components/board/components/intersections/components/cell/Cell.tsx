import {CellLines} from "@src/react/pages/game/components/board/components/intersections/components/cell/components/cell-lines/CellLines";
import {CoverHint} from "@src/react/pages/game/components/board/components/intersections/components/cell/components/cover-hint/CoverHint";
import {CELL_SVG_PROPS} from "@src/react/pages/game/components/board/components/intersections/components/cell/utils/CellViewBox";
import type {BoardStyle} from "@src/styles/types/BoardStyle";
import type {Flourish} from "@src/react/pages/game/components/board/types/Flourish";
import {LastMoveMark} from "@src/react/pages/game/components/board/components/intersections/components/cell/components/last-move-mark/LastMoveMark";
import {Marker} from "@src/react/pages/game/components/board/components/intersections/components/cell/components/marker/Marker";
import {MovableMark} from "@src/react/pages/game/components/board/components/intersections/components/cell/components/movable-mark/MovableMark";
import {MoveHint} from "@src/react/pages/game/components/board/components/intersections/components/cell/components/move-hint/MoveHint";
import {Piece} from "@src/react/pages/game/components/board/components/piece/Piece";
import type {Piece as PieceIdentity} from "@janggi/shared/janggi/pieces/Piece";
import type {LastMoveEnd} from "@src/react/pages/game/components/board/components/intersections/types/LastMoveEnd";
import type {PieceLift} from "@src/react/pages/game/components/board/types/PieceLift";
import type {MovableEmphasis} from "@src/react/pages/game/components/board/components/intersections/types/MovableEmphasis";
import type {Position} from "@src/game/board/types/Position";
import type {PieceSetStyle} from "@src/styles/types/PieceSetStyle";
import {ThreatMark} from "@src/react/pages/game/components/board/components/intersections/components/cell/components/threat-mark/ThreatMark";
import {cellShapeAt} from "@src/react/pages/game/components/board/components/intersections/components/cell/utils/CellShapes";
import {resolveCellStyle} from "@src/react/pages/game/components/board/components/intersections/components/cell/utils/ResolveCellStyle";
import {clsx} from "clsx";
import {toPositionKey} from "@src/game/board/PositionKeys";
import {usePreferences} from "@src/react/pages/game/hooks/use-preferences/UsePreferences";

/**
 * One intersection. Takes its geometry and its marks from the board, and reads the player's styles and
 * whether effects are full for itself — those are the same for every cell, so tunnelling them through
 * `Intersections` would only be a prop each. It is the only thing that knows how to turn a `CellStyle`
 * into pixels, which is what lets a style be plain data a user can author.
 *
 * A piece standing here is drawn over the lines rather than among them, in its own square element,
 * so it keeps its shape on a board whose cells are wider than they are tall.
 *
 * It is a `<button>` because it is tapped: a whole cell is a far bigger target than the piece drawn
 * on it, which is why `Piece` stays `pointer-events-none` and lets the tap fall through to here.
 * `aria-pressed` says which piece is in hand, matching what `OptionButton` already does.
 *
 * It wears the player's styles unless it is handed others — the styles editor draws a board in a style not
 * yet saved, and a prop is how it says so. The game never passes any.
 *
 * A point the last move went between carries a wash under its piece and brackets in its corners over
 * it, both in the colours the board style gives in `lastMove`, and says which end it was in
 * `data-last-move`. A point in a check is ringed in red — the general under attack in
 * `data-under-attack`, each piece attacking it in `data-attacking`. A point the piece in hand may go to
 * where the move would leave a bikjang to call has 빅장 written on its move hint. All of these are
 * marks rather than motion, so they stay when effects are reduced.
 */
interface Props {
  readonly position: Position;
  readonly piece?: PieceIdentity;
  readonly selected: boolean;
  readonly canMoveTo: boolean;
  /** Whether the piece in question would land here, but for the piece of its own army standing here. */
  readonly covered: boolean;
  /** Whether the piece in question moving here would leave the opponent a bikjang to call. */
  readonly bikjangRisk: boolean;
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
  readonly onTap: (position: Position) => void;
  readonly onHover: (position: Position | undefined) => void;
  /** Worn instead of the player's board style, by a board that shows a style that is not the one in use. */
  readonly boardStyle?: BoardStyle;
  /** Worn instead of the player's piece set, likewise. */
  readonly pieceSetStyle?: PieceSetStyle;
}

export function Cell({
  position,
  piece,
  selected,
  canMoveTo,
  covered,
  bikjangRisk,
  movable,
  hovered,
  lastMove,
  concealed,
  underAttack,
  attacking,
  lift,
  flourish,
  hintDelay,
  onTap,
  onHover,
  boardStyle,
  pieceSetStyle: pieceStyleOverridePieceSetStyle,
}: Props): React.JSX.Element {
  const preferences = usePreferences();
  const styleBoardStyle = boardStyle ?? preferences.boardStyle;
  const pieceSetStyle = pieceStyleOverridePieceSetStyle ?? preferences.pieceStyle;
  const pulsing = preferences.effects.full;
  const cellStyle = resolveCellStyle(styleBoardStyle, position);

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

      {lastMove && (
        <span className="pointer-events-none absolute inset-0" style={{background: styleBoardStyle.lastMove.wash}} />
      )}

      {underAttack && <ThreatMark role="underAttack" checkStyle={styleBoardStyle.check} pulsing={pulsing} />}

      {attacking && <ThreatMark role="attacking" checkStyle={styleBoardStyle.check} pulsing={pulsing} />}

      {movable && <MovableMark emphasis={movable} hintsStyle={styleBoardStyle.hints} />}

      {piece && (
        // Keyed by its flourish, so a new flourish is played from the start rather than picked up mid-way.
        <Piece
          key={flourish?.id ?? "still"}
          piece={piece}
          style={pieceSetStyle}
          emphasised={hovered}
          concealed={concealed}
          lift={lift}
          flourish={flourish}
        />
      )}

      {lastMove && <LastMoveMark colour={styleBoardStyle.lastMove.brackets} />}

      {selected && (
        <span
          data-testid="selected-wash"
          className="pointer-events-none absolute inset-0"
          style={{background: styleBoardStyle.hints.selection}}
        />
      )}

      {canMoveTo && (
        <MoveHint
          overPiece={piece !== undefined}
          bikjangRisk={bikjangRisk}
          hintsStyle={styleBoardStyle.hints}
          delay={hintDelay}
        />
      )}

      {covered && <CoverHint hintsStyle={styleBoardStyle.hints} delay={hintDelay} />}
    </button>
  );
}
