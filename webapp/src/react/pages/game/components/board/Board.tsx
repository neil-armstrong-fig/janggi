import {Cell} from "@src/react/pages/game/components/board/components/cell/Cell";
import type {BoardStyle} from "@src/react/pages/game/components/board/cell-styles/types/BoardStyle";
import {CELL_ASPECT_RATIO} from "@src/react/pages/game/components/board/utils/CellAspectRatio";
import {FILE_COUNT, RANK_COUNT} from "@src/game/board/utils/BoardDimensions";
import {BOARD_POSITIONS} from "@src/react/pages/game/components/board/utils/BoardPositions";
import type {GameState} from "@src/game/types/GameState";
import type {Move} from "@src/game/types/Move";
import type {PieceSetStyle} from "@src/react/pages/game/components/board/piece-styles/types/PieceSetStyle";
import type {MovableEmphasis} from "@src/react/pages/game/components/board/components/cell/types/MovableEmphasis";
import type {Position, PositionKey} from "@src/game/board/types/Position";
import {movablePieces} from "@src/react/pages/game/components/board/utils/MovablePieces";
import {pieceAt} from "@src/game/board/utils/PieceAt";
import {piecesByPosition} from "@src/game/board/utils/PiecesByPosition";
import {toPositionKey} from "@src/game/board/utils/PositionKeys";
import {useMemo} from "react";
import {useMoveSelection} from "@src/react/pages/game/components/board/hooks/UseMoveSelection";

/**
 * The 9x10 grid of intersections. Every mark on it comes from a cell, which is what makes the board
 * restyleable one intersection at a time.
 *
 * It is handed the whole game rather than a list of pieces, because it is where a game is played:
 * it owns which piece is in hand and lights the points that piece may reach. That selection is the
 * only state here — the game itself belongs to the store, and a completed move goes back out
 * through `onMove` rather than being applied in place.
 *
 * Fills whatever box it is given and centres a correctly proportioned board inside it.
 */
interface Props {
  readonly game: GameState;
  readonly style: BoardStyle;
  readonly pieceStyle: PieceSetStyle;
  /** Whether to mark the pieces the army to move may actually move. A player's own setting. */
  readonly highlightMovable: boolean;
  readonly onMove: (move: Move) => void;
}

export function Board({game, style, pieceStyle, highlightMovable, onMove}: Props): React.JSX.Element {
  const placedPieces = useMemo(() => piecesByPosition(game.pieces), [game.pieces]);

  const {selected, hovered, destinations, tap, hover} = useMoveSelection(game, onMove);
  const reachable = useMemo(() => new Set(destinations.map(toPositionKey)), [destinations]);

  // On [game] rather than on every render: the board re-renders as the pointer crosses it, and
  // asking the engine for every legal move on the board is not something to do per hover.
  const movable = useMemo(() => (highlightMovable ? movablePieces(game) : NOTHING), [game, highlightMovable]);
  const heldKey = selected && toPositionKey(selected);
  const hoveredKey = hovered && toPositionKey(hovered);

  return (
    <div className="flex h-full w-full items-center justify-center" style={{containerType: "size"}}>
      <div
        data-testid="board"
        className="grid"
        style={{
          // minmax(0, ...) rather than a bare 1fr: a track's automatic minimum is its content's
          // min-content size, and a cell's <svg> is intrinsically square, so bare 1fr rows floor
          // at the cell's width and the grid outgrows the aspect ratio set below.
          gridTemplateColumns: `repeat(${FILE_COUNT}, minmax(0, 1fr))`,
          gridTemplateRows: `repeat(${RANK_COUNT}, minmax(0, 1fr))`,
          aspectRatio: BOARD_ASPECT_RATIO,
          // Whichever of the two the parent runs out of first is what the board is sized against.
          width: `min(100cqw, 100cqh * ${BOARD_ASPECT_RATIO})`,
          background: style.surface,
        }}
      >
        {BOARD_POSITIONS.map(position => (
          <Cell
            key={toPositionKey(position)}
            position={position}
            style={style}
            pieceStyle={pieceStyle}
            piece={pieceAt(placedPieces, position)}
            selected={heldKey === toPositionKey(position)}
            canMoveTo={reachable.has(toPositionKey(position))}
            movable={emphasisFor(movable, position, selected !== undefined)}
            hovered={hoveredKey === toPositionKey(position)}
            onTap={tap}
            onHover={hover}
          />
        ))}
      </div>
    </div>
  );
}

/**
 * How loudly to mark one intersection, or undefined to leave it alone.
 *
 * Faint while a piece is in hand: the alternatives stay legible, which is the point of the mark
 * when a general is under attack, but the piece being held and the points it may reach are what
 * should carry the eye.
 */
function emphasisFor(
  movable: ReadonlySet<PositionKey>,
  position: Position,
  holding: boolean,
): MovableEmphasis | undefined {
  if (!movable.has(toPositionKey(position))) return undefined;

  return holding ? "faint" : "full";
}

/** A stable empty set, so turning the mark off does not hand every cell a new one each render. */
const NOTHING: ReadonlySet<PositionKey> = new Set();

const BOARD_ASPECT_RATIO = (FILE_COUNT * CELL_ASPECT_RATIO) / RANK_COUNT;
