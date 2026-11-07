import {useMessages} from "@src/react/pages/game/hooks/use-messages/UseMessages";
import type {PasteResult} from "@src/react/pages/game/components/paste-key/types/PasteResult";
import {PasteKey} from "@src/react/pages/game/components/paste-key/PasteKey";
import {SectionHeading} from "@src/react/pages/game/components/styles-sheet/components/section-heading/SectionHeading";
import {boardStyleImported, pieceSetImported} from "@src/redux/slices/custom-styles/CustomStylesSlice";
import {styleImportFrom} from "@src/react/pages/game/components/styles-sheet/style-import/StyleImportFrom";
import {useAppDispatch} from "@src/redux/Hooks";

/**
 * A box to paste a style somebody shared into. It is only added: the player chooses to wear it from
 * Appearance, like any other. What is pasted is checked all the way down first, and refused with the reason
 * if it would load anything from beyond the page.
 */
export function StyleImporter(): React.JSX.Element {
  const {importer: words, refusals} = useMessages().styles;
  const dispatch = useAppDispatch();

  const importStyle = (text: string): PasteResult => {
    const styleOutcome = styleImportFrom(text, refusals);

    switch (styleOutcome.kind) {
      case "board":
        dispatch(boardStyleImported(styleOutcome.style));
        return {accepted: true, message: words.addedBoard(styleOutcome.style.name)};
      case "pieces":
        dispatch(pieceSetImported(styleOutcome.style));
        return {accepted: true, message: words.addedPieces(styleOutcome.style.name)};
      case "refused":
        return {accepted: false, message: styleOutcome.reason};
    }
  };

  return (
    <section aria-label={words.label} className="flex flex-col gap-2">
      <SectionHeading>{words.heading}</SectionHeading>

      <p className="text-xs text-white/60">{words.note}</p>

      <PasteKey id="style-import" label={words.submit} placeholder={words.placeholder} onSubmit={importStyle} />
    </section>
  );
}
