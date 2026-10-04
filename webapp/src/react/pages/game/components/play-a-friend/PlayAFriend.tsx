import {Sheet} from "@src/react/pages/game/components/sheet/Sheet";
import {ChooseSetup} from "@src/react/pages/game/components/play-a-friend/components/choose-setup/ChooseSetup";
import {CodeGiven} from "@src/react/pages/game/components/play-a-friend/components/code-given/CodeGiven";
import {EnterCode} from "@src/react/pages/game/components/play-a-friend/components/enter-code/EnterCode";
import {MakeCode} from "@src/react/pages/game/components/play-a-friend/components/make-code/MakeCode";
import {leaveFriendRoom} from "@src/redux/online/actions/LeaveFriendRoom";
import {sheetClosed, sheetOpened} from "@src/redux/settings/SettingsSlice";
import {useAppDispatch, useAppSelector} from "@src/redux/Hooks";

/**
 * Where a player makes a code to give a friend, or types the one they were given, and — once both are sat down — chooses
 * the arrangement of their army. **A sheet over the game, like `StylesSheet`**, opened from the Play tab, which it
 * replaces on screen; it closes itself as the game begins (`useFriendRoom`).
 *
 * What it shows is the room's state and nothing it keeps of its own: nothing yet, a code to give out, or the choice of
 * arrangement. Every failure is said here, in words, and nowhere else — a game in progress is never interrupted by one.
 *
 * Once there is a room, what stands over the board is the strip (`FriendStrip`), which is in the page even while this
 * sheet covers it.
 */
export function PlayAFriend(): React.JSX.Element {
  const open = useAppSelector(state => state.settings.openSheet === "friend");
  const {state, code} = useAppSelector(state => state.friend);
  const dispatch = useAppDispatch();
  const onClose = (): void => {
    dispatch(sheetClosed());
  };
  const onBack = (): void => {
    dispatch(sheetOpened("settings"));
  };

  const reaching = state === "idle" && code !== undefined;
  const hasRoom = state !== "idle" || reaching;

  return (
    <Sheet
      testId="play-a-friend"
      closeTestId="friend-close"
      title="Play a friend"
      open={open}
      onClose={onClose}
      backTestId="friend-back"
      onBack={onBack}
      className="max-h-[85dvh]"
    >
      <div className="flex flex-col gap-5 overflow-y-auto px-4 pt-2 pb-[max(1rem,env(safe-area-inset-bottom))]">
        {!hasRoom && (
          <>
            <MakeCode />

            <EnterCode />
          </>
        )}

        {hasRoom && code !== undefined && state !== "choosing-setups" && <CodeGiven code={code} />}

        {reaching && <p className="text-sm text-white/70">Reaching the room…</p>}

        {state === "waiting-for-a-friend" && (
          <p className="text-sm text-white/70">Waiting for your friend. Give them the code, or send the link.</p>
        )}

        {state === "choosing-setups" && <ChooseSetup />}

        {hasRoom && (
          <button
            type="button"
            data-testid="friend-leave"
            onClick={() => dispatch(leaveFriendRoom())}
            className="min-h-11 cursor-pointer self-start rounded-lg border border-white/20 px-3 text-sm text-white/70 hover:bg-white/10"
          >
            Leave this room
          </button>
        )}
      </div>
    </Sheet>
  );
}
