import {chooseGame} from "@src/redux/online/actions/ChooseGame";
import {clsx} from "clsx";
import {friendGameOf} from "@src/redux/online/selecting/FriendGameOf";
import {GAMES_SHOWN} from "@janggi/shared/janggi/online/GameShown";
import {inFriendRoom} from "@src/redux/online/selecting/InFriendRoom";
import {mayActInFriendGame} from "@src/redux/online/selecting/MayActInFriendGame";
import {tourTarget} from "@src/react/pages/game/components/tour-target/TourTarget";
import {useAppDispatch, useAppSelector} from "@src/redux/Hooks";
import {useMessages} from "@src/react/pages/game/hooks/use-messages/UseMessages";

/**
 * Which game is on the board: the player's own — against the bot, or at the one device — or the friend's. Always
 * drawn, as the way into online play: where there is no game with a friend, Online leads to the sign-in or to the sheet
 * that makes a code (`chooseGame`). Once there is one both go on: the friend's is played by the room while it waits, and
 * says when it is waiting on the player.
 */
export function GamesSetting(): React.JSX.Element {
  const friend = useAppSelector(state => state.friend);
  const game = useAppSelector(state => state.game);
  const dispatch = useAppDispatch();
  const {play} = useMessages();

  // With no game with a friend, `viewing` is only its initial value: the board is the player's own.
  const onTheBoard = inFriendRoom(friend) ? friend.viewing : "local";
  const yourMove = friend.viewing === "local" && mayActInFriendGame(friend, friendGameOf(friend, game).played.present);

  return (
    <div className="flex flex-col gap-2" {...tourTarget("friend")}>
      <div className="flex items-center gap-3">
        <span className="text-xs font-medium text-white/60">{play.games}</span>

        <div data-testid="games-picker" role="group" aria-label="Which game is on the board" className="flex gap-1">
          {GAMES_SHOWN.map(shown => (
            <button
              key={shown}
              type="button"
              data-testid={`games-option-${shown}`}
              data-game={shown}
              data-your-move={shown === "friend" && yourMove}
              aria-pressed={onTheBoard === shown}
              onClick={() => dispatch(chooseGame(shown))}
              className={clsx(
                "min-h-9 cursor-pointer rounded-lg px-3 text-sm transition-colors duration-150 motion-reduce:transition-none",
                onTheBoard === shown && "bg-wood/20 text-wood",
                onTheBoard !== shown && "text-white/60 hover:bg-white/10",
              )}
            >
              {play.gameNames[shown]}
              {shown === "friend" && yourMove && play.yourMove}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
