import type {BoardStyle} from "@src/styles/types/BoardStyle";
import {BOARD_POSITIONS} from "@src/react/pages/game/components/board/components/intersections/utils/BoardPositions";
import {BikjangLine} from "@src/react/pages/game/components/board/components/bikjang-line/BikjangLine";
import {BoardGrid} from "@src/react/pages/game/components/board/components/board-grid/BoardGrid";
import {Cell} from "@src/react/pages/game/components/board/components/intersections/components/cell/Cell";
import {FILE_COUNT, RANK_COUNT} from "@src/game/board/BoardDimensions";
import {CheckLines} from "@src/react/pages/game/components/board/components/check-lines/CheckLines";
import type {PieceSetStyle} from "@src/styles/types/PieceSetStyle";
import type {Position} from "@src/game/board/types/Position";
import type {SceneName} from "@src/react/pages/game/components/styles-sheet/components/style-editor/components/preview-scenes/types/SceneName";
import {cellMarksAt} from "@src/react/pages/game/components/board/components/intersections/cell-marks/CellMarksAt";
import {markSourcesOf} from "@src/react/pages/game/components/styles-sheet/components/style-editor/components/preview-scenes/MarkSourcesOf";
import {sceneOf} from "@src/react/pages/game/components/styles-sheet/components/style-editor/components/preview-scenes/SceneOf";
import {toPositionKey} from "@src/game/board/PositionKeys";
import {useMemo} from "react";

/**
 * A board in a style that has not been saved — the real cells, pieces and lines, drawn by the same code as
 * the board in play, in a position where the marks a style decides are on show. Every point may be tapped,
 * which is how the controls are pointed at one.
 *
 * Nothing on it moves: it is a picture of the style, and a style is one thing whether or not it animates.
 */
interface Props {
  readonly boardStyle: BoardStyle;
  readonly pieceSetStyle: PieceSetStyle;
  readonly sceneName: SceneName;
  /** The point being changed, if it is one, which is ringed. */
  readonly markedPosition: Position | undefined;
  readonly onTap: (position: Position) => void;
}

export function StylePreview({
  boardStyle,
  pieceSetStyle,
  sceneName: name,
  markedPosition,
  onTap,
}: Props): React.JSX.Element {
  const previewScene = useMemo(() => sceneOf(name), [name]);
  const markSources = useMemo(() => markSourcesOf(previewScene), [previewScene]);

  return (
    <BoardGrid testId="style-preview" surface={boardStyle.surface}>
      {BOARD_POSITIONS.map(position => (
        <Cell
          key={toPositionKey(position)}
          position={position}
          {...cellMarksAt(position, markSources)}
          hovered={false}
          concealed={false}
          lift="resting"
          flourish={undefined}
          hintDelay={undefined}
          onTap={onTap}
          onHover={ignored}
          boardStyle={boardStyle}
          pieceSetStyle={pieceSetStyle}
        />
      ))}

      <CheckLines threat={previewScene.threat} checkStyle={boardStyle.check} momentId={0} drawing={false} />

      <BikjangLine game={previewScene.game} bikjangStyle={boardStyle.bikjang} momentId={0} drawing={false} />

      {markedPosition && (
        // Positioned over its point rather than placed on the grid: a grid item with a place of its own is
        // stepped around by the cells, which would push every cell after it along and add a row.
        <span
          data-testid="style-preview-marked"
          aria-hidden
          className="pointer-events-none absolute z-20 rounded-sm ring-2 ring-white ring-offset-1 ring-offset-black"
          style={{
            left: `${((markedPosition.file - 1) / FILE_COUNT) * 100}%`,
            top: `${((markedPosition.rank - 1) / RANK_COUNT) * 100}%`,
            width: `${100 / FILE_COUNT}%`,
            height: `${100 / RANK_COUNT}%`,
          }}
        />
      )}
    </BoardGrid>
  );
}

function ignored(): void {}
