import {expect, it} from "vitest";
import {withInlay} from "@src/react/pages/game/components/styles-sheet/components/style-editor/components/piece-set-editor/components/piece-controls/components/body-controls/components/inlay-controls/inlay/WithInlay";

const BODY = {shape: "disc", fill: "#ffffff", stroke: "#000000", strokeWidth: 2} as const;
const INLAY = {inset: 0.1, stroke: "#333333", strokeWidth: 1};

it("draws an inlay inside the body", () => {
  expect(withInlay(BODY, INLAY)).toEqual({...BODY, inlay: INLAY});
});

it("takes it out again", () => {
  expect(withInlay({...BODY, inlay: INLAY}, undefined)).toEqual(BODY);
});
