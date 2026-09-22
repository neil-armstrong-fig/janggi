import type {BoardStyle} from "@src/styles/types/BoardStyle";
import {EditingPanel} from "@src/react/pages/game/components/styles-sheet/components/style-editor/components/editor-frame/components/editing-panel/EditingPanel";
import {EditorFrame} from "@src/react/pages/game/components/styles-sheet/components/style-editor/components/editor-frame/EditorFrame";
import {EditorHeader} from "@src/react/pages/game/components/styles-sheet/components/style-editor/components/editor-frame/components/editor-header/EditorHeader";
import {PIECE_SET_NAMES} from "@janggi/shared/janggi/settings/PieceSetName";
import type {PasteResult} from "@src/react/pages/game/components/paste-key/types/PasteResult";
import {PieceControls} from "@src/react/pages/game/components/styles-sheet/components/style-editor/components/piece-set-editor/components/piece-controls/PieceControls";
import {PiecePreviewOptions} from "@src/react/pages/game/components/styles-sheet/components/style-editor/components/piece-set-editor/components/piece-preview-options/PiecePreviewOptions";
import {PieceSetTools} from "@src/react/pages/game/components/styles-sheet/components/style-editor/components/piece-set-editor/components/piece-set-tools/PieceSetTools";
import type {PieceSetStyle} from "@src/styles/types/PieceSetStyle";
import type {PieceTarget} from "@src/react/pages/game/components/styles-sheet/components/style-editor/components/piece-set-editor/piece-target/types/PieceTarget";
import type {Position} from "@src/game/board/types/Position";
import type {Side} from "@janggi/shared/janggi/pieces/Side";
import {StylePreview} from "@src/react/pages/game/components/styles-sheet/components/style-editor/components/style-preview/StylePreview";
import {editedStyle} from "@src/react/pages/game/components/styles-sheet/components/style-editor/style-text/EditedStyle";
import {isPieceOverridden} from "@src/react/pages/game/components/styles-sheet/components/style-editor/components/piece-set-editor/piece-style/IsPieceOverridden";
import {piecesFromText} from "@src/react/pages/game/components/styles-sheet/components/style-editor/components/piece-set-editor/pieces-text/PiecesFromText";
import {previewPieceAt} from "@src/react/pages/game/components/styles-sheet/components/style-editor/components/piece-set-editor/preview-pieces/PreviewPieceAt";
import {useState} from "react";
import {usePreferences} from "@src/react/pages/game/hooks/use-preferences/UsePreferences";
import {useStyleDraft} from "@src/react/pages/game/components/styles-sheet/components/style-editor/hooks/use-style-draft/UseStyleDraft";
import {withoutPieceOverride} from "@src/react/pages/game/components/styles-sheet/components/style-editor/components/piece-set-editor/piece-style/WithoutPieceOverride";

/**
 * A piece set being made: every piece of both armies on the board the player is wearing, with a control for
 * every setting. The controls begin on Cho's pieces; choosing Han's, or tapping one piece on the preview,
 * points them at that instead. A piece tapped is given a style of its own, made from what it wore.
 *
 * It holds what the parts share — the draft, what is being changed and the name — and each part is its own
 * component.
 */
interface Props {
  readonly startPieceSetStyle: PieceSetStyle;
  /** The boards the player has, which the pieces may be previewed on. */
  readonly boardStyles: readonly BoardStyle[];
  /** The piece sets the player has, which one may be loaded from. */
  readonly pieceSetStyles: readonly PieceSetStyle[];
  readonly onBack: () => void;
  readonly onSave: (pieceSetStyle: PieceSetStyle) => void;
}

export function PieceSetEditor({
  startPieceSetStyle,
  boardStyles,
  pieceSetStyles,
  onBack,
  onSave,
}: Props): React.JSX.Element {
  const {boardStyle: currentBoardStyle} = usePreferences();
  const [previewedOn, setPreviewedOn] = useState("");
  const previewedBoardStyle = boardStyles.find(boardStyle => boardStyle.name === previewedOn) ?? currentBoardStyle;
  const styleDraft = useStyleDraft(startPieceSetStyle, piecesFromText);
  const [pieceTarget, setPieceTarget] = useState<PieceTarget>({kind: "side", side: "cho"});
  // A set of the player's own is saved under its own name, which replaces it; a built-in's cannot be.
  const [name, setName] = useState(
    PIECE_SET_NAMES.some(builtIn => builtIn === startPieceSetStyle.name) ? "" : startPieceSetStyle.name,
  );
  const [markedPosition, setMarkedPosition] = useState<Position | undefined>(undefined);
  const [pasteResult, setPasteResult] = useState<PasteResult | undefined>(undefined);

  const chooseSide = (side: Side): void => {
    setPieceTarget({kind: "side", side});
    setMarkedPosition(undefined);
  };

  const save = (): void => {
    if (styleDraft.unsavable) {
      setPasteResult({accepted: false, message: styleDraft.unsavable});
      return;
    }

    const styleOutcome = editedStyle("Pieces", name, JSON.stringify(styleDraft.style));

    if (styleOutcome.kind === "pieces") {
      onSave(styleOutcome.style);
      setPasteResult({accepted: true, message: `Saved "${styleOutcome.style.name}", and the board is wearing it.`});
      return;
    }

    setPasteResult({
      accepted: false,
      message: styleOutcome.kind === "refused" ? styleOutcome.reason : "That is not a piece set.",
    });
  };

  return (
    <EditorFrame
      header={
        <EditorHeader
          name={name}
          onName={next => {
            setName(next);
            setPasteResult(undefined);
          }}
          onSave={save}
          onBack={onBack}
          pasteResult={pasteResult}
        />
      }
      preview={
        <StylePreview
          boardStyle={previewedBoardStyle}
          pieceSetStyle={styleDraft.style}
          sceneName="opening"
          markedPosition={markedPosition}
          onTap={position => {
            const piece = previewPieceAt(position);
            if (!piece) return;

            setPieceTarget({kind: "piece", piece});
            setMarkedPosition(position);
          }}
        />
      }
      beneathPreview={
        <PiecePreviewOptions
          boardStyles={boardStyles}
          previewedOn={previewedOn}
          onPreviewedOn={setPreviewedOn}
          pieceTarget={pieceTarget}
          canReset={isPieceOverridden(styleDraft.style, pieceTarget)}
          onReset={() => {
            if (pieceTarget.kind !== "piece") return;

            const piece = pieceTarget.piece;
            styleDraft.change(currentPieceSetStyle => withoutPieceOverride(currentPieceSetStyle, piece));
            chooseSide(piece.side);
          }}
          onSide={chooseSide}
        />
      }
      editingPanel={
        <EditingPanel
          tools={
            <PieceSetTools
              startPieceSetStyle={startPieceSetStyle}
              pieceSetStyles={pieceSetStyles}
              styleDraft={styleDraft}
              onLoaded={() => chooseSide(pieceTarget.kind === "side" ? pieceTarget.side : pieceTarget.piece.side)}
              onPasteResult={setPasteResult}
            />
          }
          controls={
            <PieceControls pieceSetStyle={styleDraft.style} pieceTarget={pieceTarget} onChange={styleDraft.change} />
          }
          styleView={styleDraft.view}
          onView={styleView => (styleView === "raw" ? styleDraft.showRaw() : styleDraft.showControls())}
          raw={styleDraft.raw}
          rawRefusal={styleDraft.rawRefusal}
          onRaw={styleDraft.writeRaw}
        />
      }
    />
  );
}
