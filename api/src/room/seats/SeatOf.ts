import type {RoomState} from "@src/room/types/RoomState";
import type {Seat} from "@src/room/types/Seat";

export function seatOf(state: RoomState, accountId: string): Seat | undefined {
  return state.seats.find(seat => seat.accountId === accountId);
}
