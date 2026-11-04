import type {WordRun} from "@src/language/types/format-explanation/WordRun";

/** A sentence in order, so each language can place its own emphasis wherever its grammar puts the word. */
export type WordRuns = readonly WordRun[];
