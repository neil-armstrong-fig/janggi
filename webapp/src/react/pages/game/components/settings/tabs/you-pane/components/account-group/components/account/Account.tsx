import {Button} from "@src/react/pages/game/components/button/Button";
import {tourTarget} from "@src/react/pages/game/components/tour-target/TourTarget";
import {LegalLinks} from "@src/react/pages/game/components/settings/tabs/you-pane/components/account-group/components/account/components/legal-links/LegalLinks";
import {NameForm} from "@src/react/pages/game/components/settings/tabs/you-pane/components/account-group/components/account/components/name-form/NameForm";
import {TurnNotifications} from "@src/react/pages/game/components/settings/tabs/you-pane/components/account-group/components/account/components/turn-notifications/TurnNotifications";
import type {SyncState} from "@src/redux/slices/account/types/SyncState";
import type {YouSyncMessages} from "@src/language/settings/you/you-messages/types/YouSyncMessages";
import {clsx} from "clsx";
import {deleteAccount} from "@src/redux/slices/account/actions/DeleteAccount";
import {signIn} from "@src/redux/slices/account/actions/SignIn";
import {signOut} from "@src/redux/slices/account/actions/SignOut";
import {useAppDispatch, useAppSelector} from "@src/redux/Hooks";
import {useMessages} from "@src/react/pages/game/hooks/use-messages/UseMessages";
import {useState} from "react";

/**
 * Optional Google sign-in, presented as one account card rather than mixed into the player's progress.
 * A signed-out player makes no server call; signing out or deleting the server account leaves this device alone.
 */
export function Account(): React.JSX.Element {
  const {account} = useMessages().you;
  const status = useAppSelector(state => state.account.status);
  const sync = useAppSelector(state => state.account.sync);
  const displayName = useAppSelector(state => state.account.displayName);
  const highlighted = useAppSelector(state => state.settings.accountHighlighted);
  const dispatch = useAppDispatch();
  const [confirmingDelete, setConfirmingDelete] = useState(false);

  return (
    <div
      data-testid="account"
      {...tourTarget("account")}
      data-highlighted={highlighted}
      className={clsx(
        "flex flex-col gap-3 rounded-xl transition-colors duration-300 motion-reduce:transition-none",
        highlighted && "border-gold/70 ring-2 ring-gold/40",
      )}
    >
      <div className="flex flex-col gap-1">
        <span className="text-xs font-medium text-white/60">{account.label}</span>

        <p className="text-base font-semibold text-white/90">{account.heading}</p>
      </div>

      {status === "signed-out" && (
        <>
          <p className="text-sm leading-relaxed text-white/70">{account.signedOutIntro}</p>

          <p className="text-xs leading-relaxed text-white/55">{account.whatIsKept}</p>

          <button
            type="button"
            data-testid="account-sign-in"
            onClick={() => dispatch(signIn())}
            className="flex min-h-11 cursor-pointer items-center justify-center rounded-lg border border-gold/50 bg-gold/10 px-3 py-2 text-sm font-semibold text-gold hover:bg-gold/20"
          >
            {account.signIn}
          </button>
        </>
      )}

      {status === "signing-in" && (
        <button
          type="button"
          disabled
          aria-live="polite"
          className="flex min-h-11 cursor-wait items-center justify-center rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-sm font-semibold text-white/55"
        >
          {account.signingIn}
        </button>
      )}

      {status === "signed-in" && (
        <>
          <div className="flex flex-col gap-2 rounded-lg bg-black/20 p-3">
            <div>
              <p data-testid="account-signed-in" className="text-xs font-medium text-white/60">
                {account.signedInWith}
              </p>

              {displayName !== undefined && (
                <p data-testid="account-name" data-name={displayName} className="mt-1 text-lg font-bold text-gold">
                  {displayName}
                </p>
              )}
            </div>

            <p
              data-testid="account-sync-state"
              data-state={sync}
              role="status"
              className={clsx(
                "rounded-lg border px-2.5 py-2 text-xs leading-relaxed",
                sync === "synced" && "border-cho/20 bg-cho/10 text-cho",
                sync === "idle" && "border-white/10 bg-black/20 text-white/70",
                (sync === "paused" || sync === "too-large") && "border-gold/30 bg-gold/10 text-gold",
              )}
            >
              {syncWords(sync, account.sync)}
            </p>
          </div>

          <NameForm />

          <TurnNotifications />

          <div className="grid grid-cols-2 gap-2">
            <Button
              variant="outline"
              data-testid="account-sign-out"
              onClick={() => dispatch(signOut())}
              className="items-center justify-center"
            >
              {account.signOut}
            </Button>

            {!confirmingDelete && (
              <button
                type="button"
                data-testid="account-delete"
                onClick={() => setConfirmingDelete(true)}
                className="flex min-h-11 cursor-pointer items-center justify-center rounded-lg border border-danger/40 px-3 py-2 text-sm text-danger hover:bg-danger/10"
              >
                {account.deleteAccount}
              </button>
            )}

            {confirmingDelete && (
              <button
                type="button"
                data-testid="account-delete-confirm"
                onClick={() => dispatch(deleteAccount())}
                className="col-span-2 flex min-h-11 cursor-pointer items-center justify-center rounded-lg border border-danger bg-danger/20 px-3 py-2 text-sm text-danger hover:bg-danger/30"
              >
                {account.deleteWhatTheServerHolds}
              </button>
            )}
          </div>
        </>
      )}

      <LegalLinks />
    </div>
  );
}

/** What the card says of syncing: the state is an id with a hyphen in it, the words are not. */
function syncWords(sync: SyncState, words: YouSyncMessages): string {
  if (sync === "too-large") return words.tooLarge;

  return words[sync];
}
