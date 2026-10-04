import {expect, it} from "vitest";
import {noFriendGame} from "@src/redux/online/NoFriendGame";
import {withAFriend} from "@src/redux/online/selecting/WithAFriend";

it("is not with a friend before a room, or after leaving", () => {
  expect(withAFriend(noFriendGame())).toBe(false);
});

it("is not with a friend while a room is being reached", () => {
  expect(withAFriend(noFriendGame("ABCD2345"))).toBe(false);
});

it("is not with a friend while the room waits for one", () => {
  expect(withAFriend({...noFriendGame("ABCD2345"), state: "waiting-for-a-friend"})).toBe(false);
});

it("is with a friend once one is seated", () => {
  expect(withAFriend({...noFriendGame("ABCD2345"), state: "choosing-setups"})).toBe(true);
});

it("is still with a friend after the room is gone, until the player leaves a game that was over", () => {
  expect(withAFriend({...noFriendGame(), state: "over"})).toBe(true);
});
