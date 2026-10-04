import {Button} from "@src/react/pages/game/components/button/Button";
import {inFriendRoom} from "@src/redux/online/selecting/InFriendRoom";
import {sheetOpened} from "@src/redux/settings/SettingsSlice";
import {tourTarget} from "@src/react/pages/game/components/tour-target/TourTarget";
import {useAppDispatch, useAppSelector} from "@src/redux/Hooks";

/**
 * Where playing a friend is offered: here, in the Play tab beside the choice of opponent, and **only to a player who is
 * signed in** — there is no other entry anywhere in the app, and a signed-out player is shown nothing of it.
 */
export function PlayAFriendEntry(): React.JSX.Element | null {
  const signedIn = useAppSelector(state => state.account.status === "signed-in");
  const inGame = useAppSelector(state => inFriendRoom(state.friend));
  const dispatch = useAppDispatch();

  if (!signedIn) return null;

  return (
    <div className="flex flex-col gap-2" {...tourTarget("friend")}>
      <p className="text-xs font-medium text-white/60">Play a friend</p>

      {!inGame && (
        <Button
          variant="outline"
          data-testid="play-a-friend-open"
          onClick={() => dispatch(sheetOpened("friend"))}
          className="items-center justify-between gap-4"
        >
          <span>Play a friend</span>

          <span className="text-xs text-wood/70">With a code</span>
        </Button>
      )}
    </div>
  );
}
