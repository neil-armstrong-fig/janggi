import type {ParkedPlay} from "@src/redux/tutorial/types/ParkedPlay";
import {createAction} from "@reduxjs/toolkit";

/** The tutorial was left, and the player's own game and clock put back as they were parked. Dispatched by `leaveTheTutorial`. */
export const tutorialLeft = createAction<ParkedPlay>("tutorial/left");
