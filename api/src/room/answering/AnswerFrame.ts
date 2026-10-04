import type {RoomState} from "@src/room/types/RoomState";
import type {RoomStep} from "@src/room/types/RoomStep";
import {parseClientMessage} from "@src/room/answering/parsing/ParseClientMessage";
import {reduceRoom} from "@src/room/answering/reducing/ReduceRoom";

interface Frame {
  readonly accountId: string;
  /** What arrived on the socket: text, or — which a player's client never sends — bytes. */
  readonly data: string | ArrayBuffer;
  readonly now: number;
}

/**
 * What a room does with a frame a player sent. Everything off the wire is read first (`parseClientMessage`) and what is not a
 * message changes nothing and is told so, as is anything the room will not have — one answer, here, for every frame.
 */
export function answerFrame(room: RoomState, {accountId, data, now}: Frame): RoomStep {
  if (typeof data === "string") {
    const message = parseClientMessage(data);
    if (message !== undefined) return reduceRoom(room, {accountId, message, now});
  }

  return {state: room, deliveries: [{to: accountId, message: {kind: "rejected", reason: "malformed"}}]};
}
