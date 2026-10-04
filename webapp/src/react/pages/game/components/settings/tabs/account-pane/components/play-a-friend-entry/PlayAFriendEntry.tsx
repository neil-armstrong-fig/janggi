import {Button} from "@src/react/pages/game/components/button/Button";
import {Switch} from "@src/react/pages/game/components/settings/components/switch/Switch";
import {inFriendRoom} from "@src/redux/online/selecting/InFriendRoom";
import {sheetOpened} from "@src/redux/settings/SettingsSlice";
import {showOpponentLookChosen} from "@src/redux/preferences/PreferencesSlice";
import {tourTarget} from "@src/react/pages/game/components/tour-target/TourTarget";
import {useAppDispatch, useAppSelector} from "@src/redux/Hooks";

/**
 * Where playing a friend is offered: here, in the Account tab, and **only to a player who is signed in** — there is no other
 * entry anywhere in the app, and a signed-out player is shown nothing of it. With it, the switch for whether a friend's board and
 * pieces are shown, and this player's own sent to them.
 */
export function PlayAFriendEntry(): React.JSX.Element | null {
  const signedIn = useAppSelector(state => state.account.status === "signed-in");
  const inGame = useAppSelector(state => inFriendRoom(state.friend));
  const showOpponentLook = useAppSelector(state => state.preferences.showOpponentLook);
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

      <Switch
        testId="opponent-look-toggle"
        on={showOpponentLook}
        label="Show opponent's board and pieces"
        onToggle={() => dispatch(showOpponentLookChosen(!showOpponentLook))}
      />

      <p className="px-2 text-xs text-white/40">
        Draws a friend's game in the board and pieces they play on, and sends them yours. Turn it off to see the game as
        you always do.
      </p>
    </div>
  );
}
