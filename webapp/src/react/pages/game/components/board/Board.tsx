import {Cell} from "@src/react/pages/game/components/board/components/cell/Cell";
import type {BoardStyle} from "@src/react/pages/game/components/board/cell-styles/types/BoardStyle";
import {CELL_ASPECT_RATIO, FILE_COUNT, RANK_COUNT} from "@src/react/pages/game/components/board/utils/BoardDimensions";
import {BOARD_POSITIONS} from "@src/react/pages/game/components/board/utils/BoardPositions";
import {toPositionKey} from "@src/react/pages/game/components/board/utils/PositionKeys";

/**
 * The 9x10 grid of intersections. It holds no state and draws nothing itself — every mark on the
 * board comes from a cell, which is what makes the board restyleable one intersection at a time.
 *
 * Fills whatever box it is given and centres a correctly proportioned board inside it.
 */
interface Props {
  readonly style: BoardStyle;
}

export function Board({style}: Props): React.JSX.Element {
  return (
    <div className="flex h-full w-full items-center justify-center" style={{containerType: "size"}}>
      <div
        data-testid="board"
        className="grid"
        style={{
          gridTemplateColumns: `repeat(${FILE_COUNT}, 1fr)`,
          gridTemplateRows: `repeat(${RANK_COUNT}, 1fr)`,
          aspectRatio: BOARD_ASPECT_RATIO,
          // Whichever of the two the parent runs out of first is what the board is sized against.
          width: `min(100cqw, 100cqh * ${BOARD_ASPECT_RATIO})`,
          background: style.surface,
        }}
      >
        {BOARD_POSITIONS.map(position => (
          <Cell key={toPositionKey(position)} position={position} style={style} />
        ))}
      </div>
    </div>
  );
}

const BOARD_ASPECT_RATIO = (FILE_COUNT * CELL_ASPECT_RATIO) / RANK_COUNT;
