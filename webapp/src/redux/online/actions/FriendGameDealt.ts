import type {DealtFriendGame} from "@src/redux/online/types/DealtFriendGame";
import {createAction} from "@reduxjs/toolkit";

/** The room dealt a game: dealt as a casual one between two people, with the player on the army the room gave them. */
export const friendGameDealt = createAction<DealtFriendGame>("friend/friendGameDealt");
