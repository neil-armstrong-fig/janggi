import {BUILT_IN_PIECE_STYLES} from "@src/react/pages/game/components/board/piece-styles/builtin/BuiltInPieceStyles";
import {BUILT_IN_STYLES} from "@src/react/pages/game/components/board/cell-styles/builtin/BuiltInStyles";
import {CustomStyleRow} from "@src/react/pages/game/components/styles-sheet/components/custom-style-row/CustomStyleRow";
import type {PasteResult} from "@src/react/pages/game/components/paste-key/types/PasteResult";
import {PasteKey} from "@src/react/pages/game/components/paste-key/PasteKey";
import {StyleEditor} from "@src/react/pages/game/components/styles-sheet/components/style-editor/StyleEditor";
import {UNLOCK_PRICES} from "@src/redux/progress/unlocks/UnlockPrices";
import {boardStyleChosen, pieceSetChosen} from "@src/redux/preferences/PreferencesSlice";
import {
  boardStyleDeleted,
  boardStyleImported,
  boardStyleSaved,
  pieceSetDeleted,
  pieceSetImported,
  pieceSetSaved,
} from "@src/redux/custom-styles/CustomStylesSlice";
import {boardStylePrice} from "@src/redux/progress/unlocks/BoardStylePrice";
import {clsx} from "clsx";
import {encodeKey} from "@janggi/shared/janggi/share-keys/EncodeKey";
import {pieceSetPrice} from "@src/redux/progress/unlocks/PieceSetPrice";
import {styleImportFrom} from "@src/react/pages/game/components/styles-sheet/style-import/StyleImportFrom";
import {useAppDispatch, useAppSelector} from "@src/redux/Hooks";

/**
 * The player's own board styles and piece sets: each with a key to share it by, a box to import one
 * somebody else shared, and — once their XP unlocks it — an editor to make one.
 *
 * **Styles never leave the device except as a key the player copies.** There is no server to upload one
 * to, so there is nothing anybody has to moderate; a style is only ever seen by whoever was handed its
 * key and chose to paste it. What is pasted is checked all the way down, and a style that would load
 * anything from beyond the page is refused (`isCssValue`).
 *
 * **A sheet over the game, like `RecordSheet`**, opened from the settings, which it replaces on screen.
 * The board is still visible above it, so a style saved from the editor — which is worn the moment it
 * is saved — is seen straight away. An imported style is only added: the player chooses to wear it from
 * Appearance, like any other.
 */
interface Props {
  readonly open: boolean;
  readonly onClose: () => void;
}

export function StylesSheet({open, onClose}: Props): React.JSX.Element {
  const customStyles = useAppSelector(state => state.customStyles);
  const xp = useAppSelector(state => state.progress.xp);
  const dispatch = useAppDispatch();

  const hasNone = customStyles.boards.length === 0 && customStyles.pieceSets.length === 0;

  const importStyle = (text: string): PasteResult => {
    const outcome = styleImportFrom(text);

    switch (outcome.kind) {
      case "board":
        dispatch(boardStyleImported(outcome.style));
        return {accepted: true, message: `Added the board "${outcome.style.name}". Wear it from Appearance.`};
      case "pieces":
        dispatch(pieceSetImported(outcome.style));
        return {accepted: true, message: `Added the pieces "${outcome.style.name}". Wear them from Appearance.`};
      case "refused":
        return {accepted: false, message: outcome.reason};
    }
  };

  return (
    <>
      <div
        aria-hidden
        onClick={onClose}
        className={clsx(
          "fixed inset-0 z-10 bg-black/50 transition-opacity duration-300 motion-reduce:transition-none",
          open ? "opacity-100" : "pointer-events-none opacity-0",
        )}
      />

      <section
        data-testid="styles"
        role="dialog"
        aria-label="Your styles"
        aria-modal={open}
        inert={!open}
        className={clsx(
          "fixed inset-x-0 bottom-0 z-20 mx-auto flex max-h-[85dvh] select-none w-full max-w-lg flex-col rounded-t-2xl bg-ground-raised transition-transform duration-300 ease-out motion-reduce:transition-none",
          open ? "translate-y-0 shadow-2xl shadow-black" : "translate-y-full",
        )}
      >
        <header className="flex shrink-0 items-center justify-between px-4 pt-3 pb-1">
          <h2 className="text-sm font-semibold tracking-wide text-wood uppercase">Your styles</h2>

          <button
            type="button"
            data-testid="styles-close"
            aria-label="Close your styles"
            onClick={onClose}
            className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full text-white/70 hover:bg-white/10"
          >
            <svg viewBox="0 0 24 24" aria-hidden className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2}>
              <path d="M6 6l12 12M18 6 6 18" strokeLinecap="round" />
            </svg>
          </button>
        </header>

        <div className="flex flex-col gap-5 overflow-y-auto px-4 pt-2 pb-[max(1rem,env(safe-area-inset-bottom))]">
          <section aria-label="Your own styles" className="flex flex-col gap-2">
            <h3 className={HEADING}>Your own</h3>

            {hasNone && (
              <p className="text-sm text-white/60">None yet. Import one somebody shared with you, or make your own.</p>
            )}

            {!hasNone && (
              <ul className="flex flex-col gap-2">
                {customStyles.boards.map(style => (
                  <CustomStyleRow
                    key={`board-${style.name}`}
                    kind="Board"
                    name={style.name}
                    keyOf={() => encodeKey("board", style)}
                    onDelete={() => dispatch(boardStyleDeleted(style.name))}
                  />
                ))}

                {customStyles.pieceSets.map(set => (
                  <CustomStyleRow
                    key={`pieces-${set.name}`}
                    kind="Pieces"
                    name={set.name}
                    keyOf={() => encodeKey("pieces", set)}
                    onDelete={() => dispatch(pieceSetDeleted(set.name))}
                  />
                ))}
              </ul>
            )}
          </section>

          <section aria-label="Import a style" className="flex flex-col gap-2">
            <h3 className={HEADING}>Import</h3>

            <p className="text-xs text-white/60">Paste a key somebody shared. It is only ever kept on this device.</p>

            <PasteKey
              id="style-import"
              label="Import style"
              placeholder="Paste a board or piece set key"
              onSubmit={importStyle}
            />
          </section>

          <StyleEditor
            unlocked={xp >= UNLOCK_PRICES.styleEditor}
            price={UNLOCK_PRICES.styleEditor}
            boards={[...BUILT_IN_STYLES.filter(style => xp >= boardStylePrice(style.name)), ...customStyles.boards]}
            pieceSets={[
              ...BUILT_IN_PIECE_STYLES.filter(set => xp >= pieceSetPrice(set.name)),
              ...customStyles.pieceSets,
            ]}
            onSaveBoard={style => {
              dispatch(boardStyleSaved(style));
              dispatch(boardStyleChosen(style.name));
            }}
            onSavePieces={set => {
              dispatch(pieceSetSaved(set));
              dispatch(pieceSetChosen(set.name));
            }}
          />
        </div>
      </section>
    </>
  );
}

const HEADING = "border-b border-white/10 pb-1 text-xs font-semibold tracking-wide text-white/40 uppercase";
