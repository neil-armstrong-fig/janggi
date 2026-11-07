import {createAction} from "@reduxjs/toolkit";

/** The tutorial was completed for the first time on this device, earning `xp`: the tutorial and progress slices answer it. Dispatched by `closeTheTutorial`. */
export const tutorialCompleted = createAction<number>("tutorial/completed");
