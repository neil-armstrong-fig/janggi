import type {FormatSummaryMessages} from "@src/language/types/format-explanation/FormatSummaryMessages";

/** What sets the two match formats apart, and the one line that holds for both. */
export interface FormatExplanationMessages {
  readonly casual: FormatSummaryMessages;
  readonly scored: FormatSummaryMessages;
  readonly both: string;
}
