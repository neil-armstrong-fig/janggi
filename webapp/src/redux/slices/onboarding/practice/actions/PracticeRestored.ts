import {createAction} from "@reduxjs/toolkit";
import type {ParkedPlay} from "@src/redux/shared/parking/types/ParkedPlay";

export const practiceRestored = createAction<ParkedPlay>("tourPractice/restored");
