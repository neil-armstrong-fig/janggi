import type {AccountStatus} from "@src/redux/account/types/AccountStatus";

/** The query parameter that turns the account section on: `?account`. */
export const ACCOUNT_FLAG = "account";

/**
 * Whether the settings offer an account at all. For now only to somebody who asked for it by adding `?account` to the
 * address, which is the whole of the flag — nothing is stored for it, and nobody who does not know it is there is shown
 * anything.
 *
 * A device that already has an account, or is part-way to one, is offered it whatever the address says: a player who
 * signed in must be able to sign out, and the page they come back to from Google is the address they left.
 */
export function isAccountOffered(search: string, status: AccountStatus): boolean {
  return status !== "signed-out" || new URLSearchParams(search).has(ACCOUNT_FLAG);
}
