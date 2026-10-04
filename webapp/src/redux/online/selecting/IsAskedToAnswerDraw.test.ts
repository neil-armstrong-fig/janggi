import {expect, it} from "vitest";
import {isAskedToAnswerDraw} from "@src/redux/online/selecting/IsAskedToAnswerDraw";
import {noFriendGame} from "@src/redux/online/NoFriendGame";

it("is asked wherever the one device is both players", () => {
  expect(isAskedToAnswerDraw(noFriendGame(), "cho")).toBe(true);
  expect(isAskedToAnswerDraw(noFriendGame(), "han")).toBe(true);
});

it("is asked, with a friend, only if the offer came from the other army", () => {
  const mine = {...noFriendGame("ABCD2345"), state: "playing", ownSide: "cho"} as const;

  expect(isAskedToAnswerDraw(mine, "han")).toBe(true);
  expect(isAskedToAnswerDraw(mine, "cho")).toBe(false);
});
