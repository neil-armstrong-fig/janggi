/** A passage with two links in it, as the text from the start to the first, between them, and from the second to the end. */
export interface SentenceWithTwoLinks {
  readonly start: string;
  readonly firstLink: string;
  readonly middle: string;
  readonly secondLink: string;
  readonly end: string;
}
