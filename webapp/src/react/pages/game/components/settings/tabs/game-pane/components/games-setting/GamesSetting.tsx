import {clsx} from "clsx";
import {friendGameOf} from "@src/redux/online/selecting/FriendGameOf";
import {GAMES_SHOWN} from "@janggi/shared/janggi/online/GameShown";
import type {GameShown} from "@janggi/shared/janggi/online/GameShown";
import {inFriendRoom} from "@src/redux/online/selecting/InFriendRoom";
import {mayActInFriendGame} from "@src/redux/online/selecting/MayActInFriendGame";
import {switchGame} from "@src/redux/online/actions/SwitchGame";
import {useAppDispatch, useAppSelector} from "@src/redux/Hooks";

/**
 * Which game is on the board while one with a friend is on: the player's own — against the bot, or at the one device — or the
 * friend's. Both go on: the friend's is played by the room while it waits, and says when it is waiting on the player.
 * Not drawn where there is no game with a friend to choose from.
 */
export function GamesSetting(): React.JSX.Element | null {
  const friend = useAppSelector(state => state.friend);
  const game = useAppSelector(state => state.game);
  const dispatch = useAppDispatch();

  if (!inFriendRoom(friend)) return null;

  const yourMove = friend.viewing === "local" && mayActInFriendGame(friend, friendGameOf(friend, game).played.present);

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-3">
        <span className="text-xs font-medium text-white/60">Games</span>

        <div data-testid="games-picker" role="group" aria-label="Which game is on the board" className="flex gap-1">
          {GAMES_SHOWN.map(shown => (
            <button
              key={shown}
              type="button"
              data-testid={`games-option-${shown}`}
              data-game={shown}
              data-your-move={shown === "friend" && yourMove}
              aria-pressed={friend.viewing === shown}
              onClick={() => dispatch(switchGame(shown))}
              className={clsx(
                "min-h-9 cursor-pointer rounded-lg px-3 text-sm transition-colors duration-150 motion-reduce:transition-none",
                friend.viewing === shown && "bg-wood/20 text-wood",
                friend.viewing !== shown && "text-white/60 hover:bg-white/10",
              )}
            >
              {LABELS[shown]}
              {shown === "friend" && yourMove && " · your move"}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

const LABELS: Record<GameShown, string> = {local: "Local", friend: "Online"};
