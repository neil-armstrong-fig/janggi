import type {PushSubscription} from "@src/database/types/PushSubscription";

/** A device's subscription, and whose it is from now on. */
export interface SubscriptionToSave {
  readonly userId: string;
  readonly subscription: PushSubscription;
  readonly now: Date;
}
