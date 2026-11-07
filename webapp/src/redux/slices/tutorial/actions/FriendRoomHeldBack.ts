import type {FriendRoomVisit} from "@src/redux/slices/online/connection/types/FriendRoomVisit";
import {createAction} from "@reduxjs/toolkit";

/** A way into a friend room arrived while the tutorial had the board, and waits for it to be left. Dispatched by `enterFriendRoom`. */
export const friendRoomHeldBack = createAction<FriendRoomVisit>("tutorial/friendRoomHeldBack");
