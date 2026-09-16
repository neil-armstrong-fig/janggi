import {afterEach, expect, it, vi} from "vitest";
import {settledSide} from "@src/redux/game/sides/SettledSide";

afterEach(() => {
  vi.restoreAllMocks();
});

it("takes a chosen army as it was chosen", () => {
  expect(settledSide("Cho")).toBe("cho");
  expect(settledSide("Han")).toBe("han");
});

it("rolls for an army where the player asked not to choose", () => {
  vi.spyOn(Math, "random").mockReturnValue(0.9);

  expect(settledSide("Random")).toBe("han");
});
