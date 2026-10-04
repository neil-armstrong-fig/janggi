import {addressWithoutLink} from "@src/react/pages/game/hooks/use-friend-room/utils/AddressWithoutLink";
import {friendCodeInSearch} from "@janggi/shared/janggi/online/friend-code/JoinLink";
import {signIn} from "@src/redux/account/actions/SignIn";
import {useAppDispatch, useAppSelector} from "@src/redux/Hooks";
import {useEscapeKey} from "@src/react/pages/game/components/onboarding/hooks/use-escape-key/UseEscapeKey";
import {useState} from "react";

/**
 * What a signed-out player is asked when they open a friend's `?join=` link: joining needs an account, so the page offers
 * to sign them in — and does nothing else until they say yes, since a player who is not signed in is never spoken to
 * for the API behind their back. Yes goes to Google and comes back to the same link, which takes them into the room;
 * "Not now" (or Escape) takes the link off the address and leaves them with the game they have.
 *
 * Whether there was a link is read once, as the page opens, because dismissing it changes the address.
 */
export function FriendSignIn(): React.JSX.Element | null {
  const status = useAppSelector(state => state.account.status);
  const dispatch = useAppDispatch();
  const [linked, setLinked] = useState(() => friendCodeInSearch(globalThis.location.search) !== undefined);
  const prompting = linked && status === "signed-out";
  const dismiss = (): void => {
    if (!prompting) return;

    globalThis.history.replaceState(globalThis.history.state, "", addressWithoutLink(globalThis.location.href));
    setLinked(false);
  };
  useEscapeKey(dismiss);

  if (!prompting) return null;

  return (
    <div className="fixed inset-0 z-30 flex items-end justify-center bg-black/60 p-3 sm:items-center">
      <section
        data-testid="friend-sign-in"
        role="dialog"
        aria-modal
        aria-labelledby="friend-sign-in-title"
        className="flex max-h-full w-full max-w-md flex-col gap-4 overflow-y-auto rounded-2xl bg-ground-raised p-5 shadow-2xl shadow-black"
      >
        <h2
          id="friend-sign-in-title"
          tabIndex={-1}
          autoFocus
          className="text-lg font-semibold tracking-wide text-wood outline-none"
        >
          Sign in to join your friend
        </h2>

        <p className="text-sm text-white/80">
          Playing a friend needs a Google account, so the game knows who is who. Sign in and you will be taken straight
          to their game.
        </p>

        <button
          type="button"
          data-testid="friend-sign-in-confirm"
          onClick={() => dispatch(signIn())}
          className="cursor-pointer rounded-lg bg-gold px-4 py-3 font-semibold text-ink"
        >
          Sign in with Google
        </button>

        <button
          type="button"
          data-testid="friend-sign-in-dismiss"
          onClick={dismiss}
          className="cursor-pointer self-center rounded-lg px-3 py-2 text-sm text-white/60 underline hover:text-white"
        >
          Not now
        </button>
      </section>
    </div>
  );
}
