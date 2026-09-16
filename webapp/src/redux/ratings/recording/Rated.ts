import type {GameRecord} from "@src/redux/ratings/types/GameRecord";
import type {RatedGameFinish} from "@src/redux/ratings/types/RatedGameFinish";
import type {RatingsSliceState} from "@src/redux/ratings/types/RatingsSliceState";
import {eloAfter} from "@src/redux/ratings/elo/EloAfter";

/**
 * The game in progress rated and written into the record, or the state untouched where there is none.
 *
 * Everything the record keeps about a game is here, and only the ending comes from the caller: the format,
 * the bot and the army were settled when the game was started and held since, so a game cannot be recorded
 * against a bot other than the one it was played against.
 *
 * **Rating a game and recording it are one step**, which is what keeps a rating and the games behind it
 * from disagreeing — `eloAfter` decides the move, and the record keeps where it moved from and to.
 */
export function rated(state: RatingsSliceState, finish: RatedGameFinish): RatingsSliceState {
  const game = state.inProgress;
  if (!game) return state;

  const rating = state.byFormat[game.format];
  const elo = eloAfter(rating.elo, rating.games.length, game.botElo, finish.result);

  const record: GameRecord = {
    format: game.format,
    botElo: game.botElo,
    playerSide: game.playerSide,
    result: finish.result,
    ending: finish.ending,
    eloBefore: rating.elo,
    eloAfter: elo,
    finishedAt: finish.finishedAt,
  };

  return {
    byFormat: {...state.byFormat, [game.format]: {elo, games: [...rating.games, record]}},
    inProgress: undefined,
  };
}
