import type {ServerMessage} from "@janggi/shared/janggi/online/messages/ServerMessage";

/** A message for one player, addressed by their account, since a player who has not yet sat down has no army. */
export interface Delivery {
  readonly to: string;
  readonly message: ServerMessage;
}
