import {BOARD_STYLE_NAMES} from "@janggi/shared/janggi/settings/BoardStyleName";
import type {BoardStyle} from "@src/styles/types/BoardStyle";
import type {BoardTarget} from "@src/react/pages/game/components/styles-sheet/components/style-editor/components/board-style-editor/board-target/types/BoardTarget";
import {BoardControls} from "@src/react/pages/game/components/styles-sheet/components/style-editor/components/board-style-editor/components/board-controls/BoardControls";
import {BoardPreviewOptions} from "@src/react/pages/game/components/styles-sheet/components/style-editor/components/board-style-editor/components/board-preview-options/BoardPreviewOptions";
import {BoardStyleTools} from "@src/react/pages/game/components/styles-sheet/components/style-editor/components/board-style-editor/components/board-style-tools/BoardStyleTools";
import {EditingPanel} from "@src/react/pages/game/components/styles-sheet/components/style-editor/components/editor-frame/components/editing-panel/EditingPanel";
import {EditorFrame} from "@src/react/pages/game/components/styles-sheet/components/style-editor/components/editor-frame/EditorFrame";
import {EditorHeader} from "@src/react/pages/game/components/styles-sheet/components/style-editor/components/editor-frame/components/editor-header/EditorHeader";
import type {PasteResult} from "@src/react/pages/game/components/paste-key/types/PasteResult";
import type {PieceSetStyle} from "@src/styles/types/PieceSetStyle";
import type {SceneName} from "@src/react/pages/game/components/styles-sheet/components/style-editor/components/preview-scenes/types/SceneName";
import {StylePreview} from "@src/react/pages/game/components/styles-sheet/components/style-editor/components/style-preview/StylePreview";
import {boardFromText} from "@src/react/pages/game/components/styles-sheet/components/style-editor/components/board-style-editor/board-text/BoardFromText";
import {editedStyle} from "@src/react/pages/game/components/styles-sheet/components/style-editor/style-text/EditedStyle";
import {isCellOverridden} from "@src/react/pages/game/components/styles-sheet/components/style-editor/components/board-style-editor/cell-style/IsCellOverridden";
import {useState} from "react";
import {usePreferences} from "@src/react/pages/game/hooks/use-preferences/UsePreferences";
import {useStyleDraft} from "@src/react/pages/game/components/styles-sheet/components/style-editor/hooks/use-style-draft/UseStyleDraft";
import {withoutCellOverride} from "@src/react/pages/game/components/styles-sheet/components/style-editor/components/board-style-editor/cell-style/WithoutCellOverride";

/**
 * A board style being made: the board on screen wearing it as it stands, in the piece set the player is
 * wearing, with a control for every setting. Tapping a point on the preview points the controls at just
 * that point; the position it is shown in turns to whatever the control being used is about.
 *
 * It holds what the parts share — the draft, what is being changed, the position and the name — and each
 * part is its own component.
 */
interface Props {
  readonly startBoardStyle: BoardStyle;
  /** The boards the player has, which one may be loaded from. */
  readonly boardStyles: readonly BoardStyle[];
  /** The piece sets the player has, which the board may be previewed with. */
  readonly pieceSetStyles: readonly PieceSetStyle[];
  readonly onBack: () => void;
  readonly onSave: (boardStyle: BoardStyle) => void;
}

export function BoardStyleEditor({
  startBoardStyle,
  boardStyles,
  pieceSetStyles,
  onBack,
  onSave,
}: Props): React.JSX.Element {
  const {pieceStyle: currentPieceSetStyle} = usePreferences();
  const [previewedWith, setPreviewedWith] = useState("");
  const previewedPieceSetStyle =
    pieceSetStyles.find(pieceSetStyle => pieceSetStyle.name === previewedWith) ?? currentPieceSetStyle;
  const styleDraft = useStyleDraft(startBoardStyle, boardFromText);
  const [boardTarget, setBoardTarget] = useState<BoardTarget>({kind: "default"});
  const [sceneName, setSceneName] = useState<SceneName>("opening");
  // A style of the player's own is saved under its own name, which replaces it; a built-in's cannot be.
  const [name, setName] = useState(
    BOARD_STYLE_NAMES.some(builtIn => builtIn === startBoardStyle.name) ? "" : startBoardStyle.name,
  );
  const [pasteResult, setPasteResult] = useState<PasteResult | undefined>(undefined);

  const save = (): void => {
    if (styleDraft.unsavable) {
      setPasteResult({accepted: false, message: styleDraft.unsavable});
      return;
    }

    const styleOutcome = editedStyle("Board", name, JSON.stringify(styleDraft.style));

    if (styleOutcome.kind === "board") {
      onSave(styleOutcome.style);
      setPasteResult({accepted: true, message: `Saved "${styleOutcome.style.name}", and the board is wearing it.`});
      return;
    }

    setPasteResult({
      accepted: false,
      message: styleOutcome.kind === "refused" ? styleOutcome.reason : "That is not a board.",
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
          boardStyle={styleDraft.style}
          pieceSetStyle={previewedPieceSetStyle}
          sceneName={sceneName}
          markedPosition={boardTarget.kind === "point" ? boardTarget.position : undefined}
          onTap={position => setBoardTarget({kind: "point", position})}
        />
      }
      beneathPreview={
        <BoardPreviewOptions
          pieceSetStyles={pieceSetStyles}
          previewedWith={previewedWith}
          onPreviewedWith={setPreviewedWith}
          sceneName={sceneName}
          onScene={setSceneName}
          boardTarget={boardTarget}
          canReset={isCellOverridden(styleDraft.style, boardTarget)}
          onReset={() => {
            if (boardTarget.kind !== "point") return;

            const position = boardTarget.position;
            styleDraft.change(currentBoardStyle => withoutCellOverride(currentBoardStyle, position));
            setBoardTarget({kind: "default"});
          }}
          onEveryPoint={() => setBoardTarget({kind: "default"})}
        />
      }
      editingPanel={
        <EditingPanel
          tools={
            <BoardStyleTools
              startBoardStyle={startBoardStyle}
              boardStyles={boardStyles}
              styleDraft={styleDraft}
              onLoaded={() => setBoardTarget({kind: "default"})}
              onPasteResult={setPasteResult}
            />
          }
          controls={
            <BoardControls
              boardStyle={styleDraft.style}
              boardTarget={boardTarget}
              onChange={styleDraft.change}
              onScene={setSceneName}
            />
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
