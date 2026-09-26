import type {TourTargetName} from "@janggi/shared/janggi/onboarding/TourTargetName";
import {useEffect, useEffectEvent} from "react";

/**
 * Calls `onTap` when the player taps the element wearing `target`, or anything inside it — the tour moving
 * on because they did the thing it asked. Heard on the way down, before the element's own handler, so the
 * tour is already on its next step when what they tapped answers; the tap itself is not touched, and goes on
 * to do what it always does.
 */
export function useAdvanceOnTap(target: TourTargetName | undefined, onTap: () => void): void {
  const tapped = useEffectEvent(onTap);

  useEffect(() => {
    if (target === undefined) return;

    const onClick = (event: MouseEvent): void => {
      if (event.target instanceof Element && event.target.closest(`[data-tour-target="${target}"]`)) tapped();
    };

    document.addEventListener("click", onClick, true);

    return () => document.removeEventListener("click", onClick, true);
  }, [target]);
}
