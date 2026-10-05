/** A device that asked to be told when it is its player's turn: where to send to, and the keys a message to it is encrypted with. */
export interface PushSubscription {
  readonly endpoint: string;
  readonly p256dh: string;
  readonly auth: string;
}
