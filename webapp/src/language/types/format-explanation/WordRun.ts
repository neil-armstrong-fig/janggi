import type {StrongWords} from "@src/language/types/format-explanation/StrongWords";

/** Part of a sentence: plain words, or words said with emphasis. */
export type WordRun = string | StrongWords;
