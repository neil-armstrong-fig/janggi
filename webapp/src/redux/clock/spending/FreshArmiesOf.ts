import type {ArmyClocks} from "@src/redux/clock/types/ArmyClocks";
import type {TimeControl} from "@janggi/shared/janggi/settings/TimeControl";

/** Both armies at the start of a game: all their free time and every period. Nothing where the clock is off. */
export function freshArmiesOf(timeControl: TimeControl | undefined): ArmyClocks | undefined {
  if (!timeControl) return undefined;

  const armyClock = {freeMs: timeControl.minutes * 60_000, periods: timeControl.periods};

  return {cho: armyClock, han: armyClock};
}
