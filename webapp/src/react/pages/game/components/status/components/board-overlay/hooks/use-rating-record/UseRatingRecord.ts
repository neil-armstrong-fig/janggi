import {useAppSelector} from "@src/redux/Hooks";
import type {GameRecord} from "@src/redux/slices/ratings/types/GameRecord";

/** The completed rating entry that belongs to the bot game currently on the board, if it has one. */
export function useRatingRecord(): GameRecord | undefined {
  return useAppSelector(state => {
    const {opponent, phase, ratedAt} = state.game;
    if (opponent.name !== "Bot" || ratedAt === undefined) return undefined;

    return state.ratings.byFormat[phase.format].games.find(
      game => game.finishedAt === ratedAt && game.botElo === opponent.botElo && game.playerSide === opponent.playerSide,
    );
  });
}
