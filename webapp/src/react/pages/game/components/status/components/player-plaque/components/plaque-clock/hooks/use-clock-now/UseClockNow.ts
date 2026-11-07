import type {Side} from "@janggi/shared/janggi/pieces/Side";
import {isClockRunningFor} from "@src/redux/slices/clock/selecting/IsClockRunningFor";
import {useAppSelector} from "@src/redux/Hooks";
import {useEffect, useState} from "react";

/**
 * The time, kept fresh enough for a clock's face while an army's clock is running, and left alone otherwise, so a clock
 * not running is not redrawn. Often enough that a second never visibly lingers.
 */
export function useClockNow(side: Side): number {
  const running = useAppSelector(state => isClockRunningFor(state, side));
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    if (!running) return undefined;

    const interval = setInterval(() => setNow(Date.now()), TICK_MS);

    return (): void => {
      clearInterval(interval);
    };
  }, [running]);

  return now;
}

const TICK_MS = 200;
