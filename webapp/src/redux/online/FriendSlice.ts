import type {FriendSliceState} from "@src/redux/online/types/FriendSliceState";
import type {GameSliceState} from "@src/redux/game/types/GameSliceState";
import type {OpponentLook} from "@src/redux/online/types/OpponentLook";
import type {PayloadAction} from "@reduxjs/toolkit";
import type {UnknownAction} from "@reduxjs/toolkit";
import type {SetupName} from "@janggi/shared/janggi/settings/SetupName";
import type {Side} from "@janggi/shared/janggi/pieces/Side";
import {createSlice} from "@reduxjs/toolkit";
import {gameReducer} from "@src/redux/game/GameSlice";
import {gamesSwapped} from "@src/redux/online/actions/GamesSwapped";
import {noFriendGame} from "@src/redux/online/NoFriendGame";

/** A room's side of what the player sees, and what the game on the board is held against. The rules are the engine's and the room's. */
interface Matched {
  readonly side: Side;
  readonly opponent: OpponentLook;
}

/**
 * What a room has told this player, as state. It holds no rules: the room judges, and the game itself is the game slice's,
 * dealt and played by the same actions as any other (`actions/ReceiveFromFriendRoom.ts` is what turns a message from the room into
 * them). Each reducer here is one thing the room can say, or one thing the player does to leave.
 */
export const friendSlice = createSlice({
  name: "friend",
  initialState: noFriendGame(),
  reducers: {
    /** A room is being reached: its code is kept, and whatever came before it is forgotten — except the player's own game, which waits. */
    friendConnecting: (state, action: PayloadAction<string>): FriendSliceState => ({
      ...noFriendGame(action.payload),
      parkedGame: state.parkedGame,
    }),

    /** The room has spoken: the link is up. */
    friendConnected: (state): FriendSliceState => ({...state, connection: "connected"}),

    /** The link dropped; the connection is trying again. */
    friendReconnecting: (state): FriendSliceState => ({...state, connection: "reconnecting"}),

    friendWaiting: (state): FriendSliceState => ({...state, state: "waiting-for-a-friend"}),

    friendMatched: (state, action: PayloadAction<Matched>): FriendSliceState => ({
      ...state,
      state: "choosing-setups",
      ownSide: action.payload.side,
      opponent: action.payload.opponent,
      chosenSetup: undefined,
    }),

    /** The friend changed their board or pieces: the look they wear now, the name they gave staying as it was. */
    friendOpponentLookChanged: (state, action: PayloadAction<OpponentLook>): FriendSliceState => {
      if (state.opponent === undefined) return state;

      return {...state, opponent: {...action.payload, displayName: state.opponent.displayName}};
    },

    friendSetupChosen: (state, action: PayloadAction<SetupName>): FriendSliceState => ({
      ...state,
      chosenSetup: action.payload,
    }),

    friendStarted: (state): FriendSliceState => ({...state, state: "playing", chosenSetup: undefined}),

    friendOpponentLeft: (state): FriendSliceState => {
      if (state.state !== "playing") return state;

      return {...state, state: "opponent-left"};
    },

    friendOpponentBack: (state): FriendSliceState => {
      if (state.state !== "opponent-left") return state;

      return {...state, state: "playing"};
    },

    friendResigned: (state, action: PayloadAction<Side>): FriendSliceState => ({
      ...state,
      state: "over",
      resignedBy: action.payload,
    }),

    friendJoinRefused: (state): FriendSliceState => ({
      ...noFriendGame(),
      joinRefused: true,
      parkedGame: state.parkedGame,
    }),

    friendCreateFailed: (state): FriendSliceState => ({
      ...noFriendGame(),
      createFailed: true,
      parkedGame: state.parkedGame,
    }),

    /** The game the player had, set aside as the friend game takes its place. Only the first is kept: a second deal is still the friend game. */
    localGameStashed: (state, action: PayloadAction<GameSliceState>): FriendSliceState => {
      if (state.parkedGame !== undefined) return state;

      return {...state, parkedGame: action.payload};
    },

    /** The room is gone, but what the player was looking at is not: the code is forgotten, so a reload does not look for it. */
    friendRoomGone: (state): FriendSliceState => ({...state, code: undefined}),

    /** Something happened in the friend game while the player's own is on the board: it is played where it waits. */
    parkedGameAnswered: (state, action: PayloadAction<UnknownAction>): FriendSliceState => {
      if (state.parkedGame === undefined) return state;

      return {...state, parkedGame: gameReducer(state.parkedGame, action.payload)};
    },

    friendLeft: (): FriendSliceState => noFriendGame(),
  },
  extraReducers: builder => {
    builder.addCase(gamesSwapped, (state, action): FriendSliceState => ({
      ...state,
      viewing: action.payload.shown,
      parkedGame: action.payload.outgoing,
    }));
  },
});

export const {
  friendConnecting,
  friendConnected,
  friendReconnecting,
  friendWaiting,
  friendMatched,
  friendSetupChosen,
  friendOpponentLookChanged,
  friendStarted,
  friendOpponentLeft,
  friendOpponentBack,
  friendResigned,
  friendJoinRefused,
  friendCreateFailed,
  localGameStashed,
  friendRoomGone,
  parkedGameAnswered,
  friendLeft,
} = friendSlice.actions;

export const friendReducer = friendSlice.reducer;
