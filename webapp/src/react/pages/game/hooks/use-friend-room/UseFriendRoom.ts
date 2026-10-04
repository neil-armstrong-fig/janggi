import {enterFriendRoom} from "@src/redux/online/actions/entering/EnterFriendRoom";
import {addressWithoutLink} from "@src/react/pages/game/hooks/use-friend-room/utils/AddressWithoutLink";
import {friendArrivalFor} from "@src/react/pages/game/hooks/use-friend-room/utils/FriendArrivalFor";
import {leaveFriendRoom} from "@src/redux/online/actions/LeaveFriendRoom";
import {shareLookWithFriendRoom} from "@src/redux/online/actions/playing/ShareLookWithFriendRoom";
import {sheetClosed, sheetOpened} from "@src/redux/settings/SettingsSlice";
import {useAppDispatch, useAppSelector} from "@src/redux/Hooks";
import {useEffect, useEffectEvent, useRef} from "react";
import {useIntroduction} from "@src/react/pages/game/hooks/use-introduction/UseIntroduction";

/**
 * Keeps a signed-in player in the room they are in: takes them into the room a `?join=` link names as the page opens,
 * puts them back in the one whose code the device kept, lets go of it if they sign out, tells the room when they change their
 * board or pieces, and closes the sheet as the game begins.
 *
 * **A player who is not signed in is left alone** — no call to the API, whatever the address says (`FriendSignIn` is what offers them the way in) — which is the opt-in the
 * whole account feature stands on. The link is taken off the address once it is read, so reloading is the stored code's job
 * and not the link's.
 */
export function useFriendRoom(): void {
  const status = useAppSelector(state => state.account.status);
  const friendState = useAppSelector(state => state.friend.state);
  const openSheet = useAppSelector(state => state.settings.openSheet);
  const introduction = useIntroduction();
  const dispatch = useAppDispatch();
  const keptCode = useAppSelector(state => state.friend.code);
  const arrivedRef = useRef(false);

  const comeIn = useEffectEvent(() => {
    const arrival = friendArrivalFor({status, search: globalThis.location.search, keptCode});
    if (arrival === undefined) {
      return;
    }

    if (arrival.kind === "link") {
      globalThis.history.replaceState(globalThis.history.state, "", addressWithoutLink(globalThis.location.href));
    }

    dispatch(enterFriendRoom({code: arrival.code, introduction, returning: arrival.kind === "kept"}));
  });

  useEffect(() => {
    if (arrivedRef.current || status !== "signed-in") return;

    arrivedRef.current = true;
    comeIn();
  }, [status]);

  const letGo = useEffectEvent(() => dispatch(leaveFriendRoom()));

  useEffect(() => {
    if (status === "signed-out" && keptCode !== undefined) letGo();
  }, [status, keptCode]);

  const {boardKey, piecesKey} = introduction;
  const shareLook = useEffectEvent(() => {
    dispatch(
      shareLookWithFriendRoom({...(boardKey !== undefined && {boardKey}), ...(piecesKey !== undefined && {piecesKey})}),
    );
  });

  // The look is passed on as it changes, so a friend's screen follows a board chosen half way through a game.
  useEffect(() => {
    if (keptCode !== undefined) shareLook();
  }, [boardKey, piecesKey, keptCode]);

  const closeSheet = useEffectEvent(() => dispatch(sheetClosed()));
  const openTheSheet = useEffectEvent(() => dispatch(sheetOpened("friend")));

  // A host who closed the sheet to play on while they waited is brought back to it once a friend sits down, and only then:
  // keyed on the state alone, so closing it again to look at the board is theirs to do.
  useEffect(() => {
    if (friendState === "choosing-setups") openTheSheet();
  }, [friendState]);

  useEffect(() => {
    if (friendState === "playing" && openSheet === "friend") closeSheet();
  }, [friendState, openSheet]);
}
