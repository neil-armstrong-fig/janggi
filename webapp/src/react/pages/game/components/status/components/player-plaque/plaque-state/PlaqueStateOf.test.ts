import {expect, it} from "vitest";
import {plaqueStateOf} from "@src/react/pages/game/components/status/components/player-plaque/plaque-state/PlaqueStateOf";

it("lights the plaque of the army to move, and leaves the other waiting", () => {
  expect(plaqueStateOf({kind: "toMove", side: "cho"}, "cho")).toBe("toMove");
  expect(plaqueStateOf({kind: "toMove", side: "cho"}, "han")).toBe("waiting");
});

it("marks the army in check, and not the one giving it", () => {
  expect(plaqueStateOf({kind: "inCheck", side: "han"}, "han")).toBe("inCheck");
  expect(plaqueStateOf({kind: "inCheck", side: "han"}, "cho")).toBe("waiting");
});

it("marks the army the board is waiting on to lay out", () => {
  expect(plaqueStateOf({kind: "layingOut", side: "han"}, "han")).toBe("layingOut");
  expect(plaqueStateOf({kind: "layingOut", side: "han"}, "cho")).toBe("waiting");
});

it("names the winner and the loser of a checkmate", () => {
  expect(plaqueStateOf({kind: "won", by: "cho"}, "cho")).toBe("won");
  expect(plaqueStateOf({kind: "won", by: "cho"}, "han")).toBe("lost");
});

it("names the winner and the loser of a game settled on points, as it would a checkmate", () => {
  expect(plaqueStateOf({kind: "wonOnPoints", by: "han"}, "han")).toBe("won");
  expect(plaqueStateOf({kind: "wonOnPoints", by: "han"}, "cho")).toBe("lost");
});

it("reads a draw the same on both plaques", () => {
  expect(plaqueStateOf({kind: "drawn"}, "cho")).toBe("drawn");
  expect(plaqueStateOf({kind: "drawn"}, "han")).toBe("drawn");
});
