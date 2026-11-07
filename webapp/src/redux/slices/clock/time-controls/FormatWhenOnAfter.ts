import type {TimeControlFormat, TimeControlName} from "@janggi/shared/janggi/settings/TimeControlName";

/** What the clock's switch will turn on after a choice: the format just chosen, or the one it had if it was turned off. */
export function formatWhenOnAfter(formatWhenOn: TimeControlFormat, name: TimeControlName): TimeControlFormat {
  if (name === "Off") return formatWhenOn;

  return name;
}
