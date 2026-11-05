import type {ClockExplanationMessages} from "@src/language/types/ClockExplanationMessages";
import type {TimeControlFormat} from "@janggi/shared/janggi/settings/TimeControlName";

/** What the clock's setting says. */
export interface ClockMessages {
  readonly label: string;
  readonly formatLabel: string;
  readonly formats: Record<TimeControlFormat, string>;
  readonly minutes: string;
  readonly secondsAPeriod: string;
  readonly periods: string;
  readonly explanation: ClockExplanationMessages;
}
