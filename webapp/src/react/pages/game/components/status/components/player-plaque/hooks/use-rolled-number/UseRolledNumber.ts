import {useEffect, useRef, useState} from "react";

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

    const from = shownRef.current;
    const startedAt = performance.now();
    let frame = requestAnimationFrame(tick);

    function tick(now: number): void {
      const progress = Math.min(1, (now - startedAt) / ROLL_MS);
      const eased = 1 - (1 - progress) ** 3;
      const next = progress >= 1 ? value : Math.round((from + (value - from) * eased) * 2) / 2;

      shownRef.current = next;
      setShown(next);

      if (progress < 1) frame = requestAnimationFrame(tick);
    }

    return () => cancelAnimationFrame(frame);
  }, [value, rolling]);

  return rolling ? shown : value;
}

/** Long enough to be seen counting, short enough to be done before the next move is thought about. */
const ROLL_MS = 450;
