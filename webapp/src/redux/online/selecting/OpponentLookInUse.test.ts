import {expect, it} from "vitest";
import type {FriendSliceState} from "@src/redux/online/types/FriendSliceState";
import {noFriendGame} from "@src/redux/online/NoFriendGame";
import {opponentLookInUse} from "@src/redux/online/selecting/OpponentLookInUse";

const LOOK = {displayName: "Yi"};

function playing(overrides: Partial<FriendSliceState> = {}): FriendSliceState {
  return {...noFriendGame("ABCD2345"), state: "playing", ownSide: "han", opponent: LOOK, ...overrides};
}

it("is the friend's look and the player's own army, in a game with a friend", () => {
  expect(opponentLookInUse(playing(), true)).toEqual({ownSide: "han", look: LOOK});
});

it("is nothing where the player has turned showing the friend's look off", () => {
  expect(opponentLookInUse(playing(), false)).toBeUndefined();
});

it("is nothing before the game with a friend is on, and after there is none", () => {
  expect(opponentLookInUse(playing({state: "choosing-setups"}), true)).toBeUndefined();
  expect(opponentLookInUse(noFriendGame(), true)).toBeUndefined();
});

it("is nothing where the room has said nothing of who the friend is, or which army is whose", () => {
  expect(opponentLookInUse(playing({opponent: undefined}), true)).toBeUndefined();
  expect(opponentLookInUse(playing({ownSide: undefined}), true)).toBeUndefined();
});
