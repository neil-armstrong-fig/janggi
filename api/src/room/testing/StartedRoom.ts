import type {ClientMessage} from "@janggi/shared/janggi/online/messages/ClientMessage";
import type {RoomState} from "@src/room/types/RoomState";
import {newRoom} from "@src/room/opening/NewRoom";
import {replaceSeat} from "@src/room/seats/ReplaceSeat";
import {reduceRoom} from "@src/room/answering/reducing/ReduceRoom";

export const HOST = "host-account";
export const GUEST = "guest-account";
export const NOW = 1_000_000;

/** What the room is in once `messages` have been sent, each as `[account, message]`, all at `NOW`. */
export function roomAfter(
  messages: readonly (readonly [string, ClientMessage])[],
  hostSide: "cho" | "han" = "cho",
): RoomState {
  return messages.reduce(
    (state, [accountId, message]) => reduceRoom(state, {accountId, message, now: NOW}).state,
    newRoom(hostSide, NOW, 3),
  );
}

const SEATED = [
  [HOST, {kind: "introduce", introduction: {displayName: "Host"}}],
  [GUEST, {kind: "introduce", introduction: {displayName: "Guest"}}],
] as const;

/** Both seated, neither has chosen. */
export function seatedRoom(): RoomState {
  return roomAfter(SEATED);
}

/** Both seated and both on the Inner Elephant: the game is on, with the host as `cho`, who moves first. */
export function startedRoom(): RoomState {
  return roomAfter([
    ...SEATED,
    [HOST, {kind: "choose-setup", setup: "Inner Elephant"}],
    [GUEST, {kind: "choose-setup", setup: "Inner Elephant"}],
  ]);
}

/** The room with a player's socket closed since `since`, as the room itself would note it. */
export function withAway(state: RoomState, accountId: string, since: number): RoomState {
  const seat = state.seats.find(each => each.accountId === accountId);
  if (seat === undefined) return state;

  return {...state, seats: replaceSeat(state.seats, seat, {...seat, goneSince: since})};
}
