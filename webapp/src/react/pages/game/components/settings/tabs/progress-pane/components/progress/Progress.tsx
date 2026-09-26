import {tourTarget} from "@src/react/pages/game/components/tour-target/TourTarget";
import {ExplanationToggle} from "@src/react/pages/game/components/settings/components/explanation-toggle/ExplanationToggle";
import type {PasteResult} from "@src/react/pages/game/components/paste-key/types/PasteResult";
import {PasteKey} from "@src/react/pages/game/components/paste-key/PasteKey";
import {ShareKey} from "@src/react/pages/game/components/share-key/ShareKey";
import {useAppDispatch, useAppSelector} from "@src/redux/Hooks";
import type {AppDispatch} from "@src/redux/Store";
import {saveLoaded} from "@src/redux/saves/SaveLoaded";
import {SaveBuilder} from "@src/redux/saves/SaveBuilder";
import {saveFrom} from "@src/redux/saves/SaveFrom";
import {unlockLadder} from "@src/redux/progress/unlocks/UnlockLadder";
import {XpBar} from "@src/react/pages/game/components/xp-bar/XpBar";
import {useId, useState} from "react";

/**
 * How far the player has come, and how to take it with them: their XP, a bar of how close it is to what
 * it opens next, the save key to copy, and a box to load one.
 *
 * **Nothing is kept anywhere but this device**, which is what a save key is for — clearing site data, or
 * a new phone, loses everything a copied key does not carry. Loading a save replaces the XP and unlocks,
 * so the line under the box says what it did.
 *
 * What earns XP and what a save holds are each a sentence or two, and the tab is short without them:
 * they wait behind a (?) beside what they explain, like a picker's, until they are asked for.
 */
export function Progress(): React.JSX.Element {
  const progress = useAppSelector(state => state.progress);
  const customStyles = useAppSelector(state => state.customStyles);
  const dispatch = useAppDispatch();
  const nextUnlock = unlockLadder().find(step => step.xp > progress.xp);
  const [xpExplained, setXpExplained] = useState(false);
  const [saveExplained, setSaveExplained] = useState(false);
  const xpExplanationId = useId();
  const saveExplanationId = useId();

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2.5">
          <p
            data-testid="progress-xp"
            data-xp={progress.xp}
            {...tourTarget("xp")}
            className="text-2xl font-bold text-gold tabular-nums"
          >
            {progress.xp.toLocaleString("en")} XP
          </p>

          <ExplanationToggle
            testId="progress-xp-explain"
            ariaLabel="How XP is earned"
            expanded={xpExplained}
            controls={xpExplanationId}
            onToggle={() => setXpExplained(shown => !shown)}
          />
        </div>

        {xpExplained && (
          <p id={xpExplanationId} className="rounded-xl bg-black/25 p-3 text-sm text-white/85">
            Finish a game against the bot for XP — more for a win, more for a scored game. Beat a bot to open the one
            above it, with each army apart.
          </p>
        )}

        <XpBar testId="progress-xp-bar" xp={progress.xp} />

        {nextUnlock && (
          <p data-testid="progress-next-unlock" data-xp={nextUnlock.xp} className="text-sm text-white/70">
            Next, at {nextUnlock.xp.toLocaleString("en")} XP: {nextUnlock.labels.join(", ")}
          </p>
        )}

        {!nextUnlock && (
          <p data-testid="progress-next-unlock" className="text-sm text-white/70">
            Everything is unlocked.
          </p>
        )}
      </div>

      <div className="mt-1 flex items-center gap-1.5">
        <span className="text-xs font-medium text-white/60">Move your progress to another device</span>

        <ExplanationToggle
          testId="progress-save-explain"
          ariaLabel="What a save holds"
          expanded={saveExplained}
          controls={saveExplanationId}
          onToggle={() => setSaveExplained(shown => !shown)}
        />
      </div>

      {saveExplained && (
        <p id={saveExplanationId} className="rounded-xl bg-black/25 p-3 text-sm text-white/85">
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
