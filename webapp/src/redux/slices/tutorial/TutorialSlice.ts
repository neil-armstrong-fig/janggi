import type {TutorialSliceState} from "@src/redux/slices/tutorial/types/TutorialSliceState";
import {NOT_STARTED} from "@src/redux/slices/tutorial/progress/NotStarted";
import {createSlice} from "@reduxjs/toolkit";
import {tutorialLeft} from "@src/redux/slices/tutorial/actions/TutorialLeft";
import {tutorialStarted} from "@src/redux/slices/tutorial/actions/TutorialStarted";
import {tutorialSceneStarted} from "@src/redux/slices/tutorial/actions/TutorialSceneStarted";
import {tutorialClosed} from "@src/redux/slices/tutorial/actions/TutorialClosed";
import {tutorialCompleted} from "@src/redux/slices/tutorial/actions/TutorialCompleted";
import {friendRoomHeldBack} from "@src/redux/slices/tutorial/actions/FriendRoomHeldBack";
import {saveLoaded} from "@src/redux/shared/saves/actions/SaveLoaded";
import {syncMerged} from "@src/redux/slices/account/actions/SyncMerged";
import {withinReach} from "@src/redux/slices/game/within-reach/WithinReach";
import {withSceneReached} from "@src/redux/slices/tutorial/progress/WithSceneReached";
import {noTutorial} from "@src/redux/slices/tutorial/no-tutorial/NoTutorial";
import type {ProgressSliceState} from "@src/redux/slices/progress/types/ProgressSliceState";

/**
 * The guided tutorial: what it parked to take the board, the scene on it, and how far the player
 * has come. Which step it is on is read off the game's record (`tutorialStepAt`), so nothing has to be kept in step with
 * it.
 *
 * A save loaded or a sync merged meanwhile keeps the parked game within reach of the strengths it opens, as `GameSlice`
 * does the game on the board: that one is the tutorial's, and the player's own would come back out of reach.
 */
export const tutorialSlice = createSlice({
  name: "tutorial",
  initialState: noTutorial(NOT_STARTED),
  reducers: {},
  extraReducers: builder => {
    builder.addCase(tutorialStarted, (state, action): TutorialSliceState => ({
      parked: action.payload.parked,
      scene: action.payload.scene,
      progress: withSceneReached(state.progress, action.payload.scene),
      heldVisit: undefined,
    }));
    builder.addCase(tutorialSceneStarted, (state, action): TutorialSliceState => ({
      ...state,
      scene: action.payload.scene,
      progress: withSceneReached(state.progress, action.payload.scene),
    }));
    builder.addCase(tutorialClosed, (state, action): TutorialSliceState => ({...state, scene: action.payload}));
    builder.addCase(tutorialCompleted, (state): TutorialSliceState => ({
      ...state,
      progress: {reached: 0, completed: true},
    }));
    builder.addCase(friendRoomHeldBack, (state, action): TutorialSliceState => ({...state, heldVisit: action.payload}));
    builder.addCase(tutorialLeft, (state): TutorialSliceState => noTutorial(state.progress));
    builder.addCase(saveLoaded, (state, action): TutorialSliceState =>
      parkedWithinReach(state, action.payload.progress),
    );
    builder.addCase(syncMerged, (state, action): TutorialSliceState =>
      parkedWithinReach(state, action.payload.progress),
    );
  },
});

export const tutorialReducer = tutorialSlice.reducer;

function parkedWithinReach(state: TutorialSliceState, {beaten}: ProgressSliceState): TutorialSliceState {
  const {parked} = state;
  if (parked === undefined) return state;

  return {...state, parked: {...parked, game: withinReach(parked.game, beaten)}};
}
