import {clsx} from "clsx";
import {ChevronDownIcon} from "@src/react/pages/game/components/svg-icon/icons/chevron-down/ChevronDownIcon";
import {PasteKey} from "@src/react/pages/game/components/paste-key/PasteKey";
import type {PasteResult} from "@src/react/pages/game/components/paste-key/types/PasteResult";
import {SaveBuilder} from "@src/redux/saves/SaveBuilder";
import {ShareKey} from "@src/react/pages/game/components/share-key/ShareKey";
import type {AppDispatch} from "@src/redux/Store";
import type {YouSaveTransferMessages} from "@src/language/settings/you/you-messages/types/YouSaveTransferMessages";
import {saveFrom} from "@src/redux/saves/SaveFrom";
import {saveLoaded} from "@src/redux/saves/actions/SaveLoaded";
import {useAppDispatch, useAppSelector} from "@src/redux/Hooks";
import {useMessages} from "@src/react/pages/game/hooks/use-messages/UseMessages";
import {useId, useState} from "react";

/**
 * The save key that carries progress and styles without an account, for fully offline play; signing in is the easier
 * way to keep devices in step. **Folded away until asked for**, being rarely wanted and a little advanced. Clearing site
 * data or moving to a new phone loses anything that was not copied; loading a save replaces the XP and unlocks here.
 */
export function SaveTransfer(): React.JSX.Element {
  const {saveTransfer} = useMessages().you;
  const progress = useAppSelector(state => state.progress);
  const customStyles = useAppSelector(state => state.customStyles);
  const dispatch = useAppDispatch();
  const [open, setOpen] = useState(false);
  const bodyId = useId();

  return (
    <div className="flex flex-col gap-3">
      <button
        type="button"
        data-testid="save-transfer-toggle"
        aria-expanded={open}
        aria-controls={bodyId}
        onClick={() => setOpen(shown => !shown)}
        className="flex min-h-11 w-full cursor-pointer items-center justify-between gap-2 text-left"
      >
        <span className="text-xs font-medium text-white/60">{saveTransfer.toggle}</span>

        <ChevronDownIcon
          className={clsx(
            "h-4 w-4 shrink-0 text-white/60 transition-transform duration-150 motion-reduce:transition-none",
            open && "rotate-180",
          )}
        />
      </button>

      {open && (
        <div id={bodyId} className="flex flex-col gap-3">
          <p className="rounded-xl bg-black/25 p-3 text-sm text-white/85">{saveTransfer.explanation}</p>

          <ShareKey id="save" label={saveTransfer.copy} keyOf={() => SaveBuilder.of({progress, customStyles}).key()} />

          <PasteKey
            id="save-load"
            label={saveTransfer.load}
            placeholder={saveTransfer.placeholder}
            onSubmit={text => loadSave(dispatch, text, saveTransfer)}
          />
        </div>
      )}
    </div>
  );
}

function loadSave(dispatch: AppDispatch, text: string, words: YouSaveTransferMessages): PasteResult {
  const save = saveFrom(text);
  if (!save) return {accepted: false, message: words.notAKey};

  dispatch(saveLoaded(save));

  return {accepted: true, message: words.loaded};
}
