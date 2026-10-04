import {expect, it} from "vitest";
import {DEFAULT_SETUP} from "@janggi/engine/setups/Setups";
import {friendAllowsPlay} from "@src/redux/online/selecting/FriendAllowsPlay";
import {newGame} from "@janggi/engine/NewGame";
import {noFriendGame} from "@src/redux/online/NoFriendGame";

const cho = newGame(DEFAULT_SETUP, DEFAULT_SETUP, "Casual");
const han = {...cho, sideToMove: "han"} as const;

it("has nothing to say where there is no friend: play is allowed", () => {
  expect(friendAllowsPlay(noFriendGame(), cho)).toBe(true);
  expect(friendAllowsPlay(noFriendGame(), han)).toBe(true);
});

it("allows play on the player's own army's turn, in a game with a friend", () => {
  expect(friendAllowsPlay({...noFriendGame("ABCD2345"), state: "playing", ownSide: "cho"}, cho)).toBe(true);
});

it("does not allow play on the friend's turn, nor before the game is dealt, in a game with a friend", () => {
  expect(friendAllowsPlay({...noFriendGame("ABCD2345"), state: "playing", ownSide: "cho"}, han)).toBe(false);
  expect(friendAllowsPlay({...noFriendGame("ABCD2345"), state: "choosing-setups", ownSide: "cho"}, cho)).toBe(false);
});

it("allows play while a room is being reached, as there is no game with a friend yet", () => {
  expect(friendAllowsPlay(noFriendGame("ABCD2345"), cho)).toBe(true);
});
