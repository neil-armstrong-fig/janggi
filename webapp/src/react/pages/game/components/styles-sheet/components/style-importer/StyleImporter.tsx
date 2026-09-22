import type {PasteResult} from "@src/react/pages/game/components/paste-key/types/PasteResult";
import {PasteKey} from "@src/react/pages/game/components/paste-key/PasteKey";
import {SectionHeading} from "@src/react/pages/game/components/styles-sheet/components/section-heading/SectionHeading";
import {boardStyleImported, pieceSetImported} from "@src/redux/custom-styles/CustomStylesSlice";
import {styleImportFrom} from "@src/react/pages/game/components/styles-sheet/style-import/StyleImportFrom";
import {useAppDispatch} from "@src/redux/Hooks";

/**
 * A box to paste a style somebody shared into. It is only added: the player chooses to wear it from
 * Appearance, like any other. What is pasted is checked all the way down first, and refused with the reason
 * if it would load anything from beyond the page.
 */
export function StyleImporter(): React.JSX.Element {
  const dispatch = useAppDispatch();

  const importStyle = (text: string): PasteResult => {
    const styleOutcome = styleImportFrom(text);

    switch (styleOutcome.kind) {
      case "board":
        dispatch(boardStyleImported(styleOutcome.style));
        return {accepted: true, message: `Added the board "${styleOutcome.style.name}". Wear it from Appearance.`};
      case "pieces":
        dispatch(pieceSetImported(styleOutcome.style));
        return {accepted: true, message: `Added the pieces "${styleOutcome.style.name}". Wear them from Appearance.`};
      case "refused":
        return {accepted: false, message: styleOutcome.reason};
    }
  };

  return (
    <section aria-label="Import a style" className="flex flex-col gap-2">
      <SectionHeading>Import</SectionHeading>

      <p className="text-xs text-white/60">Paste a key somebody shared. It is only ever kept on this device.</p>

      <PasteKey
        id="style-import"
        label="Import style"
        placeholder="Paste a board or piece set key"
        onSubmit={importStyle}
      />
    </section>
  );
}
