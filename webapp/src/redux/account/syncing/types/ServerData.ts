/** What the server holds for the player: the save key last written, or none, and the version it was written as. */
export interface ServerData {
  readonly version: number;
  readonly blob: string | null;
}
