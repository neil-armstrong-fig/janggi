import type {PayloadAction} from "@reduxjs/toolkit";
import {createSlice} from "@reduxjs/toolkit";
import {DEFAULT_MATCH_FORMAT} from "@janggi/shared/janggi/settings/MatchFormat";
import {DEFAULT_SETUP} from "@src/game/setups/Setups";
import type {GameSliceState} from "@src/redux/game/types/GameSliceState";
import type {MatchFormat} from "@janggi/shared/janggi/settings/MatchFormat";
import type {Move} from "@src/game/types/Move";
import type {Setup} from "@src/game/setups/types/Setup";
import {dealtGame} from "@src/redux/game/utils/DealtGame";
import {callBikjangIn} from "@src/game/record/CallBikjangIn";
import {playMove} from "@src/game/record/PlayMove";
import {redo} from "@src/game/record/Redo";
import {restTurn} from "@src/game/record/RestTurn";
import {undo} from "@src/game/record/Undo";

/**
 * Every reducer returns a new state rather than mutating the draft Immer hands it. The engine
 * already works that way — `playMove` takes a record and returns one — so letting it do the work
 * and replacing the slice wholesale keeps the rules in one place and avoids threading a
 * `WritableDraft` through anything.
 *
 * `passed` and `bikjangCalled` are their own actions rather than a `moved` with nothing in it,
 * because neither is a move — the engine keeps all three apart for the same reason. Each leaves a
 * position behind in the record, which is what makes any of them undoable.
 *
 * `formatChosen` deals a fresh game exactly as the two setup actions do, and for the same reason:
 * which of janggi's two games is being played is settled before it starts, not switched half way
 * through one.
 *
 * `takenBack` and `playedAgain` are two more of the same shape, and they are *not* gated on whether
 * the game is over the way `moved` and `passed` are: taking back the turn that ended a game is the
 * ordinary reason to reach for one. The controls are disabled off `canUndo`/`canRedo`, which is what
 * keeps a reducer from being dispatched into a record with nothing left to take back.
 */
export const gameSlice = createSlice({
  name: "game",
  initialState: dealtGame(DEFAULT_SETUP, DEFAULT_SETUP, DEFAULT_MATCH_FORMAT),
  reducers: {
    moved: (state, action: PayloadAction<Move>): GameSliceState => ({
      ...state,
      played: playMove(state.played, action.payload),
    }),

    passed: (state): GameSliceState => ({...state, played: restTurn(state.played)}),

    bikjangCalled: (state): GameSliceState => ({...state, played: callBikjangIn(state.played)}),

    takenBack: (state): GameSliceState => ({...state, played: undo(state.played)}),

    playedAgain: (state): GameSliceState => ({...state, played: redo(state.played)}),

    hanSetupChosen: (state, action: PayloadAction<Setup>): GameSliceState =>
      dealtGame(action.payload, state.choSetup, state.format),

    choSetupChosen: (state, action: PayloadAction<Setup>): GameSliceState =>
      dealtGame(state.hanSetup, action.payload, state.format),

    formatChosen: (state, action: PayloadAction<MatchFormat>): GameSliceState =>
      dealtGame(state.hanSetup, state.choSetup, action.payload),

    restarted: (state): GameSliceState => dealtGame(state.hanSetup, state.choSetup, state.format),
  },
});

export const {
  moved,
  passed,
  bikjangCalled,
  takenBack,
  playedAgain,
  hanSetupChosen,
  choSetupChosen,
  formatChosen,
  restarted,
} = gameSlice.actions;

export const gameReducer = gameSlice.reducer;
