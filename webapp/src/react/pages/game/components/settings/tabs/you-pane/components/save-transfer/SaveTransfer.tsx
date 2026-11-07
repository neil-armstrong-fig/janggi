import {SettingsGroup} from "@src/react/pages/game/components/settings/components/settings-group/SettingsGroup";
import {PasteKey} from "@src/react/pages/game/components/paste-key/PasteKey";
import type {PasteResult} from "@src/react/pages/game/components/paste-key/types/PasteResult";
import {SaveBuilder} from "@src/redux/shared/saves/SaveBuilder";
import {ShareKey} from "@src/react/pages/game/components/share-key/ShareKey";
import type {AppDispatch} from "@src/redux/Store";
import type {YouSaveTransferMessages} from "@src/language/settings/you/you-messages/types/YouSaveTransferMessages";
import {saveFrom} from "@src/redux/shared/saves/SaveFrom";
import {saveLoaded} from "@src/redux/shared/saves/actions/SaveLoaded";
import {useAppDispatch, useAppSelector} from "@src/redux/Hooks";
import {useMessages} from "@src/react/pages/game/hooks/use-messages/UseMessages";

/**
 * The save key that carries progress and styles without an account, for fully offline play; signing in is the easier
 * way to keep devices in step. **Folded away until asked for**, being rarely wanted and a little advanced. Clearing site
 * data or moving to a new phone loses anything that was not copied; loading a save replaces the XP and unlocks here.
 */
interface Props {
  readonly open: boolean;
  readonly onToggle: () => void;
}

export function SaveTransfer({open, onToggle}: Props): React.JSX.Element {
  const {saveTransfer} = useMessages().you;
  const progress = useAppSelector(state => state.progress);
  const customStyles = useAppSelector(state => state.customStyles);
  const dispatch = useAppDispatch();

  return (
    <SettingsGroup
      name="SaveTransfer"
      label={saveTransfer.heading}
      summary={saveTransfer.summary}
      open={open}
      onToggle={onToggle}
    >
      <p className="rounded-xl bg-black/25 p-3 text-sm text-white/85">{saveTransfer.explanation}</p>

      <ShareKey id="save" label={saveTransfer.copy} keyOf={() => SaveBuilder.of({progress, customStyles}).key()} />

      <PasteKey
        id="save-load"
        label={saveTransfer.load}
        placeholder={saveTransfer.placeholder}
        onSubmit={text => loadSave(dispatch, text, saveTransfer)}
      />
    </SettingsGroup>
  );
}

function loadSave(dispatch: AppDispatch, text: string, words: YouSaveTransferMessages): PasteResult {
  const save = saveFrom(text);
  if (!save) return {accepted: false, message: words.notAKey};

  dispatch(saveLoaded(save));

  return {accepted: true, message: words.loaded};
}
