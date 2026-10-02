import {NameForm} from "@src/react/pages/game/components/settings/tabs/progress-pane/components/account/components/name-form/NameForm";
import type {SyncState} from "@src/redux/account/types/SyncState";
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
 * Signing in with Google, to keep the player's progress and styles on every device they play on.
 *
 * **Optional, and only here.** Nothing else in the game offers it, asks for it or mentions it, and a player who
 * never presses the button has the game exactly as it was, with no call made anywhere. Signed in, the same place
 * shows whether syncing is working — a failure is a line of text here and nothing during play — and offers to sign
 * out, which leaves everything on the device, or to delete what the server holds.
 */
export function Account(): React.JSX.Element {
  const status = useAppSelector(state => state.account.status);
  const sync = useAppSelector(state => state.account.sync);
  const displayName = useAppSelector(state => state.account.displayName);
  const dispatch = useAppDispatch();
  const [confirmingDelete, setConfirmingDelete] = useState(false);

  return (
    <div data-testid="account" className="flex flex-col gap-2">
      <span className="text-xs font-medium text-white/60">Keep your progress on every device</span>

      {status !== "signed-in" && (
        <>
          <p className="text-sm text-white/70">
            Sign in with Google and your XP, unlocks, record against the bot, styles and look follow you. The game works
            the same without it. What is kept is your Google account&apos;s anonymous ID, a display name you can change,
            and your save, never your real name or email.
          </p>

          <button
            type="button"
            data-testid="account-sign-in"
            onClick={() => dispatch(signIn())}
            className="flex min-h-11 cursor-pointer items-center justify-center rounded-lg border border-wood/20 px-3 py-2 text-sm text-wood hover:bg-wood/10"
          >
            Sign in with Google
          </button>
        </>
      )}

      {status === "signed-in" && (
        <>
          <p data-testid="account-signed-in" className="text-sm font-medium text-white/85">
            Signed in with Google
          </p>

          {displayName !== undefined && (
            <p data-testid="account-name" data-name={displayName} className="text-lg font-bold text-gold">
              {displayName}
            </p>
          )}

          <p data-testid="account-sync-state" data-state={sync} className="text-sm text-white/70">
            {SYNC_LABELS[sync]}
          </p>

          <NameForm />

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              data-testid="account-sign-out"
              onClick={() => dispatch(signOut())}
              className="flex min-h-11 cursor-pointer items-center rounded-lg border border-wood/20 px-3 py-2 text-sm text-wood hover:bg-wood/10"
            >
              Sign out
            </button>

            {!confirmingDelete && (
              <button
                type="button"
                data-testid="account-delete"
                onClick={() => setConfirmingDelete(true)}
                className="flex min-h-11 cursor-pointer items-center rounded-lg border border-danger/40 px-3 py-2 text-sm text-danger hover:bg-danger/10"
              >
                Delete my account
              </button>
            )}

            {confirmingDelete && (
              <button
                type="button"
                data-testid="account-delete-confirm"
                onClick={() => dispatch(deleteAccount())}
                className="flex min-h-11 cursor-pointer items-center rounded-lg border border-danger bg-danger/20 px-3 py-2 text-sm text-danger hover:bg-danger/30"
              >
                Delete what the server holds
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
}
