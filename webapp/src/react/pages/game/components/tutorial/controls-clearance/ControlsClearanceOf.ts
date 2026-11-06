import type {TargetRect} from "@src/react/pages/game/hooks/use-target-rect/UseTargetRect";

/** How far up from the bottom of the screen the row of controls reaches, in pixels, or 0 while it is not measured. */
export function controlsClearanceOf(controls: TargetRect | undefined): number {
  if (controls === undefined) return 0;

  return window.innerHeight - controls.top;
}
