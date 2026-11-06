import {createAction} from "@reduxjs/toolkit";

/** The tutorial went on to its closing card, numbered `scene`, the board staying as the last scene left it. Dispatched by `closeTheTutorial`. */
export const tutorialClosed = createAction<number>("tutorial/closed");
