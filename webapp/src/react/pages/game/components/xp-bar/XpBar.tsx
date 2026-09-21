import {clsx} from "clsx";
import {unlockProgressFor} from "@src/react/pages/game/components/xp-bar/unlock-progress/UnlockProgressFor";

/**
 * How far a player's XP has come towards the next unlock, as a bar that fills between the last one and
 * that one — the progress settings draw it under the XP, and the result draws it under what the game
 * earned. Nothing at all once everything is unlocked, having nothing to fill towards.
 *
 * Here above both, since neither owns it. **`data-percent` is what a spec reads**, the whole percent the
 * bar is filled; the `progressbar` role says the same to a screen reader.
 */
interface Props {
  readonly xp: number;
  /** The `data-testid` of the bar, told apart by where it is drawn. */
  readonly testId: string;
  /** Where the bar sits among its neighbours; the bar keeps to its own width. */
  readonly className?: string;
}

export function XpBar({xp, testId, className}: Props): React.JSX.Element | null {
  const progress = unlockProgressFor(xp);
  if (!progress) return null;

  const percent = Math.round(progress.fraction * 100);

  return (
    <div
      role="progressbar"
      aria-label="Progress to the next unlock"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={percent}
      data-testid={testId}
      data-percent={percent}
      className={clsx("h-2 w-full overflow-hidden rounded-full bg-white/15", className)}
    >
      <div className="h-full rounded-full bg-gold" style={{width: `${percent}%`}} />
    </div>
  );
}
