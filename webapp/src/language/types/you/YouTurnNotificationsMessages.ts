/** The switch that has the device tell the player when a friend has moved and it is their turn. */
export interface YouTurnNotificationsMessages {
  readonly label: string;
  readonly on: string;
  readonly off: string;
  /** Said where the player has blocked notifications in the browser, which only they can undo. */
  readonly blocked: string;
}
