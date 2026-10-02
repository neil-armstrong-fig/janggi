/** What came of asking to change the display name: whether it was changed, and what to tell the player either way. */
export interface RenameResult {
  readonly accepted: boolean;
  readonly message: string;
}
