import type {TourTargetName} from "@janggi/shared/janggi/onboarding/TourTargetName";
import {useEffect, useState} from "react";

/** Where an element is on the screen, in the page's own pixels. */
export interface TargetRect {
  readonly top: number;
  readonly left: number;
  readonly width: number;
  readonly height: number;
}

interface Measured {
  readonly name: TourTargetName;
  readonly rect: TargetRect | undefined;
}

/**
 * Where the element the tour is pointing at is, kept up as it moves — or undefined where there is none
 * to point at: no target, nothing on the page wearing it, or it is not drawn (a tab that is not showing).
 *
 * Asked every frame rather than on an event, because what it follows moves without one: the settings
 * sheet slides up for a third of a second, and the board is laid out after the page is. A frame that finds
 * it where it was sets nothing, so a target at rest costs a query and no render.
 */
export function useTargetRect(name: TourTargetName | undefined): TargetRect | undefined {
  const [measured, setMeasured] = useState<Measured | undefined>(undefined);

  useEffect(() => {
    if (name === undefined) return;

    let frame = 0;
    const measure = (): void => {
      const rect = rectOf(name);
      setMeasured(previous => (previous?.name === name && sameRect(previous.rect, rect) ? previous : {name, rect}));
      frame = requestAnimationFrame(measure);
    };
    frame = requestAnimationFrame(measure);

    return () => cancelAnimationFrame(frame);
  }, [name]);

  return measured !== undefined && measured.name === name ? measured.rect : undefined;
}

function rectOf(name: TourTargetName): TargetRect | undefined {
  const element = document.querySelector(`[data-tour-target="${name}"]`);
  const {top, left, width, height} = element?.getBoundingClientRect() ?? {top: 0, left: 0, width: 0, height: 0};

  return width > 0 && height > 0 ? {top, left, width, height} : undefined;
}

function sameRect(a: TargetRect | undefined, b: TargetRect | undefined): boolean {
  if (a === undefined || b === undefined) return a === b;

  return a.top === b.top && a.left === b.left && a.width === b.width && a.height === b.height;
}
