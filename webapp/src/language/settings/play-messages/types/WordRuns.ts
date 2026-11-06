/** A sentence in order, so each language can place its own emphasis wherever its grammar puts the word. */
export type WordRuns = readonly WordRun[];

/** Part of a sentence: plain words, or words said with emphasis. */
type WordRun = string | StrongWords;

interface StrongWords {
  readonly strong: string;
}
