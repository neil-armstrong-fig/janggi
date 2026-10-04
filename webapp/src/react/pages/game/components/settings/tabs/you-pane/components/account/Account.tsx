import {Button} from "@src/react/pages/game/components/button/Button";
import {tourTarget} from "@src/react/pages/game/components/tour-target/TourTarget";
import {LegalLinks} from "@src/react/pages/game/components/settings/tabs/you-pane/components/account/components/legal-links/LegalLinks";
import {NameForm} from "@src/react/pages/game/components/settings/tabs/you-pane/components/account/components/name-form/NameForm";
import type {SyncState} from "@src/redux/account/types/SyncState";
import {clsx} from "clsx";
import {deleteAccount} from "@src/redux/account/actions/DeleteAccount";
import {signIn} from "@src/redux/account/actions/SignIn";
import {signOut} from "@src/redux/account/actions/SignOut";
import {useAppDispatch, useAppSelector} from "@src/redux/Hooks";
import {useState} from "react";

const SYNC_LABELS: Record<SyncState, string> = {
  idle: "Syncing…",
  synced: "Your progress is kept in step.",
  paused: "Sync paused. It will try again after your next change.",
  "too-large":
    "Your data is too big to sync, so it is kept on this device only. Deleting a style or two would let it sync again.",
};

/**
 * Optional Google sign-in, presented as one account card rather than mixed into the player's progress.
 * A signed-out player makes no server call; signing out or deleting the server account leaves this device alone.
 */
export function Account(): React.JSX.Element {
  const status = useAppSelector(state => state.account.status);
  const sync = useAppSelector(state => state.account.sync);
  const displayName = useAppSelector(state => state.account.displayName);
  const dispatch = useAppDispatch();
  const [confirmingDelete, setConfirmingDelete] = useState(false);

  return (
    <div
      {...tourTarget("account")}
      className="flex flex-col gap-3 rounded-xl border border-white/10 bg-black/20 p-3 sm:p-4"
    >
      <div className="flex flex-col gap-1">
        <span className="text-xs font-medium text-white/60">Account</span>

        <p className="text-base font-semibold text-white/90">Keep your game in sync</p>
      </div>

      {status === "signed-out" && (
        <>
          <p className="text-sm leading-relaxed text-white/70">
            Sign in with Google to keep your XP, unlocks, bot record, styles and look in step across devices. Janggi
            works the same without an account.
          </p>

          <p className="text-xs leading-relaxed text-white/55">
            Janggi keeps an anonymous Google account ID, your display name and your save. It never sees your Google name
            or email.
          </p>

          <button
            type="button"
            data-testid="account-sign-in"
            onClick={() => dispatch(signIn())}
            className="flex min-h-11 cursor-pointer items-center justify-center rounded-lg border border-gold/50 bg-gold/10 px-3 py-2 text-sm font-semibold text-gold hover:bg-gold/20"
          >
            Sign in with Google
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
          Finishing sign-in…
        </button>
      )}

      {status === "signed-in" && (
        <>
          <div className="flex flex-col gap-2 rounded-lg bg-black/20 p-3">
            <div>
              <p data-testid="account-signed-in" className="text-xs font-medium text-white/60">
                Signed in with Google
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
              {SYNC_LABELS[sync]}
            </p>
          </div>

          <NameForm />

          <div className="grid grid-cols-2 gap-2">
            <Button
              variant="outline"
              data-testid="account-sign-out"
              onClick={() => dispatch(signOut())}
              className="items-center justify-center"
            >
              Sign out
            </Button>

            {!confirmingDelete && (
              <button
                type="button"
                data-testid="account-delete"
                onClick={() => setConfirmingDelete(true)}
                className="flex min-h-11 cursor-pointer items-center justify-center rounded-lg border border-danger/40 px-3 py-2 text-sm text-danger hover:bg-danger/10"
              >
                Delete my account
              </button>
            )}

            {confirmingDelete && (
              <button
                type="button"
                data-testid="account-delete-confirm"
                onClick={() => dispatch(deleteAccount())}
                className="col-span-2 flex min-h-11 cursor-pointer items-center justify-center rounded-lg border border-danger bg-danger/20 px-3 py-2 text-sm text-danger hover:bg-danger/30"
              >
                Delete what the server holds
              </button>
            )}
          </div>
        </>
      )}

      <LegalLinks />
    </div>
  );
}
