import {ExplanationToggle} from "@src/react/pages/game/components/settings/components/explanation-toggle/ExplanationToggle";
import {PasteKey} from "@src/react/pages/game/components/paste-key/PasteKey";
import type {PasteResult} from "@src/react/pages/game/components/paste-key/types/PasteResult";
import {SaveBuilder} from "@src/redux/saves/SaveBuilder";
import {ShareKey} from "@src/react/pages/game/components/share-key/ShareKey";
import type {AppDispatch} from "@src/redux/Store";
import {saveFrom} from "@src/redux/saves/SaveFrom";
import {saveLoaded} from "@src/redux/saves/actions/SaveLoaded";
import {useAppDispatch, useAppSelector} from "@src/redux/Hooks";
import {useId, useState} from "react";

/**
 * The save key that carries progress and styles without an account. Clearing site data or moving to
 * a new phone loses anything that was not copied; loading a save replaces the XP and unlocks here.
 */
export function SaveTransfer(): React.JSX.Element {
  const progress = useAppSelector(state => state.progress);
  const customStyles = useAppSelector(state => state.customStyles);
  const dispatch = useAppDispatch();
  const [explained, setExplained] = useState(false);
  const explanationId = useId();

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-1.5">
        <span className="text-xs font-medium text-white/60">Move your progress to another device</span>

        <ExplanationToggle
          testId="progress-save-explain"
          ariaLabel="What a save holds"
          expanded={explained}
          controls={explanationId}
          onToggle={() => setExplained(shown => !shown)}
        />
      </div>

      {explained && (
        <p id={explanationId} className="rounded-xl bg-black/25 p-3 text-sm text-white/85">
          A save holds your XP, the bots you have beaten and your own styles. Loading one replaces your XP.
        </p>
      )}

      <ShareKey id="save" label="Copy save key" keyOf={() => SaveBuilder.of({progress, customStyles}).key()} />

      <PasteKey
        id="save-load"
        label="Load save"
        placeholder="Paste a save key"
        onSubmit={text => loadSave(dispatch, text)}
      />
    </div>
  );
}

function loadSave(dispatch: AppDispatch, text: string): PasteResult {
  const save = saveFrom(text);
  if (!save) return {accepted: false, message: "That is not a save key."};

  dispatch(saveLoaded(save));

  return {accepted: true, message: "Loaded. Your XP and unlocks are the save's now."};
}
