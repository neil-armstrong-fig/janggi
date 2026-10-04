import type {Look} from "@janggi/shared/janggi/online/messages/Look";
import type {RoomState} from "@src/room/types/RoomState";
import type {RoomStep} from "@src/room/types/RoomStep";
import {otherSeat} from "@src/room/seats/OtherSeat";
import {rejected} from "@src/room/answering/reducing/Rejected";
import {replaceSeat} from "@src/room/seats/ReplaceSeat";
import {seatOf} from "@src/room/seats/SeatOf";

/**
 * A seated player changed their board or pieces. The room keeps the look on their seat — so a snapshot to someone who
 * was away carries it — and passes it to the other player, if there is one. The name they introduced themselves with
 * stays as it was.
 */
export function updateLook(state: RoomState, accountId: string, look: Look): RoomStep {
  const seat = seatOf(state, accountId);
  if (seat === undefined) return rejected(state, accountId, "out-of-order");

  const {boardKey: _board, piecesKey: _pieces, ...named} = seat.introduction;
  const next: RoomState = {
    ...state,
    seats: replaceSeat(state.seats, seat, {...seat, introduction: {...named, ...look}}),
  };
  const opponent = otherSeat(next, accountId);
  if (opponent === undefined) return {state: next, deliveries: []};

  return {state: next, deliveries: [{to: opponent.accountId, message: {kind: "opponent-look", look}}]};
}
