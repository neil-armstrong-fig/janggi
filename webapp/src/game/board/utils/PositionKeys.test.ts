import {toPositionKey} from "@src/game/board/utils/PositionKeys";
import {expect, it} from "vitest";

it("names a position by its file and rank", () => {
  expect(toPositionKey({file: 5, rank: 2})).toBe("f5r2");
  expect(toPositionKey({file: 9, rank: 10})).toBe("f9r10");
});
