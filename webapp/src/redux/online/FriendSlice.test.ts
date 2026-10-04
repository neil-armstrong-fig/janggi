import {
  friendConnecting,
  friendCreateFailed,
  friendJoinRefused,
  friendLeft,
  friendMatched,
  friendOpponentBack,
  friendOpponentLeft,
  friendReducer,
  friendResigned,
  friendRoomGone,
  friendSetupChosen,
  friendStarted,
  friendWaiting,
  localGameStashed,
} from "@src/redux/online/FriendSlice";
import {expect, it} from "vitest";
import type {FriendSliceState} from "@src/redux/online/types/FriendSliceState";
import {firstGame} from "@src/redux/game/first-game/FirstGame";
import {noFriendGame} from "@src/redux/online/NoFriendGame";

const FRIEND = {displayName: "Yi Sun-sin"};

function playing(): FriendSliceState {
  return [friendConnecting("ABCD2345"), friendMatched({side: "han", opponent: FRIEND}), friendStarted()].reduce(
    friendReducer,
    noFriendGame(),
  );
}

it("starts with no room", () => {
  expect(friendReducer(undefined, {type: "init"})).toEqual(noFriendGame());
});

it("keeps the code of a room being reached, and forgets whatever came before", () => {
  const refused = friendReducer(noFriendGame(), friendJoinRefused());
  const state = friendReducer(refused, friendConnecting("ABCD2345"));

  expect(state.code).toBe("ABCD2345");
  expect(state.joinRefused).toBe(false);
  expect(state.state).toBe("idle");
});

it("waits for a friend once the room says so", () => {
  expect(friendReducer(noFriendGame("ABCD2345"), friendWaiting()).state).toBe("waiting-for-a-friend");
});

it("is choosing arrangements once both are sat down, knowing its own army and who it is playing", () => {
  const state = friendReducer(noFriendGame("ABCD2345"), friendMatched({side: "cho", opponent: FRIEND}));

  expect(state).toMatchObject({state: "choosing-setups", ownSide: "cho", opponent: FRIEND});
});

it("notes the arrangement sent, until the game is dealt", () => {
  const chosen = friendReducer(
    friendReducer(noFriendGame("ABCD2345"), friendMatched({side: "cho", opponent: FRIEND})),
    friendSetupChosen("Left Elephant"),
  );

  expect(chosen.chosenSetup).toBe("Left Elephant");
  expect(friendReducer(chosen, friendStarted())).toMatchObject({state: "playing", chosenSetup: undefined});
});

it("is told the friend has left while playing, and back again", () => {
  const away = friendReducer(playing(), friendOpponentLeft());

  expect(away.state).toBe("opponent-left");
  expect(friendReducer(away, friendOpponentBack()).state).toBe("playing");
});

it("does not call a friend's leaving a game that has not begun, or a return that was never a leaving", () => {
  const choosing = friendReducer(noFriendGame("ABCD2345"), friendMatched({side: "cho", opponent: FRIEND}));

  expect(friendReducer(choosing, friendOpponentLeft()).state).toBe("choosing-setups");
  expect(friendReducer(playing(), friendOpponentBack()).state).toBe("playing");
});

it("is over once someone has resigned, and says who", () => {
  expect(friendReducer(playing(), friendResigned("cho"))).toMatchObject({state: "over", resignedBy: "cho"});
});

it("turns a code away, and goes back to having no room, keeping the game that is set aside", () => {
  const stashed = friendReducer(noFriendGame(), localGameStashed(firstGame()));
  const refused = friendReducer(friendReducer(stashed, friendConnecting("ABCD2345")), friendJoinRefused());

  expect(refused).toMatchObject({state: "idle", code: undefined, joinRefused: true});
  expect(refused.parkedGame).toBe(stashed.parkedGame);
});

it("says a code could not be made, in the sheet's own state", () => {
  expect(friendReducer(noFriendGame(), friendCreateFailed())).toMatchObject({state: "idle", createFailed: true});
});

it("sets aside only the first game it is handed, since a second deal is still the friend game", () => {
  const first = firstGame();
  const second = {...firstGame(), botMayOpen: true};
  const kept = friendReducer(friendReducer(noFriendGame(), localGameStashed(first)), localGameStashed(second));

  expect(kept.parkedGame).toBe(first);
});

it("has no room again once the player has left", () => {
  expect(friendReducer(playing(), friendLeft())).toEqual(noFriendGame());
});

it("forgets the code of a room that is gone, and keeps what the player was looking at", () => {
  const gone = friendReducer(friendReducer(playing(), friendResigned("cho")), friendRoomGone());

  expect(gone).toMatchObject({state: "over", code: undefined, ownSide: "han"});
});
