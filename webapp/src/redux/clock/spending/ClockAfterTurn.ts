import type {ArmyClock} from "@src/redux/clock/types/ArmyClock";
import type {TimeControl} from "@janggi/shared/janggi/settings/TimeControl";

/**
 * What an army has banked after spending some time on a turn. Free time (자유시간) goes first, and whatever is left over runs into
 * overtime (초읽기): moving within a period keeps it, whole, for the next turn, and a period that reaches zero is used up.
 * An army with nothing left has lost on time (시간패). See `docs/rules.md` §6.7.
 */
export function clockAfterTurn({freeMs, periods}: ArmyClock, {periodSeconds}: TimeControl, spentMs: number): ArmyClock {
  if (spentMs < freeMs) return {freeMs: freeMs - spentMs, periods};

  const periodsUsedUp = Math.floor((spentMs - freeMs) / (periodSeconds * 1000));

  return {freeMs: 0, periods: Math.max(periods - periodsUsedUp, 0)};
}
