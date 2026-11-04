import type {WordRuns} from "@src/language/types/format-explanation/WordRuns";

export interface FormatSummaryMessages {
  readonly summary: string;
  readonly points: readonly WordRuns[];
}
