import type {BoardStyle} from "@src/styles/types/BoardStyle";
import type {PasteResult} from "@src/react/pages/game/components/paste-key/types/PasteResult";
import type {StyleDraft} from "@src/react/pages/game/components/styles-sheet/components/style-editor/hooks/use-style-draft/UseStyleDraft";
import {StyleTools} from "@src/react/pages/game/components/styles-sheet/components/style-editor/components/style-tools/StyleTools";
import {styleImportFrom} from "@src/react/pages/game/components/styles-sheet/style-import/StyleImportFrom";

/**
 * The ways to start a board over: back to what it was opened on, or another the player has, or one shared
 * as a key. Loading one puts it in place of the draft; that the controls are then no longer pointed at a
 * point of the old one is the editor's to see to.
 */
interface Props {
  readonly startBoardStyle: BoardStyle;
  /** The boards the player has, which one may be loaded from. */
  readonly boardStyles: readonly BoardStyle[];
  readonly styleDraft: StyleDraft<BoardStyle>;
  /** Called once a style has been put in place of the draft. */
  readonly onLoaded: () => void;
  /** Says how loading went, above the preview. */
  readonly onPasteResult: (pasteResult: PasteResult | undefined) => void;
}

export function BoardStyleTools({
  startBoardStyle,
  boardStyles,
  styleDraft,
  onLoaded,
  onPasteResult,
}: Props): React.JSX.Element {
  const load = (boardStyle: BoardStyle): void => {
    styleDraft.replace(boardStyle);
    onLoaded();
  };

  return (
    <StyleTools
      startName={startBoardStyle.name}
      onReset={() => {
        styleDraft.reset();
        onLoaded();
        onPasteResult(undefined);
      }}
      onPasteKey={text => {
        const styleOutcome = styleImportFrom(text);
        if (styleOutcome.kind === "board") {
          load(styleOutcome.style);

          return {accepted: true, message: `Loaded "${styleOutcome.style.name}".`};
        }

        return {
          accepted: false,
          message:
            styleOutcome.kind === "pieces"
              ? "That is a piece set key, and this is a board being made."
              : styleOutcome.reason,
        };
      }}
      sources={boardStyles.map(boardStyle => boardStyle.name)}
      onCopy={from => {
        const boardStyle = boardStyles.find(candidateBoardStyle => candidateBoardStyle.name === from);
        if (!boardStyle) return;

        load(boardStyle);
        onPasteResult({accepted: true, message: `Loaded "${boardStyle.name}".`});
      }}
      byArmy={false}
    />
  );
}
