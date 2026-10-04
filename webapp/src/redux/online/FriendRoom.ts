import {FriendConnection} from "@src/redux/online/connection/FriendConnection";

/** The player's one connection to a room, for the whole page: the thunks open, send through and close it. */
export const friendRoom = new FriendConnection();
