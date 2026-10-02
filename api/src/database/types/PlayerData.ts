/** What is kept for a player: the document the app wrote, and how many times it has been written. */
export interface PlayerData {
  readonly version: number;
  readonly blob: string;
}
