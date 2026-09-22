import {classicStyle} from "@src/react/pages/game/components/board/cell-styles/builtin/ClassicStyle";
import {expect, it} from "vitest";
import {writtenOut} from "@src/react/pages/game/components/styles-sheet/components/style-editor/hooks/use-style-draft/written-out/WrittenOut";

it("writes a style out as indented JSON", () => {
  expect(writtenOut(classicStyle)).toContain('\n  "surface": "#e7c88f"');
});

it("leaves the name out, which has a box of its own", () => {
  expect(JSON.parse(writtenOut(classicStyle))).not.toHaveProperty("name");
});
