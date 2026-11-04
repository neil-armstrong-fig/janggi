/**
 * A sentence with one word or phrase set apart, as bold, italic or a link, between the text before it and after it.
 * Each language writes all three parts, so the set-apart words fall where its own order puts them.
 */
export interface MarkedText {
  readonly before: string;
  readonly marked: string;
  readonly after: string;
}
