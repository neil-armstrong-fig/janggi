import {expect, it} from "vitest";
import {withInlayFill} from "@src/react/pages/game/components/styles-sheet/components/style-editor/components/piece-set-editor/components/piece-controls/components/body-controls/components/inlay-controls/inlay/WithInlayFill";

const INLAY = {inset: 0.1, stroke: "#333333", strokeWidth: 1};

it("fills the inlay", () => {
  expect(withInlayFill(INLAY, "#eeeeee")).toEqual({...INLAY, fill: "#eeeeee"});
});

it("lets the body's fill show through again", () => {
  expect(withInlayFill({...INLAY, fill: "#eeeeee"}, undefined)).toEqual(INLAY);
});
