import {withAFriend} from "@src/redux/online/selecting/WithAFriend";
import {useAppSelector} from "@src/redux/Hooks";

/**
 * Whether the player is in a room with a friend — from the moment there is a room to reach to the moment they leave. The game on the
 * board is then the friend's, and what deals a game of its own (the format, the opponent, the arrangements, a new game) is
 * locked: it would end the one the room holds.
 */
export function useWithAFriend(): boolean {
  return useAppSelector(state => withAFriend(state.friend));
}
