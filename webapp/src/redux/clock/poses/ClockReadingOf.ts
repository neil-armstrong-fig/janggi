import type {ClockPose} from "@src/redux/clock/types/ClockPose";
import type {ClockReading} from "@src/redux/clock/poses/types/ClockReading";
import type {TimeControl} from "@janggi/shared/janggi/settings/TimeControl";

/**
 * What an army's clock shows in a pose: the army to move is the one the pose is about, and the other sits part way
 * through its free time. Made-up figures, to judge the look, which the real arithmetic replaces.
 */
export function clockReadingOf(timeControl: TimeControl, pose: ClockPose, toMove: boolean): ClockReading {
  if (pose === "Start") return inFreeTime(timeControl, 1);

  if (!toMove) return inFreeTime(timeControl, WAITING_SHARE);

  switch (pose) {
    case "Free time":
      return inFreeTime(timeControl, TO_MOVE_SHARE);
    // Overtime (초읽기, "counting the seconds") follows once free time runs out. Each move must be made within
    // one short period, such as 30 seconds. Moving in time keeps the period, and letting it run out uses it up.
    case "Overtime":
      return {
        state: "overtime",
        seconds: Math.max(timeControl.periodSeconds - 3, 1),
        periods: Math.max(timeControl.periods - 1, 1),
      };
    case "Low time":
      return {state: "low", seconds: LOW_SECONDS, periods: 1};
    case "Time lost":
      return {state: "lost", seconds: 0, periods: 0};
  }
}

/** A share of the free time, or the first period where a format has no free time to take a share of. */
function inFreeTime({minutes, periodSeconds, periods}: TimeControl, share: number): ClockReading {
  if (minutes === 0) return {state: "overtime", seconds: periodSeconds, periods};

  return {state: "free", seconds: Math.round(minutes * 60 * share), periods};
}

const TO_MOVE_SHARE = 0.9;
const WAITING_SHARE = 0.75;
const LOW_SECONDS = 7;
