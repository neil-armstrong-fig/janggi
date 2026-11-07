import type {TimeControl} from "@janggi/shared/janggi/settings/TimeControl";
import type {TimeControlName} from "@janggi/shared/janggi/settings/TimeControlName";

/** The format a name means: undefined for Off, what was written out for Custom, and otherwise the one on offer. */
export function timeControlOf(name: TimeControlName, custom: TimeControl): TimeControl | undefined {
  if (name === "Off") return undefined;

  if (name === "Custom") return custom;

  return {minutes: FREE_MINUTES[name], periodSeconds: 30, periods: 3};
}

/** The formats that come with their free time named, which is all but Off and Custom. */
type FormatOnOffer = Exclude<TimeControlName, "Off" | "Custom">;

const FREE_MINUTES: Record<FormatOnOffer, number> = {
  "5 min": 5,
  "10 min": 10,
  "20 min": 20,
};
