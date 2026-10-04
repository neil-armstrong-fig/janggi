import {expect, it} from "vitest";
import {DEFAULT_SETUP} from "@janggi/engine/setups/Setups";
import type {FriendSliceState} from "@src/redux/online/types/FriendSliceState";
import {mayActInFriendGame} from "@src/redux/online/selecting/MayActInFriendGame";
import {newGame} from "@janggi/engine/NewGame";
import {noFriendGame} from "@src/redux/online/NoFriendGame";

const cho = newGame(DEFAULT_SETUP, DEFAULT_SETUP, "Casual");
const han = {...cho, sideToMove: "han"} as const;

function friend(state: FriendSliceState["state"], ownSide: "cho" | "han"): FriendSliceState {
  return {...noFriendGame("ABCD2345"), state, ownSide};
}

it("may act on its own army's turn", () => {
  expect(mayActInFriendGame(friend("playing", "cho"), cho)).toBe(true);
});

it("may not act on the friend's turn", () => {
  expect(mayActInFriendGame(friend("playing", "cho"), han)).toBe(false);
  expect(mayActInFriendGame(friend("playing", "han"), cho)).toBe(false);
});

it("may act while the friend is away, since the room holds their place", () => {
  expect(mayActInFriendGame(friend("opponent-left", "cho"), cho)).toBe(true);
});

it.each(["idle", "waiting-for-a-friend", "choosing-setups", "over"] as const)("may not act while %s", state => {
  expect(mayActInFriendGame(friend(state, "cho"), cho)).toBe(false);
});

it("may not act once the board has decided the game", () => {
  expect(mayActInFriendGame(friend("playing", "cho"), {...cho, drawAgreed: true})).toBe(false);
});

it("may not act while its own link to the room is down, since nothing could be sent", () => {
  expect(mayActInFriendGame({...friend("playing", "cho"), connection: "reconnecting"}, cho)).toBe(false);
});
