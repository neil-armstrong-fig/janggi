import {expect, it} from "vitest";
import {opponentOf} from "@src/game/utils/OpponentOf";

it("names the army on the other side of the board", () => {
  expect(opponentOf("han")).toBe("cho");
  expect(opponentOf("cho")).toBe("han");
});

it("comes back to where it started when applied twice", () => {
  expect(opponentOf(opponentOf("cho"))).toBe("cho");
});
