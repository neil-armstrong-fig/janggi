import type {FriendSliceState} from "@src/redux/online/types/FriendSliceState";

/** No room: the state of every player who has never played a friend, and of one who has left. */
export function noFriendGame(code?: string): FriendSliceState {
  return {
    state: "idle",
    code,
    connection: "connecting",
    ownSide: undefined,
    opponent: undefined,
    chosenSetup: undefined,
    joinRefused: false,
    createFailed: false,
    resignedBy: undefined,
    viewing: "friend",
    parkedGame: undefined,
  };
}
