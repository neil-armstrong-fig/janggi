/** Someone to tell it is their turn, and who just played. */
export interface TurnNotification {
  readonly accountId: string;
  readonly opponentName: string;
}
