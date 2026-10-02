import {tourTarget} from "@src/react/pages/game/components/tour-target/TourTarget";
import {ExplanationToggle} from "@src/react/pages/game/components/settings/components/explanation-toggle/ExplanationToggle";
import {unlockLadder} from "@src/redux/progress/unlocks/UnlockLadder";
import {useAppSelector} from "@src/redux/Hooks";
import {XpBar} from "@src/react/pages/game/components/xp-bar/XpBar";
import {useId, useState} from "react";

/**
 * How far the player has come: their XP, a bar of how close it is to what it opens next, and a short
 * explanation of how it is earned when they ask for one.
 */
export function Progress(): React.JSX.Element {
  const progress = useAppSelector(state => state.progress);
  const nextUnlock = unlockLadder().find(step => step.xp > progress.xp);
  const [xpExplained, setXpExplained] = useState(false);
  const xpExplanationId = useId();

  return (
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
  );
}
