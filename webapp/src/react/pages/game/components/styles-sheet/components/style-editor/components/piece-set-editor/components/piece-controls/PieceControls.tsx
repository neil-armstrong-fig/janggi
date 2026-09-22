import {BodyControls} from "@src/react/pages/game/components/styles-sheet/components/style-editor/components/piece-set-editor/components/piece-controls/components/body-controls/BodyControls";
import {GlyphControls} from "@src/react/pages/game/components/styles-sheet/components/style-editor/components/piece-set-editor/components/piece-controls/components/glyph-controls/GlyphControls";
import {HandlingControls} from "@src/react/pages/game/components/styles-sheet/components/style-editor/components/piece-set-editor/components/piece-controls/components/handling-controls/HandlingControls";
import type {PieceSetStyle} from "@src/styles/types/PieceSetStyle";
import type {PieceStyle} from "@src/styles/types/PieceStyle";
import type {PieceTarget} from "@src/react/pages/game/components/styles-sheet/components/style-editor/components/piece-set-editor/piece-target/types/PieceTarget";
import {pieceStyleAt} from "@src/react/pages/game/components/styles-sheet/components/style-editor/components/piece-set-editor/piece-style/PieceStyleAt";
import {withPieceStyle} from "@src/react/pages/game/components/styles-sheet/components/style-editor/components/piece-set-editor/piece-style/WithPieceStyle";

/**
 * Every setting of a piece set. The body and the mark are the target's — an army's, or the one piece tapped
 * — and how the set is handled is the whole set's.
 */
interface Props {
  readonly pieceSetStyle: PieceSetStyle;
  readonly pieceTarget: PieceTarget;
  readonly onChange: (update: (pieceSetStyle: PieceSetStyle) => PieceSetStyle) => void;
}

export function PieceControls({pieceSetStyle, pieceTarget, onChange}: Props): React.JSX.Element {
  const pieceStyle = pieceStyleAt(pieceSetStyle, pieceTarget);
  const changePiece = (update: (currentPieceStyle: PieceStyle) => PieceStyle): void => {
    onChange(currentPieceSetStyle => withPieceStyle(currentPieceSetStyle, pieceTarget, update));
  };

  return (
    <div className="flex flex-col gap-4">
      <BodyControls pieceStyle={pieceStyle} onChange={changePiece} />

      <GlyphControls
        pieceStyle={pieceStyle}
        side={pieceTarget.kind === "side" ? pieceTarget.side : pieceTarget.piece.side}
        onChange={changePiece}
      />

      <HandlingControls
        pieceHandlingStyle={pieceSetStyle.handling}
        onChange={pieceHandlingStyle =>
          onChange(currentPieceSetStyle => ({...currentPieceSetStyle, handling: pieceHandlingStyle}))
        }
      />
    </div>
  );
}
