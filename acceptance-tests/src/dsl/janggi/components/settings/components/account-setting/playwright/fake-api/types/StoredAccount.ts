import type {StoredData} from "@src/dsl/janggi/components/settings/components/account-setting/playwright/fake-api/types/StoredData";

/** What the server keeps for one Google account. */
export interface StoredAccount {
  /** The name the account was given when it was made, until the player changes it; none before the first sign-in. */
  displayName: string | undefined;
  data: StoredData | undefined;
  /** The addresses of the devices this account has asked to be sent a notification of its turns on. */
  readonly pushEndpoints: Set<string>;
}
