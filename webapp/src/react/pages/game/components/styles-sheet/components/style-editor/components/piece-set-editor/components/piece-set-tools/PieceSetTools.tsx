import type {PasteResult} from "@src/react/pages/game/components/paste-key/types/PasteResult";
import type {PieceSetStyle} from "@src/styles/types/PieceSetStyle";
import type {StyleDraft} from "@src/react/pages/game/components/styles-sheet/components/style-editor/hooks/use-style-draft/UseStyleDraft";
import {StyleTools} from "@src/react/pages/game/components/styles-sheet/components/style-editor/components/style-tools/StyleTools";
import {sideName} from "@src/react/pages/game/utils/SideNames";
import {styleImportFrom} from "@src/react/pages/game/components/styles-sheet/style-import/StyleImportFrom";
import {withArmyOf} from "@src/styles/piece-sets/WithArmyOf";

/**
 * The ways to start a piece set over: back to what it was opened on, or another the player has — whole, or
 * one army's pieces only, since Han and Cho can be dressed differently — or one shared as a key. Loading one
 * puts it in place of the draft; that the controls are then no longer pointed at a piece of the old one is
 * the editor's to see to.
 */
interface Props {
  readonly startPieceSetStyle: PieceSetStyle;
  /** The piece sets the player has, which one may be loaded from. */
  readonly pieceSetStyles: readonly PieceSetStyle[];
  readonly styleDraft: StyleDraft<PieceSetStyle>;
  /** Called once a style has been put in place of the draft. */
  readonly onLoaded: () => void;
  /** Says how loading went, above the preview. */
  readonly onPasteResult: (pasteResult: PasteResult | undefined) => void;
}

export function PieceSetTools({
  startPieceSetStyle,
  pieceSetStyles,
  styleDraft,
  onLoaded,
  onPasteResult,
}: Props): React.JSX.Element {
  return (
    <StyleTools
      startName={startPieceSetStyle.name}
      onReset={() => {
        styleDraft.reset();
        onLoaded();
        onPasteResult(undefined);
      }}
      onPasteKey={text => {
        const styleOutcome = styleImportFrom(text);
        if (styleOutcome.kind === "pieces") {
          styleDraft.replace(styleOutcome.style);
          onLoaded();

          return {accepted: true, message: `Loaded "${styleOutcome.style.name}".`};
        }

        return {
          accepted: false,
          message:
            styleOutcome.kind === "board"
              ? "That is a board key, and this is a piece set being made."
              : styleOutcome.reason,
        };
      }}
      sources={pieceSetStyles.map(pieceSetStyle => pieceSetStyle.name)}
      onCopy={(from, copyScope) => {
        const sourcePieceSetStyle = pieceSetStyles.find(candidatePieceSetStyle => candidatePieceSetStyle.name === from);
        if (!sourcePieceSetStyle) return;

        if (copyScope === "both") {
          styleDraft.replace(sourcePieceSetStyle);
          onLoaded();
          onPasteResult({accepted: true, message: `Loaded "${sourcePieceSetStyle.name}".`});
          return;
        }

        styleDraft.replace(withArmyOf(styleDraft.style, sourcePieceSetStyle, copyScope));
        onLoaded();
        onPasteResult({
          accepted: true,
          message: `Loaded ${sideName(copyScope)}'s pieces from "${sourcePieceSetStyle.name}".`,
        });
      }}
      byArmy
    />
  );
}
