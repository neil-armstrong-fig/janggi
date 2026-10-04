import type {RoomState} from "@src/room/types/RoomState";
import type {Seat} from "@src/room/types/Seat";

/** The seat that is not this account's, if both are filled. */
export function otherSeat(state: RoomState, accountId: string): Seat | undefined {
  if (state.seats.length !== 2) return undefined;

  return state.seats.find(seat => seat.accountId !== accountId);
}
