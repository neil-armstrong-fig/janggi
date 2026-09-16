import {expect, it} from "vitest";
import {untakenName} from "@src/redux/custom-styles/joining/untaken-name/UntakenName";

it("keeps a name nothing else answers to", () => {
  expect(untakenName("Midnight", [])).toBe("Midnight");
  expect(untakenName("Midnight", ["Classic", "Neon"])).toBe("Midnight");
});

it("puts a number after a name that is taken", () => {
  expect(untakenName("Midnight", ["Midnight"])).toBe("Midnight (2)");
});

it("counts up until it finds one free", () => {
  expect(untakenName("Midnight", ["Midnight", "Midnight (2)", "Midnight (3)"])).toBe("Midnight (4)");
});

it("steps over a gap rather than filling it", () => {
  expect(untakenName("Midnight", ["Midnight", "Midnight (3)"])).toBe("Midnight (2)");
});
