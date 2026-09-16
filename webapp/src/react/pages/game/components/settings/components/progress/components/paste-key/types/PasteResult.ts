/** What came of a key pasted in: whether it was taken, and what to tell the player either way. */
export interface PasteResult {
  readonly accepted: boolean;
  readonly message: string;
}
