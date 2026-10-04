import type {GameSliceState} from "@src/redux/game/types/GameSliceState";
import {createAction} from "@reduxjs/toolkit";

/** The game the player had before a friend game, put back on the board as they leave the room. */
export const localGameRestored = createAction<GameSliceState>("friend/localGameRestored");
