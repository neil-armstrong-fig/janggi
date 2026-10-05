import type {Route} from "@playwright/test";
import type {StoredAccount} from "@src/dsl/janggi/components/settings/components/account-setting/playwright/fake-api/types/StoredAccount";

/** A device asking to be told of its player's turns, or to stop: how to answer it, and whose account it is. */
export interface PushSubscriptionRequest {
  readonly route: Route;
  readonly headers: Record<string, string>;
  readonly account: StoredAccount;
}
