import type {AppThunk} from "@src/redux/AppThunk";
import type {RoomAction} from "@janggi/shared/janggi/online/messages/action/RoomAction";
import type {SeatedAction} from "@janggi/shared/janggi/online/messages/action/SeatedAction";
import type {ServerMessage} from "@janggi/shared/janggi/online/messages/ServerMessage";
import type {UnknownAction} from "@reduxjs/toolkit";
import type {SetupName} from "@janggi/shared/janggi/settings/SetupName";
import {SETUPS} from "@janggi/engine/setups/Setups";
import type {Setup} from "@janggi/engine/setups/types/Setup";
import {bikjangCalled, drawAccepted, drawOffered, moved, passed} from "@src/redux/game/GameSlice";
import {
  friendMatched,
  friendOpponentBack,
  friendOpponentLeft,
  friendOpponentLookChanged,
  friendResigned,
  friendStarted,
  friendWaiting,
  localGameStashed,
} from "@src/redux/online/FriendSlice";
import {intoTheFriendGame} from "@src/redux/online/actions/playing/IntoTheFriendGame";
import {friendGameDealt} from "@src/redux/online/actions/FriendGameDealt";
import {moveFromWire} from "@src/redux/online/wire/MoveFromWire";
import {opponentLookFrom} from "@src/redux/online/opponent-look/OpponentLookFrom";

/**
 * What the room said, done. The room's words become the game's own actions — a move is `moved`, a rest `passed` — so the
 * board, the sound and the motion are exactly what they are in any game. The room is the authority: anything it says that
 * the engine here will not play (a desync) is dropped, and the next reconnection's `snapshot` sets it right.
 *
 * A `rejected` is not acted on. The page never offers what the room refuses, so a rejection means this player's screen is a
 * step behind, and what the room says next catches it up.
 */
export function receiveFromFriendRoom(message: ServerMessage): AppThunk {
  return (dispatch, getState) => {
    switch (message.kind) {
      case "waiting":
        dispatch(friendWaiting());
        break;
      case "matched":
        dispatch(friendMatched({side: message.side, opponent: opponentLookFrom(message.opponent)}));
        break;
      case "started":
        dealFriendGame(message.hanSetup, message.choSetup);
        dispatch(friendStarted());
        break;
      case "acted":
        play({by: message.by, action: message.action});
        break;
      case "snapshot":
        dispatch(friendMatched({side: message.side, opponent: opponentLookFrom(message.opponent)}));
        if (message.hanSetup !== undefined && message.choSetup !== undefined) {
          dealFriendGame(message.hanSetup, message.choSetup, message.side);
          message.history.forEach(play);
          if (getState().friend.state !== "over") dispatch(friendStarted());
        }
        break;
      case "opponent-left":
        dispatch(friendOpponentLeft());
        break;
      case "opponent-back":
        dispatch(friendOpponentBack());
        break;
      case "opponent-look": {
        const opponent = getState().friend.opponent;
        if (opponent === undefined) break;

        dispatch(friendOpponentLookChanged(opponentLookFrom({displayName: opponent.displayName, ...message.look})));
        break;
      }
      case "rejected":
        break;
    }

    function dealFriendGame(hanName: SetupName, choName: SetupName, side = getState().friend.ownSide): void {
      const hanSetup = setupNamed(hanName);
      const choSetup = setupNamed(choName);
      if (hanSetup === undefined || choSetup === undefined || side === undefined) return;

      dispatch(localGameStashed(getState().game));
      dispatch(intoTheFriendGame(friendGameDealt({hanSetup, choSetup, ownSide: side})));
    }

    function play({by, action}: SeatedAction): void {
      if (action.kind === "resign") {
        dispatch(friendResigned(by));
        return;
      }

      try {
        dispatch(intoTheFriendGame(gameActionFor(action)));
      } catch {
        // The engine here would not play what the room did: out of step, and a reconnection will put it right.
      }
    }
  };
}

function setupNamed(name: SetupName): Setup | undefined {
  return SETUPS.find(setup => setup.name === name);
}

function gameActionFor(action: Exclude<RoomAction, {kind: "resign"}>): UnknownAction {
  switch (action.kind) {
    case "move": {
      const move = moveFromWire(action.move);
      if (move === undefined) throw new Error("A move off the board");

      return moved(move);
    }
    case "pass":
      return passed();
    case "call-bikjang":
      return bikjangCalled();
    case "offer-draw":
      return drawOffered();
    case "accept-draw":
      return drawAccepted();
  }
}
