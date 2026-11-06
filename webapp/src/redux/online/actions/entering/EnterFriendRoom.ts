import type {AppThunk} from "@src/redux/AppThunk";
import type {FriendRoomVisit} from "@src/redux/online/connection/types/FriendRoomVisit";
import {
  friendConnected,
  friendConnecting,
  friendReconnecting,
  friendJoinRefused,
  friendRoomGone,
} from "@src/redux/online/FriendSlice";
import {friendGameOf} from "@src/redux/online/selecting/FriendGameOf";
import {friendStateOf} from "@src/redux/online/selecting/FriendStateOf";
import {friendRoom} from "@src/redux/online/FriendRoom";
import {leaveFriendRoom} from "@src/redux/online/actions/LeaveFriendRoom";
import {receiveFromFriendRoom} from "@src/redux/online/actions/playing/ReceiveFromFriendRoom";
import {friendRoomHeldBack} from "@src/redux/tutorial/actions/FriendRoomHeldBack";
import {inTheTutorial} from "@src/redux/tutorial/selecting/InTheTutorial";
import {toastShown} from "@src/redux/toast/ToastSlice";
import {messagesOf} from "@src/language/MessagesOf";

/**
 * Opens the connection to a room and has what the room says dispatched. The only path into one: making a code, typing
 * one, opening a link and coming back after a reload all end here.
 *
 * **Held back while the tutorial has the board**, with a toast saying so, and gone into as it is left
 * (`leaveTheTutorial`): the room's game would otherwise be dealt over the tutorial's, with the player's own still parked
 * under it.
 *
 * **Pre-emptive, so unit-tested only** (`EnterFriendRoom.test.ts`). When it was written (2026-11-06) no player could
 * reach it: a device that was signed in opens signed in and enters its room as the page mounts, before any tutorial;
 * signing in is a full redirect, so the tutorial is gone by the time it finishes; the Play tab is locked while the
 * tutorial is up; and the friend strip shows only for a room already held, in which the tutorial will not start
 * (`canStartTheTutorial`). It becomes reachable — and should get an acceptance spec in
 * `PlayingTheTutorial.test.ts` — if any of those changes: sign-in in a popup rather than a redirect, a way into a room
 * left open during the tutorial (matchmaking, a join box outside the Play tab), the tutorial kept across a reload, or
 * an installed app handing an invite link to the window already open rather than loading it afresh.
 */
export function enterFriendRoom(visit: FriendRoomVisit): AppThunk {
  return (dispatch, getState) => {
    if (inTheTutorial(getState())) {
      dispatch(friendRoomHeldBack(visit));
      dispatch(toastShown(messagesOf(getState().preferences.language).toasts.invitationHeldByTheTutorial));
      return;
    }

    dispatch(friendConnecting(visit.code));

    friendRoom.open(visit, {
      onMessage: message => dispatch(receiveFromFriendRoom(message)),
      onConnected: () => dispatch(friendConnected()),
      onReconnecting: () => dispatch(friendReconnecting()),
      onRefused: () => dispatch(friendJoinRefused()),
      onGaveUp: () => dispatch(roomGone()),
    });

    // The room is gone: a game that was over stays on screen to be read, until the player leaves it; any other is left now.
    function roomGone(): AppThunk {
      return () => {
        const {friend, game} = getState();
        const over = friendStateOf(friend, friendGameOf(friend, game).played.present) === "over";

        if (over) {
          dispatch(friendRoomGone());
        } else {
          dispatch(leaveFriendRoom());
        }
      };
    }
  };
}
