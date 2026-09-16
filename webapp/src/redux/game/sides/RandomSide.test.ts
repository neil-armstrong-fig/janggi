import {afterEach, expect, it, vi} from "vitest";
import {randomSide} from "@src/redux/game/sides/RandomSide";

afterEach(() => {
  vi.restoreAllMocks();
});

it("takes the lower half of the roll for cho and the upper for han", () => {
  vi.spyOn(Math, "random").mockReturnValue(0);
  expect(randomSide()).toBe("cho");

  vi.spyOn(Math, "random").mockReturnValue(0.499);
  expect(randomSide()).toBe("cho");

  vi.spyOn(Math, "random").mockReturnValue(0.5);
  expect(randomSide()).toBe("han");

  vi.spyOn(Math, "random").mockReturnValue(0.999);
  expect(randomSide()).toBe("han");
});

it("gives out both armies over many rolls", () => {
  const rolled = new Set(Array.from({length: 200}, () => randomSide()));

  expect([...rolled].sort()).toEqual(["cho", "han"]);
});
