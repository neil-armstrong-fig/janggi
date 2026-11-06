import type {WordRuns} from "@src/language/settings/play-messages/types/WordRuns";

export interface FormatSummaryMessages {
  readonly summary: string;
  readonly points: readonly WordRuns[];
}
