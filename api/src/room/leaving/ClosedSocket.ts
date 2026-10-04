import type {RoomState} from "@src/room/types/RoomState";
import type {RoomStep} from "@src/room/types/RoomStep";
import {otherSeat} from "@src/room/seats/OtherSeat";
import {replaceSeat} from "@src/room/seats/ReplaceSeat";
import {seatOf} from "@src/room/seats/SeatOf";

interface Closing {
  readonly room: RoomState;
  readonly accountId: string;
  /** Whether the account has another socket open — a reconnection that arrived before the old one was seen to close. */
  readonly stillConnected: boolean;
  readonly now: number;
}

/**
 * What a room does when one of a player's sockets closes. The player has left only if it was their last: a reconnection
 * opens the new socket before the old is seen to close, and that is no leaving.
 *
 * A player who has left is noted with when, so the alarm can tell whether the grace period has run out, and the other player is
 * told — unless the game is already over, when there is nothing to wait for. A second close of the same account does not move the
 * time back, and a socket that was never seated changes nothing.
 */
export function closedSocket({room, accountId, stillConnected, now}: Closing): RoomStep {
  if (stillConnected) return {state: room, deliveries: []};

  return leaving(room, accountId, now);
}

function leaving(state: RoomState, accountId: string, now: number): RoomStep {
  const seat = seatOf(state, accountId);
  if (seat === undefined || seat.goneSince !== undefined) return {state, deliveries: []};

  const next: RoomState = {
    ...state,
    seats: replaceSeat(state.seats, seat, {...seat, goneSince: now}),
  };
  const opponent = otherSeat(state, accountId);
  if (opponent === undefined || state.result !== undefined) return {state: next, deliveries: []};

  return {state: next, deliveries: [{to: opponent.accountId, message: {kind: "opponent-left"}}]};
}
