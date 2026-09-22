import {expect, it} from "vitest";
import {WRITING_NAMES} from "@src/react/pages/game/components/styles-sheet/components/style-editor/components/piece-set-editor/components/piece-controls/components/glyph-controls/components/character-controls/writing/WritingName";
import {WRITINGS} from "@src/react/pages/game/components/styles-sheet/components/style-editor/components/piece-set-editor/components/piece-controls/components/glyph-controls/components/character-controls/writing/Writings";
import {writingOf} from "@src/react/pages/game/components/styles-sheet/components/style-editor/components/piece-set-editor/components/piece-controls/components/glyph-controls/components/character-controls/writing/WritingOf";

it("names each shipped writing", () => {
  for (const name of WRITING_NAMES) {
    expect(writingOf(WRITINGS[name])).toBe(name);
  }
});

it("names one read back from text, which is a copy", () => {
  expect(writingOf(JSON.parse(JSON.stringify(WRITINGS.Hangul)))).toBe("Hangul");
});

it("names none where the writing is somebody's own", () => {
  expect(writingOf({...WRITINGS.Hanja, general: "K"})).toBeUndefined();
});
