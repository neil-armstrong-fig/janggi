import type {ClientMessage} from "@janggi/shared/janggi/online/messages/ClientMessage";

/** A player's message reached the room at `now` (milliseconds). */
export interface RoomEvent {
  readonly accountId: string;
  readonly message: ClientMessage;
  readonly now: number;
}
