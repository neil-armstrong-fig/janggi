import type {AccountSliceState} from "@src/redux/slices/account/types/AccountSliceState";
import type {YouMessages} from "@src/language/settings/you/you-messages/YouMessages";

export function accountSummary(accountSliceState: AccountSliceState, you: YouMessages): string {
  if (accountSliceState.status === "signed-out") return you.account.signedOut;

  if (accountSliceState.status === "signing-in") return you.account.signingIn;

  return you.account.summary(
    accountSliceState.displayName ?? you.account.signedInWith,
    you.account.syncSummary(accountSliceState.sync),
  );
}
