import {Cell} from "@src/react/pages/game/components/board/components/cell/Cell";
import type {BoardStyle} from "@src/react/pages/game/components/board/cell-styles/types/BoardStyle";
import {CELL_ASPECT_RATIO} from "@src/react/pages/game/components/board/utils/CellAspectRatio";
import {FILE_COUNT, RANK_COUNT} from "@src/game/board/utils/BoardDimensions";
import {BOARD_POSITIONS} from "@src/react/pages/game/components/board/utils/BoardPositions";
import type {PieceSetStyle} from "@src/react/pages/game/components/board/piece-styles/types/PieceSetStyle";
import type {PlacedPiece} from "@src/game/board/types/PlacedPiece";
import {pieceAt} from "@src/game/board/utils/PieceAt";
import {piecesByPosition} from "@src/game/board/utils/PiecesByPosition";
import {toPositionKey} from "@src/game/board/utils/PositionKeys";
import {useMemo} from "react";

/**
 * The 9x10 grid of intersections. It holds no state and draws nothing itself — every mark on the
 * board comes from a cell, which is what makes the board restyleable one intersection at a time.
 *
 * The pieces arrive as a flat list rather than as anything the board owns: where they stand is a
 * property of the game, and the board's only job is to hand each one to the cell it belongs on.
 *
 * Fills whatever box it is given and centres a correctly proportioned board inside it.
 */
interface Props {
  readonly style: BoardStyle;
  readonly pieceStyle: PieceSetStyle;
  readonly pieces: readonly PlacedPiece[];
}

export function Board({style, pieceStyle, pieces}: Props): React.JSX.Element {
  const placedPieces = useMemo(() => piecesByPosition(pieces), [pieces]);

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
          />
        ))}
      </div>
    </div>
  );
}

const BOARD_ASPECT_RATIO = (FILE_COUNT * CELL_ASPECT_RATIO) / RANK_COUNT;
