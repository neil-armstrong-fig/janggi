import type {PasteResult} from "@src/react/pages/game/components/settings/components/progress/components/paste-key/types/PasteResult";
import {PasteKey} from "@src/react/pages/game/components/settings/components/progress/components/paste-key/PasteKey";
import {ShareKey} from "@src/react/pages/game/components/settings/components/progress/components/share-key/ShareKey";
import {useAppDispatch, useAppSelector} from "@src/redux/Hooks";
import type {AppDispatch} from "@src/redux/Store";
import {saveLoaded} from "@src/redux/saves/SaveLoaded";
import {SaveBuilder} from "@src/redux/saves/SaveBuilder";
import {saveFrom} from "@src/redux/saves/SaveFrom";
import {unlockLadder} from "@src/redux/progress/unlocks/UnlockLadder";

/**
 * How far the player has come, and how to take it with them: their XP and what it opens next, the save
 * key to copy, and a box to load one.
 *
 * **Nothing is kept anywhere but this device**, which is what a save key is for — clearing site data, or
 * a new phone, loses everything a copied key does not carry. Loading a save replaces the XP and unlocks,
 * so the line under the box says what it did.
 */
export function Progress(): React.JSX.Element {
  const progress = useAppSelector(state => state.progress);
  const customStyles = useAppSelector(state => state.customStyles);
  const dispatch = useAppDispatch();
  const nextUnlock = unlockLadder().find(step => step.xp > progress.xp);

  return (
    <>
      <p data-testid="progress-xp" data-xp={progress.xp} className="text-2xl font-bold text-gold tabular-nums">
        {progress.xp.toLocaleString("en")} XP
      </p>

      {nextUnlock && (
        <p data-testid="progress-next-unlock" data-xp={nextUnlock.xp} className="-mt-2 text-sm text-white/70">
          Next, at {nextUnlock.xp.toLocaleString("en")} XP: {nextUnlock.labels.join(", ")}
        </p>
      )}

      {!nextUnlock && (
        <p data-testid="progress-next-unlock" className="-mt-2 text-sm text-white/70">
          Everything is unlocked.
        </p>
      )}

      <p className="text-xs text-white/50">
        Finish a game against the bot for XP — more for a win, more for a scored game. Beat a bot to open the one above
        it, with each army apart.
      </p>

      <ShareKey id="save" label="Copy save key" keyOf={() => SaveBuilder.of({progress, customStyles}).key()} />

      <p className="text-xs text-white/50">
        A save holds your XP, the bots you have beaten and your own styles. Loading one replaces your XP.
      </p>

      <PasteKey
        id="save-load"
        label="Load save"
        placeholder="Paste a save key"
        onSubmit={text => loadSave(dispatch, text)}
      />
    </>
  );
}

function loadSave(dispatch: AppDispatch, text: string): PasteResult {
  const save = saveFrom(text);
  if (!save) return {accepted: false, message: "That is not a save key."};

  dispatch(saveLoaded(save));

  return {accepted: true, message: "Loaded. Your XP and unlocks are the save's now."};
}
