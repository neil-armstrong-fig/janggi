import {ENGLISH} from "@src/language/english/English";
import {expect, it} from "vitest";
import {objectFromText} from "@src/react/pages/game/components/styles-sheet/components/style-editor/style-text/ObjectFromText";

const WORDS = ENGLISH.styles.refusals;

it("reads the one object the text is", () => {
  expect(objectFromText('{"surface": "#fff"}', WORDS)).toEqual({kind: "accepted", value: {surface: "#fff"}});
});

it("says so when the text is not JSON", () => {
  expect(objectFromText("{", WORDS)).toEqual({kind: "refused", reason: expect.stringContaining("not JSON")});
});

it("refuses JSON that is not one object", () => {
  for (const text of ["[]", "3", "null", '"a"']) {
    expect(objectFromText(text, WORDS)).toEqual({kind: "refused", reason: expect.stringContaining("one JSON object")});
  }
});
