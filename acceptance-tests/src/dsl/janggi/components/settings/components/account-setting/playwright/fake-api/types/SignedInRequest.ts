import type {Route} from "@playwright/test";
import type {StoredAccount} from "@src/dsl/janggi/components/settings/components/account-setting/playwright/fake-api/types/StoredAccount";

/** A request from a device with a Google session: what it asked for, how to answer it, and whose account it is. */
export interface SignedInRequest {
  readonly route: Route;
  readonly path: string;
  readonly headers: Record<string, string>;
  readonly device: object;
  readonly account: StoredAccount;
}
