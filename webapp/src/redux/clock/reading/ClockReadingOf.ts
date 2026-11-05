import type {ArmyClock} from "@src/redux/clock/types/ArmyClock";
import type {ClockReading} from "@src/redux/clock/reading/types/ClockReading";
import type {TimeControl} from "@janggi/shared/janggi/settings/TimeControl";
import {clockAfterTurn} from "@src/redux/clock/spending/ClockAfterTurn";

/**
 * What an army's clock shows, some way into a turn: what it had banked, less the turn so far. Seconds round up, as a
 * clock's face does, so 0:00 only ever means the time has gone.
 */
export function clockReadingOf(armyClock: ArmyClock, timeControl: TimeControl, elapsedMs: number): ClockReading {
  const {freeMs, periods} = clockAfterTurn(armyClock, timeControl, elapsedMs);
  if (freeMs > 0) return inFreeTime(freeMs, periods);

  if (periods === 0) return {state: "lost", seconds: 0, periods: 0};

  const periodMs = timeControl.periodSeconds * 1000;
  const msLeft = periodMs - ((elapsedMs - armyClock.freeMs) % periodMs);

  return inOvertime(msLeft, periods);
}

/** Free time is the last of an army's time only where the format has no periods to follow it. */
function inFreeTime(freeMs: number, periods: number): ClockReading {
  const seconds = Math.ceil(freeMs / 1000);

  if (periods === 0 && freeMs <= LOW_MS) return {state: "low", seconds, periods};

  return {state: "free", seconds, periods};
}

function inOvertime(msLeft: number, periods: number): ClockReading {
  const seconds = Math.ceil(msLeft / 1000);

  if (periods === 1 && msLeft <= LOW_MS) return {state: "low", seconds, periods};

  return {state: "overtime", seconds, periods};
}

const LOW_MS = 10_000;
