import type {PayloadAction} from "@reduxjs/toolkit";
import {createSlice} from "@reduxjs/toolkit";
import type {BotElo} from "@janggi/shared/janggi/settings/BotElo";
import type {GameSliceState} from "@src/redux/game/types/GameSliceState";
import type {MatchFormat} from "@janggi/shared/janggi/settings/MatchFormat";
import type {Move} from "@src/game/types/Move";
import type {OpponentName} from "@janggi/shared/janggi/settings/OpponentName";
import type {SettledSideChoice} from "@src/redux/game/types/SettledSideChoice";
import type {Setup} from "@src/game/setups/types/Setup";
import type {Side} from "@janggi/shared/janggi/pieces/Side";
import type {SideChoiceName} from "@janggi/shared/janggi/settings/SideChoiceName";
import {acceptedADraw} from "@src/redux/game/drawing/AcceptedADraw";
import {declinedADraw} from "@src/redux/game/drawing/DeclinedADraw";
import {dealtGame} from "@src/redux/game/dealing/DealtGame";
import {offeredADraw} from "@src/redux/game/drawing/OfferedADraw";
import {firstGame} from "@src/redux/game/first-game/FirstGame";
import {freshPhaseFor} from "@src/redux/game/dealing/FreshPhaseFor";
import {place} from "@src/game/setups/Place";
import {callBikjangIn} from "@src/game/record/CallBikjangIn";
import {playMove} from "@src/game/record/PlayMove";
import {redo} from "@src/game/record/Redo";
import {restTurn} from "@src/game/record/RestTurn";
import {undo} from "@src/game/record/Undo";
import type {BeatenLadders} from "@src/redux/progress/types/ProgressSliceState";
import {dealtAgainst} from "@src/redux/game/dealing/DealtAgainst";
import {randomSide} from "@src/redux/game/sides/RandomSide";
import {restartedFrom} from "@src/redux/game/restarting/RestartedFrom";
import {saveLoaded} from "@src/redux/saves/SaveLoaded";
import {settledSide} from "@src/redux/game/sides/SettledSide";
import {withinReach} from "@src/redux/game/within-reach/WithinReach";

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
 * through one. It deals a fresh *phase* too, rather than carrying the arrangements across, because
 * the two formats do not begin the same way — a scored game is laid out by its players and a casual
 * one is simply dealt. `freshPhaseFor` is where that difference lives.
 *
 * `opponentChosen`, `botStrengthChosen` and `sideChosen` deal a fresh phase for the same reason as
 * the format: against the bot, which army each arrangement belongs to depends on who is playing it,
 * so a scored game laid out for one pairing is not carried over to another.
 *
 * `hanSetupChosen` and `choSetupChosen` go through the engine's `place`, which **throws** when the
 * army may not lay out now — Han reaching for a second arrangement in a scored game, or Cho
 * answering a board Han has not laid out yet. Nothing here catches it, for the same reason
 * `takenBack` does not check `canUndo`: the picker is disabled off `canPlace`, so a dispatch that
 * could throw is a bug at the control rather than a case to handle here.
 *
 * `restarted` re-deals from the phase as it stands, so a new game keeps both arrangements. In a
 * scored game that is the rule rather than a convenience — Han may not revise, and starting again is
 * not a way round it. Picking a format is. The one exception is a Random side that rolls the player
 * onto the other army, since the arrangements were each laid out by whoever held that army before.
 *
 * `takenBack` and `playedAgain` are two more of the same shape, and they are *not* gated on whether
 * the game is over the way `moved` and `passed` are: taking back the turn that ended a game is the
 * ordinary reason to reach for one. The controls are disabled off `canUndo`/`canRedo`, which is what
 * keeps a reducer from being dispatched into a record with nothing left to take back.
 *
 * `drawOffered`, `drawDeclined` and `drawAccepted` are a conversation held beside the record. Only an
 * accepted draw reaches it, as the agreement `agreeADrawIn` makes; an offer takes nobody's turn, and
 * anything that then happens in the game — a move, a rested turn, an undo — lets it lapse, which is why
 * each of those reducers puts `drawOffer` back to nothing.
 *
 * `botLetOpen` touches neither the board nor the record. It is the player saying a game against the
 * bot may start, which a bot holding cho's first move waits for; every deal takes it back.
 *
 * **What each of these actually does to a game lives beneath this file** — `dealing/`, `restarting/`,
 * `sides/` and `within-reach/` — so every rule is reachable, and tested, without going through a
 * dispatch. What is left here is the wiring: which action does which of them, and to what.
 */
export const gameSlice = createSlice({
  name: "game",
  initialState: firstGame(),
  reducers: {
    moved: (state, action: PayloadAction<Move>): GameSliceState => ({
      ...state,
      played: playMove(state.played, action.payload),
      drawOffer: undefined,
    }),

    passed: (state): GameSliceState => ({...state, played: restTurn(state.played), drawOffer: undefined}),

    bikjangCalled: (state): GameSliceState => ({...state, played: callBikjangIn(state.played), drawOffer: undefined}),

    takenBack: (state): GameSliceState => ({...state, played: undo(state.played), drawOffer: undefined}),

    playedAgain: (state): GameSliceState => ({...state, played: redo(state.played), drawOffer: undefined}),

    drawOffered: (state): GameSliceState => offeredADraw(state),

    drawDeclined: (state): GameSliceState => declinedADraw(state),

    drawAccepted: (state): GameSliceState => acceptedADraw(state),

    botLetOpen: (state): GameSliceState => ({...state, botMayOpen: true}),

    hanSetupChosen: (state, action: PayloadAction<Setup>): GameSliceState => ({
      ...dealtGame(place(state.phase, "han", action.payload)),
      opponent: state.opponent,
    }),

    choSetupChosen: (state, action: PayloadAction<Setup>): GameSliceState => ({
      ...dealtGame(place(state.phase, "cho", action.payload)),
      opponent: state.opponent,
    }),

    formatChosen: (state, action: PayloadAction<MatchFormat>): GameSliceState => ({
      ...dealtGame(freshPhaseFor(action.payload)),
      opponent: state.opponent,
    }),

    opponentChosen: (state, action: PayloadAction<OpponentName>): GameSliceState =>
      dealtAgainst(state, {...state.opponent, name: action.payload}),

    botStrengthChosen: (state, action: PayloadAction<BotElo>): GameSliceState =>
      dealtAgainst(state, {...state.opponent, botElo: action.payload}),

    sideChosen: {
      reducer: (state, action: PayloadAction<SettledSideChoice>): GameSliceState =>
        dealtAgainst(state, {...state.opponent, sideChoice: action.payload.choice, playerSide: action.payload.side}),
      prepare: (choice: SideChoiceName) => ({payload: {choice, side: settledSide(choice)}}),
    },

    restarted: {
      reducer: (state, action: PayloadAction<Side>): GameSliceState => restartedFrom(state, action.payload),
      prepare: () => ({payload: randomSide()}),
    },

    botKeptWithinReach: (state, action: PayloadAction<BeatenLadders>): GameSliceState =>
      withinReach(state, action.payload),
  },
  extraReducers: builder => {
    builder.addCase(saveLoaded, (state, action): GameSliceState => withinReach(state, action.payload.progress.beaten));
  },
});

export const {
  moved,
  passed,
  bikjangCalled,
  drawOffered,
  drawDeclined,
  drawAccepted,
  takenBack,
  playedAgain,
  botLetOpen,
  hanSetupChosen,
  choSetupChosen,
  formatChosen,
  opponentChosen,
  botStrengthChosen,
  sideChosen,
  restarted,
  botKeptWithinReach,
} = gameSlice.actions;

export const gameReducer = gameSlice.reducer;
