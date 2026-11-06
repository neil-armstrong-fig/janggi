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

/**
 * What the clock's (?) unfolds, for someone who has never played on one: the idea first, and only then how to read a
 * format and a plaque, since a format's name means nothing until free time and overtime (초읽기) do.
 */
interface ClockExplanationMessages {
  readonly intro: string;
  readonly freeTime: string;
  readonly overtime: string;
  readonly lostOnTime: string;
  readonly readingAFormat: string;
  readonly smallPrint: string;
}
