/** The subscription to let go, named with the account it must belong to: no one can remove another's. */
export interface SubscriptionToRemove {
  readonly userId: string;
  readonly endpoint: string;
}
