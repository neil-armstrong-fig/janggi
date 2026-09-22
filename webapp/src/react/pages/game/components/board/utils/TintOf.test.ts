import {expect, it} from "vitest";
import {tintOf} from "@src/react/pages/game/components/board/utils/TintOf";

it("mixes the colour with nothing at the strength given", () => {
  expect(tintOf("#ffffff", 70)).toBe("color-mix(in srgb, #ffffff 70%, transparent)");
});

it("leaves the colour to the browser, so anything CSS reads as a colour will do", () => {
  expect(tintOf("rgba(0, 0, 0, 0.5)", 25)).toBe("color-mix(in srgb, rgba(0, 0, 0, 0.5) 25%, transparent)");
});
