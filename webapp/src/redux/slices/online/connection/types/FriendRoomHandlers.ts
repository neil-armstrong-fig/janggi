import type {ServerMessage} from "@janggi/shared/janggi/online/messages/ServerMessage";

/** What a connection tells whoever is listening. */
export interface FriendRoomHandlers {
  readonly onMessage: (message: ServerMessage) => void;
  /** The room has spoken, for the first time or after a drop. */
  readonly onConnected: () => void;
  /** The socket dropped and the connection is trying again. */
  readonly onReconnecting: () => void;
  /** The room would not have the player: a socket that closed before saying a word, on a first try. */
  readonly onRefused: () => void;
  /** A player returning to a room could not reach it, after trying for as long as it is worth. */
  readonly onGaveUp: () => void;
}
