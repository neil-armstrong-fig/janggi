import {BUILT_IN_PIECE_STYLES} from "@src/react/pages/game/components/board/piece-styles/builtin/BuiltInPieceStyles";
import {BUILT_IN_STYLES} from "@src/react/pages/game/components/board/cell-styles/builtin/BuiltInStyles";
import type {EditingStyle} from "@src/react/pages/game/components/styles-sheet/types/EditingStyle";
import {OwnStyles} from "@src/react/pages/game/components/styles-sheet/components/own-styles/OwnStyles";
import {SheetHeader} from "@src/react/pages/game/components/styles-sheet/components/sheet-header/SheetHeader";
import {StyleEditor} from "@src/react/pages/game/components/styles-sheet/components/style-editor/StyleEditor";
import {StyleImporter} from "@src/react/pages/game/components/styles-sheet/components/style-importer/StyleImporter";
import {StyleStarter} from "@src/react/pages/game/components/styles-sheet/components/style-starter/StyleStarter";
import {UNLOCK_PRICES} from "@src/redux/progress/unlocks/UnlockPrices";
import {boardStylePrice} from "@src/redux/progress/unlocks/BoardStylePrice";
import {boardStyleChosen, pieceSetChosen} from "@src/redux/preferences/PreferencesSlice";
import {boardStyleSaved, pieceSetSaved} from "@src/redux/custom-styles/CustomStylesSlice";
import {clsx} from "clsx";
import {pieceSetPrice} from "@src/redux/progress/unlocks/PieceSetPrice";
import {useAppDispatch, useAppSelector} from "@src/redux/Hooks";
import {useState} from "react";

/**
 * The player's own board styles and piece sets: each with a key to share it by, a box to import one
 * somebody else shared, and — once their XP unlocks it — an editor to make one on a board of its own.
 *
 * **Styles never leave the device except as a key the player copies.** There is no server to upload one
 * to, so there is nothing anybody has to moderate; a style is only ever seen by whoever was handed its
 * key and chose to paste it. What is pasted is checked all the way down, and a style that would load
 * anything from beyond the page is refused (`isCssValue`).
 *
 * **A sheet over the game, like `RecordSheet`**, opened from the settings, which it replaces on screen.
 * While a style is being made it grows to nearly the whole screen — and on a desktop, wide enough to have
 * the board beside its controls — and the editor draws a board of its own to show the style on. One that is
 * saved is worn the moment it is, and seen straight away on the game when the sheet closes.
 */
interface Props {
  readonly open: boolean;
  readonly onClose: () => void;
}

export function StylesSheet({open, onClose}: Props): React.JSX.Element {
  const customStyles = useAppSelector(state => state.customStyles);
  const xp = useAppSelector(state => state.progress.xp);
  const dispatch = useAppDispatch();
  const [editingStyle, setEditingStyle] = useState<EditingStyle | undefined>(undefined);

  // What the player has: every built-in they have unlocked, and their own. What a style is started from, and shown with.
  const boardStyles = [
    ...BUILT_IN_STYLES.filter(builtInBoardStyle => xp >= boardStylePrice(builtInBoardStyle.name)),
    ...customStyles.boards,
  ];
  const pieceSetStyles = [
    ...BUILT_IN_PIECE_STYLES.filter(builtInPieceSetStyle => xp >= pieceSetPrice(builtInPieceSetStyle.name)),
    ...customStyles.pieceSets,
  ];

  return (
    <>
      <div
        aria-hidden
        onClick={onClose}
        className={clsx(
          "fixed inset-0 z-10 bg-black/50 transition-opacity duration-300 motion-reduce:transition-none",
          open && "opacity-100",
          !open && "pointer-events-none opacity-0",
        )}
      />

      <section
        data-testid="styles"
        role="dialog"
        aria-label="Your styles"
        aria-modal={open}
        inert={!open}
        className={clsx(
          "fixed inset-x-0 bottom-0 z-20 mx-auto flex w-full max-w-lg select-none flex-col rounded-t-2xl bg-ground-raised transition-transform duration-300 ease-out motion-reduce:transition-none",
          editingStyle && "h-[92dvh] lg:max-w-6xl",
          !editingStyle && "max-h-[85dvh]",
          open && "translate-y-0 shadow-2xl shadow-black",
          !open && "translate-y-full",
        )}
      >
        <SheetHeader onClose={onClose} />

        <div
          className={clsx(
            "flex flex-col gap-5 overflow-y-auto px-4 pt-2 pb-[max(1rem,env(safe-area-inset-bottom))]",
            // Kept in the page while a style is made, so what it holds can still be read.
            editingStyle && "hidden",
          )}
        >
          <OwnStyles />

          <StyleImporter />

          <StyleStarter
            unlocked={xp >= UNLOCK_PRICES.styleEditor}
            price={UNLOCK_PRICES.styleEditor}
            boardStyles={boardStyles}
            pieceSetStyles={pieceSetStyles}
            onStart={setEditingStyle}
          />
        </div>

        {editingStyle && (
          <StyleEditor
            editingStyle={editingStyle}
            boardStyles={boardStyles}
            pieceSetStyles={pieceSetStyles}
            onBack={() => setEditingStyle(undefined)}
            onSaveBoard={boardStyle => {
              dispatch(boardStyleSaved(boardStyle));
              dispatch(boardStyleChosen(boardStyle.name));
            }}
            onSavePieces={pieceSetStyle => {
              dispatch(pieceSetSaved(pieceSetStyle));
              dispatch(pieceSetChosen(pieceSetStyle.name));
            }}
          />
        )}
      </section>
    </>
  );
}
