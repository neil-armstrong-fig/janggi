import type {RootState} from "@src/redux/Store";

/**
 * Whether the tutorial may take the board now. Not while it already has it; not while the player holds a friend room,
 * even one only waiting for the friend, whose game would be dealt over the tutorial's when they came, nor while a friend
 * game parks the player's own; and not while a
 * game against the bot is rated, since a game dealt over it would count as walking away from it (`ratingEventFor`).
 */
export function canStartTheTutorial(state: RootState): boolean {
  if (state.tutorial.parked !== undefined) return false;
  if (state.friend.code !== undefined || state.friend.parkedGame !== undefined) return false;

  return state.ratings.inProgress === undefined;
}
