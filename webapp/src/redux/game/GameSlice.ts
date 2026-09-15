import type {PayloadAction} from "@reduxjs/toolkit";
import {createSlice} from "@reduxjs/toolkit";
import type {BotElo} from "@janggi/shared/janggi/settings/BotElo";
import type {GameSliceState} from "@src/redux/game/types/GameSliceState";
import type {MatchFormat} from "@janggi/shared/janggi/settings/MatchFormat";
import type {Move} from "@src/game/types/Move";
import type {Opponent} from "@src/redux/game/types/Opponent";
import type {OpponentName} from "@janggi/shared/janggi/settings/OpponentName";
import type {SettledSideChoice} from "@src/redux/game/types/SettledSideChoice";
import type {Setup} from "@src/game/setups/types/Setup";
import type {Side} from "@janggi/shared/janggi/pieces/Side";
import type {SideChoiceName} from "@janggi/shared/janggi/settings/SideChoiceName";
import {dealtGame} from "@src/redux/game/dealing/DealtGame";
import {firstGame} from "@src/redux/game/first-game/FirstGame";
import {freshPhaseFor} from "@src/redux/game/dealing/FreshPhaseFor";
import {place} from "@src/game/setups/Place";
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
 * `botLetOpen` touches neither the board nor the record. It is the player saying a game against the
 * bot may start, which a bot holding cho's first move waits for; every deal takes it back.
 */
export const gameSlice = createSlice({
  name: "game",
  initialState: firstGame(),
  reducers: {
    moved: (state, action: PayloadAction<Move>): GameSliceState => ({
      ...state,
      played: playMove(state.played, action.payload),
    }),

    passed: (state): GameSliceState => ({...state, played: restTurn(state.played)}),

    bikjangCalled: (state): GameSliceState => ({...state, played: callBikjangIn(state.played)}),

    takenBack: (state): GameSliceState => ({...state, played: undo(state.played)}),

    playedAgain: (state): GameSliceState => ({...state, played: redo(state.played)}),

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
  },
});

export const {
  moved,
  passed,
  bikjangCalled,
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
} = gameSlice.actions;

export const gameReducer = gameSlice.reducer;

/** A fresh game in the same format, against the opponent as it now stands. */
function dealtAgainst(state: GameSliceState, opponent: Opponent): GameSliceState {
  return {...dealtGame(freshPhaseFor(state.phase.format)), opponent};
}

/**
 * The same game dealt again. A Random side takes the roll the action carries; a chosen side ignores
 * it. Only a roll that actually moves the player to the other army costs the arrangements.
 */
function restartedFrom(state: GameSliceState, roll: Side): GameSliceState {
  const playerSide = state.opponent.sideChoice === "Random" ? roll : state.opponent.playerSide;
  if (playerSide === state.opponent.playerSide) return {...dealtGame(state.phase), opponent: state.opponent};

  return dealtAgainst(state, {...state.opponent, playerSide});
}

function settledSide(choice: SideChoiceName): Side {
  switch (choice) {
    case "Cho":
      return "cho";
    case "Han":
      return "han";
    case "Random":
      return randomSide();
  }
}

function randomSide(): Side {
  return Math.random() < 0.5 ? "cho" : "han";
}
