import type {RoomEvent} from "@src/room/answering/reducing/types/RoomEvent";
import type {RoomState} from "@src/room/types/RoomState";
import type {RoomStep} from "@src/room/types/RoomStep";
import {act} from "@src/room/answering/reducing/acting/Act";
import {chooseSetup} from "@src/room/answering/reducing/seating/ChooseSetup";
import {sitDown} from "@src/room/answering/reducing/seating/SitDown";
import {updateLook} from "@src/room/answering/reducing/seating/UpdateLook";

/**
 * What a player's message does to a room: the room it becomes and what it tells whom. Pure — the Durable Object reads
 * the state from storage, calls this, stores the state and sends the deliveries, so everything the room decides is
 * decided here, where a test can reach it. See `docs/online-play.md`.
 */
export function reduceRoom(state: RoomState, {accountId, message, now}: RoomEvent): RoomStep {
  switch (message.kind) {
    case "introduce":
      return sitDown(state, accountId, message.introduction);
    case "choose-setup":
      return chooseSetup(state, accountId, message.setup);
    case "act":
      return act(state, accountId, message.action, now);
    case "update-look":
      return updateLook(state, accountId, message.look);
  }
}
