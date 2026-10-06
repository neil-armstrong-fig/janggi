import type {FriendConnectionStatus} from "@janggi/shared/janggi/online/FriendConnectionStatus";
import type {FriendSliceState} from "@src/redux/online/types/FriendSliceState";
import {actInFriendRoom} from "@src/redux/online/actions/playing/ActInFriendRoom";
import {clsx} from "clsx";
import {friendGameOf} from "@src/redux/online/selecting/FriendGameOf";
import {friendStateOf} from "@src/redux/online/selecting/FriendStateOf";
import {switchGame} from "@src/redux/online/actions/SwitchGame";
import {leaveFriendRoom} from "@src/redux/online/actions/LeaveFriendRoom";
import {sheetOpened} from "@src/redux/settings/SettingsSlice";
import {useAppDispatch, useAppSelector} from "@src/redux/Hooks";
import type {FriendGameState} from "@janggi/shared/janggi/online/FriendGameState";
import {sideName} from "@src/react/pages/game/utils/SideNames";

const CONNECTION_WORDS: Record<FriendConnectionStatus, string> = {
  connecting: "Connecting…",
  connected: "Connected",
  reconnecting: "Reconnecting…",
};

const DOTS: Record<FriendConnectionStatus, string> = {
  connecting: "animate-pulse bg-white/50",
  connected: "bg-green-500",
  reconnecting: "animate-pulse bg-red-500",
};

const WORDS: Record<FriendGameState, string> = {
  idle: "",
  "waiting-for-a-friend": "Waiting for friend to join",
  "choosing-setups": "Choosing arrangements",
  playing: "Playing",
  "opponent-left": "Your friend has left. Your game is kept for them",
  over: "Game over",
};

/**
 * One line over the board while a room is joined: who is across it, whether the room can be reached (a dot, no words), and whose move it is (the strip's colour: gold when it is the player's). Which army the player has is shown on the plaque (`PlayerPlaque`) — with
 * the two things a player does to a game with a friend that the board has no control for, resigning and leaving.
 *
 * It is in the page whenever there is a room, **even under the sheet**, and says nothing at all of a failure to reach the
 * room beyond the state: a game in progress is never interrupted, and one that cannot be reached shows as it was.
 */
export function FriendStrip(): React.JSX.Element | undefined {
  const friend = useAppSelector(state => state.friend);
  const game = useAppSelector(state => friendGameOf(state.friend, state.game).played.present);
  const dispatch = useAppDispatch();
  const state = friendStateOf(friend, game);
  if (state === "idle") return undefined;

  const resignation = resignationWords(friend, state);
  const playing = state === "playing" || state === "opponent-left";
  const yourTurn = state === "playing" && friend.ownSide !== undefined && game.sideToMove === friend.ownSide;
  const theirTurn = state === "playing" && friend.ownSide !== undefined && game.sideToMove !== friend.ownSide;

  return (
    <div
      data-testid="friend-strip"
      data-your-turn={yourTurn}
      className={clsx(
        "mb-1 flex h-10 shrink-0 items-center gap-2 rounded-xl border px-3 text-sm transition-colors duration-300 motion-reduce:transition-none",
        yourTurn && "border-gold bg-gold/30",
        theirTurn && "border-white/5 bg-white/[0.03]",
        !yourTurn && !theirTurn && "border-white/10 bg-white/5",
      )}
    >
      <span
        data-testid="friend-connection"
        data-connection={friend.connection}
        role="img"
        aria-label={CONNECTION_WORDS[friend.connection]}
        className={clsx("size-3 shrink-0 rounded-full", DOTS[friend.connection])}
      />

      <span
        data-testid="friend-status"
        data-state={state}
        role="status"
        className={clsx(state === "waiting-for-a-friend" ? "min-w-0 truncate text-white/80" : "sr-only")}
      >
        {WORDS[state]}
        {resignation !== undefined && ` — ${resignation} resigned`}
      </span>

      {friend.ownSide !== undefined && (
        <span data-testid="friend-own-side" data-side={friend.ownSide} className="sr-only">
          You are {sideName(friend.ownSide)}
        </span>
      )}

      {friend.opponent !== undefined && (
        <span
          data-testid="friend-opponent"
          data-name={friend.opponent.displayName}
          className="min-w-0 truncate font-bold text-gold"
        >
          {friend.opponent.displayName}
        </span>
      )}

      <span className="ml-auto flex shrink-0 gap-1">
        {friend.viewing === "local" && (
          <button
            type="button"
            data-testid="friend-return"
            onClick={() => dispatch(switchGame("friend"))}
            className={BUTTON}
          >
            Back to this game
          </button>
        )}

        {friend.viewing === "friend" && state === "choosing-setups" && (
          <button type="button" onClick={() => dispatch(sheetOpened("friend"))} className={BUTTON}>
            Choose
          </button>
        )}

        {friend.viewing === "friend" && playing && (
          <button
            type="button"
            data-testid="friend-resign"
            onClick={() => dispatch(actInFriendRoom({kind: "resign"}))}
            className={clsx(BUTTON_SHAPE, yourTurn && ON_YOUR_TURN, !yourTurn && QUIET)}
          >
            Resign
          </button>
        )}

        {friend.viewing === "friend" &&
          (state === "over" || state === "opponent-left" || state === "waiting-for-a-friend") && (
            <button
              type="button"
              data-testid="friend-leave-game"
              onClick={() => dispatch(leaveFriendRoom())}
              className={BUTTON}
            >
              Leave
            </button>
          )}
      </span>
    </div>
  );
}

/** Who resigned, in words, once the game is over by resignation: "You", or the friend's name. Nothing while the game is any other way. */
function resignationWords(friend: FriendSliceState, state: FriendGameState): string | undefined {
  if (state !== "over" || friend.resignedBy === undefined) return undefined;
  if (friend.resignedBy === friend.ownSide) return "You";

  return friend.opponent?.displayName ?? "Your friend";
}

const BUTTON_SHAPE = "min-h-8 cursor-pointer rounded-md border px-2 text-xs";

const QUIET = "border-white/20 text-white/80 hover:bg-white/10";

const BUTTON = clsx(BUTTON_SHAPE, QUIET);

/** Over the gold of the player's turn the quiet border and grey words vanish, so the button is darkened and its words go white. */
const ON_YOUR_TURN = "border-ground/50 bg-ground/40 font-semibold text-white hover:bg-ground/60";
