import type {UnlockProgress} from "@src/react/pages/game/components/xp-bar/unlock-progress/types/UnlockProgress";
import {unlockLadder} from "@src/redux/progress/unlocks/UnlockLadder";

/**
 * How far `xp` has come from the unlock it last passed to the next one — or undefined once there is no next
 * one, everything being open.
 *
 * **Measured between the two rungs, not from nothing.** The distance to the last theme is a million XP, so
 * a bar over the whole climb would sit at nothing for the life of the app; between rungs it fills, and
 * empties again the moment something opens.
 */
export function unlockProgressFor(xp: number): UnlockProgress | undefined {
  const ladder = unlockLadder();
  const next = ladder.find(step => step.xp > xp);
  if (!next) return undefined;

  const previousXp = ladder.filter(step => step.xp <= xp).at(-1)?.xp ?? 0;

  return {previousXp, next, fraction: (xp - previousXp) / (next.xp - previousXp)};
}
