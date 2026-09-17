import {useEffect, useRef, useState} from "react";
import type {Dispatch, RefObject, SetStateAction} from "react";

interface Roll {
  readonly from: number;
  readonly to: number;
  readonly startedAt: number;
  readonly shownRef: RefObject<number>;
  readonly setShown: Dispatch<SetStateAction<number>>;
  frame: number;
}

/**
 * A number shown rolling from what it was to what it is now, rather than jumping — so a score going
 * down after a capture is seen going down, and by how much, at the edge of the eye.
 *
 * With `rolling` off the new number is simply shown. The number itself is never late: whatever is
 * shown on screen, what is handed in is still the truth, and the page keeps writing that into the
 * attributes a test reads.
 *
 * Rolled in half points, which is the finest a janggi score ever moves by.
 */
export function useRolledNumber(value: number, rolling: boolean): number {
  const [shown, setShown] = useState(value);
  const shownRef = useRef(value);

  useEffect(() => {
    if (!rolling) {
      shownRef.current = value;
      return undefined;
    }

    const roll: Roll = {from: shownRef.current, to: value, startedAt: performance.now(), shownRef, setShown, frame: 0};
    roll.frame = requestAnimationFrame(tick.bind(undefined, roll));

    return cancelRoll.bind(undefined, roll);
  }, [value, rolling]);

  return rolling ? shown : value;
}

function tick(roll: Roll, now: number): void {
  const progress = Math.min(1, (now - roll.startedAt) / ROLL_MS);
  const eased = 1 - (1 - progress) ** 3;
  const next = progress >= 1 ? roll.to : Math.round((roll.from + (roll.to - roll.from) * eased) * 2) / 2;

  roll.shownRef.current = next;
  roll.setShown(next);

  if (progress < 1) roll.frame = requestAnimationFrame(tick.bind(undefined, roll));
}

function cancelRoll(roll: Roll): void {
  cancelAnimationFrame(roll.frame);
}

/** Long enough to be seen counting, short enough to be done before the next move is thought about. */
const ROLL_MS = 450;
