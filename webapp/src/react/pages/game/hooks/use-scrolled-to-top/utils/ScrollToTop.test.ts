// @vitest-environment jsdom
import "@src/testing/SetupDomTest";
import {expect, it} from "vitest";
import {scrollToTop} from "@src/react/pages/game/hooks/use-scrolled-to-top/utils/ScrollToTop";

it("puts back to the top a column inside the sheet that was scrolled down, and leaves the rest alone", () => {
  const sheet = document.createElement("section");
  const column = document.createElement("div");
  const other = document.createElement("div");
  sheet.append(column, other);
  column.scrollTop = 120;

  scrollToTop(sheet);

  expect(column.scrollTop).toBe(0);
  expect(other.scrollTop).toBe(0);
});
