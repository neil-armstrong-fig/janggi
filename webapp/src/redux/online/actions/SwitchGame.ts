import type {AppThunk} from "@src/redux/AppThunk";
import type {GameShown} from "@janggi/shared/janggi/online/GameShown";
import {gamesSwapped} from "@src/redux/online/actions/GamesSwapped";

/** Brings the other game to the board, leaving this one where it is. Nothing happens where it is already the one shown, or there is no other. */
export function switchGame(shown: GameShown): AppThunk {
  return (dispatch, getState) => {
    const {friend, game} = getState();
    if (friend.viewing === shown || friend.parkedGame === undefined) return;

    dispatch(gamesSwapped({incoming: friend.parkedGame, outgoing: game, shown}));
  };
}
