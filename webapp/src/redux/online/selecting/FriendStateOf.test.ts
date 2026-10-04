import {expect, it} from "vitest";
import type {FriendSliceState} from "@src/redux/online/types/FriendSliceState";
import {friendStateOf} from "@src/redux/online/selecting/FriendStateOf";
import {newGame} from "@janggi/engine/NewGame";
import {noFriendGame} from "@src/redux/online/NoFriendGame";
import {DEFAULT_SETUP} from "@janggi/engine/setups/Setups";

const live = newGame(DEFAULT_SETUP, DEFAULT_SETUP, "Casual");
const agreed = {...live, drawAgreed: true};

function friend(state: FriendSliceState["state"]): FriendSliceState {
  return {...noFriendGame("ABCD2345"), state};
}

it.each(["idle", "waiting-for-a-friend", "choosing-setups", "over"] as const)("says %s as the room did", state => {
  expect(friendStateOf(friend(state), live)).toBe(state);
});

it("says a game being played is playing, and one whose friend is away is opponent-left", () => {
  expect(friendStateOf(friend("playing"), live)).toBe("playing");
  expect(friendStateOf(friend("opponent-left"), live)).toBe("opponent-left");
});

it("calls a game the board has decided over, though the room has said nothing", () => {
  expect(friendStateOf(friend("playing"), agreed)).toBe("over");
  expect(friendStateOf(friend("opponent-left"), agreed)).toBe("over");
});

it("does not read the board before a game is dealt", () => {
  expect(friendStateOf(friend("choosing-setups"), agreed)).toBe("choosing-setups");
});
