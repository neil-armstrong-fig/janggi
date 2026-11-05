import {expect, it} from "vitest";
import {toPieceKey} from "@janggi/shared/janggi/pieces/ToPieceKey";

it("joins a piece's side and type into one key", () => {
  expect(toPieceKey({side: "han", type: "general"})).toBe("han-general");
});

it("distinguishes the two armies' pieces of the same type", () => {
  expect(toPieceKey({side: "cho", type: "soldier"})).not.toBe(toPieceKey({side: "han", type: "soldier"}));
});
