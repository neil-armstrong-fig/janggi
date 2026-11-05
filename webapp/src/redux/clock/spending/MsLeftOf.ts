import type {ArmyClock} from "@src/redux/clock/types/ArmyClock";
import type {TimeControl} from "@janggi/shared/janggi/settings/TimeControl";

/** How long a turn beginning now could go on before the army lost on time: all its free time, then every period. */
export function msLeftOf({freeMs, periods}: ArmyClock, {periodSeconds}: TimeControl): number {
  return freeMs + periods * periodSeconds * 1000;
}
