import type {Introduction} from "@janggi/shared/janggi/online/messages/Introduction";
import type {RoomState} from "@src/room/types/RoomState";
import type {RoomStep} from "@src/room/types/RoomStep";
import type {Seat} from "@src/room/types/Seat";
import type {ServerMessage} from "@janggi/shared/janggi/online/messages/ServerMessage";
import {opponentOf} from "@janggi/engine/utils/OpponentOf";
import {otherSeat} from "@src/room/seats/OtherSeat";
import {rejected} from "@src/room/answering/reducing/Rejected";
import {replaceSeat} from "@src/room/seats/ReplaceSeat";
import type {Side} from "@janggi/shared/janggi/pieces/Side";
import {seatOf} from "@src/room/seats/SeatOf";

/**
 * A player introduces themselves. The first account is the host; the second, if it is a different account, the guest
 * (who is told it has the army the host did not choose). An account that is already seated is coming back, and is
 * brought up to date instead. A third account, or the host's own account twice over, is turned away.
 */
export function sitDown(state: RoomState, accountId: string, introduction: Introduction): RoomStep {
  const seated = seatOf(state, accountId);
  if (seated !== undefined) return comeBack(state, seated);
  if (state.seats.length >= 2) return rejected(state, accountId, "out-of-order");

  const side = sideFor(state);
  const seat: Seat = {accountId, side, introduction};
  const next: RoomState = {...state, seats: [...state.seats, seat]};

  if (state.seats.length === 0) return {state: next, deliveries: [{to: accountId, message: {kind: "waiting"}}]};

  const host = state.seats[0] as Seat;

  return {
    state: next,
    deliveries: [
      {to: host.accountId, message: {kind: "matched", side: host.side, opponent: introduction}},
      {to: accountId, message: {kind: "matched", side, opponent: host.introduction}},
    ],
  };
}

/** A seated player's socket is open again: told where things stand, and the other told they are back. */
function comeBack(state: RoomState, seat: Seat): RoomStep {
  const {goneSince: _wasAway, ...present} = seat;
  const next: RoomState = {...state, seats: replaceSeat(state.seats, seat, present)};
  const opponent = otherSeat(next, seat.accountId);
  if (opponent === undefined) return {state: next, deliveries: [{to: seat.accountId, message: {kind: "waiting"}}]};

  const wasAway = seat.goneSince !== undefined && state.result === undefined;
  const toSeat = {to: seat.accountId, message: snapshotFor(state, seat, opponent)};
  if (!wasAway) return {state: next, deliveries: [toSeat]};

  return {state: next, deliveries: [toSeat, {to: opponent.accountId, message: {kind: "opponent-back"}}]};
}

/** What a player who was away needs to be where the game is: the arrangements once the game is dealt, and what was done. */
function snapshotFor(state: RoomState, seat: Seat, opponent: Seat): ServerMessage {
  const snapshot = {
    kind: "snapshot",
    side: seat.side,
    opponent: opponent.introduction,
    history: state.history,
  } as const;
  const hanSetup = state.seats.find(each => each.side === "han")?.setup;
  const choSetup = state.seats.find(each => each.side === "cho")?.setup;
  if (state.game === undefined || hanSetup === undefined || choSetup === undefined) return snapshot;

  return {...snapshot, hanSetup, choSetup};
}

/** The army a player sitting down gets: the host's own, and for the guest the other. */
function sideFor(state: RoomState): Side {
  if (state.seats.length === 0) return state.hostSide;

  return opponentOf(state.hostSide);
}
