import type {TargetRect} from "@src/react/pages/game/hooks/use-target-rect/UseTargetRect";
import {useEffect, useState} from "react";

/**
 * Where the element `ref` holds stands on the screen, kept up as it moves or changes size — or undefined until it is
 * drawn. Asked every frame, as `useTargetRect` asks of what the ring is round, and for the same reason: what changes it
 * (its words, its being tucked away) comes with no event. A frame that finds it where it was sets nothing.
 */
export function useElementRect(ref: React.RefObject<HTMLElement | null>): TargetRect | undefined {
  const [rect, setRect] = useState<TargetRect | undefined>(undefined);

  useEffect(() => {
    let frame = 0;
    const measure = (): void => {
      const box = ref.current?.getBoundingClientRect();
      if (box !== undefined) {
        setRect(previous => kept(previous, {top: box.top, left: box.left, width: box.width, height: box.height}));
      }
      frame = requestAnimationFrame(measure);
    };
    frame = requestAnimationFrame(measure);

    return () => cancelAnimationFrame(frame);
  }, [ref]);

  return rect;
}

/** The rectangle measured, or the one before it where nothing has moved, so a card at rest renders nothing. */
function kept(previous: TargetRect | undefined, measured: TargetRect): TargetRect {
  if (
    previous !== undefined &&
    previous.top === measured.top &&
    previous.left === measured.left &&
    previous.width === measured.width &&
    previous.height === measured.height
  ) {
    return previous;
  }

  return measured;
}
