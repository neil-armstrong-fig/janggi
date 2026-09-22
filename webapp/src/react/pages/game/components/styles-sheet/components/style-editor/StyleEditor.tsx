import {BoardStyleEditor} from "@src/react/pages/game/components/styles-sheet/components/style-editor/components/board-style-editor/BoardStyleEditor";
import type {BoardStyle} from "@src/styles/types/BoardStyle";
import type {EditingStyle} from "@src/react/pages/game/components/styles-sheet/types/EditingStyle";
import {PieceSetEditor} from "@src/react/pages/game/components/styles-sheet/components/style-editor/components/piece-set-editor/PieceSetEditor";
import type {PieceSetStyle} from "@src/styles/types/PieceSetStyle";

/**
 * A style being made, on a board of its own that wears it as it stands, with a control for every setting
 * and the raw JSON as a second view of the same style. The schema is the one every built-in is written in,
 * so where a style is started from is a working example of every field; what is saved is checked exactly as
 * an imported style is, and the reason shown if it is refused.
 *
 * It is drawn in place of the rest of the sheet, and kept while the sheet is closed — a player who taps
 * away from a style half made finds it as they left it, until they go Back.
 */
interface Props {
  readonly editingStyle: EditingStyle;
  /** The boards and piece sets the player has, which a style being made may be shown with. */
  readonly boardStyles: readonly BoardStyle[];
  readonly pieceSetStyles: readonly PieceSetStyle[];
  readonly onBack: () => void;
  readonly onSaveBoard: (style: BoardStyle) => void;
  readonly onSavePieces: (set: PieceSetStyle) => void;
}

export function StyleEditor({
  editingStyle,
  boardStyles,
  pieceSetStyles,
  onBack,
  onSaveBoard,
  onSavePieces,
}: Props): React.JSX.Element {
  return (
    <>
      {editingStyle.kind === "Board" && (
        <BoardStyleEditor
          startBoardStyle={editingStyle.from}
          boardStyles={boardStyles}
          pieceSetStyles={pieceSetStyles}
          onBack={onBack}
          onSave={onSaveBoard}
        />
      )}

      {editingStyle.kind === "Pieces" && (
        <PieceSetEditor
          startPieceSetStyle={editingStyle.from}
          boardStyles={boardStyles}
          pieceSetStyles={pieceSetStyles}
          onBack={onBack}
          onSave={onSavePieces}
        />
      )}
    </>
  );
}
