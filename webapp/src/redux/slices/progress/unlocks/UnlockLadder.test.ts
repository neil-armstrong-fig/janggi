import {expect, it} from "vitest";
import {unlockLadder} from "@src/redux/slices/progress/unlocks/UnlockLadder";

it("lists nothing that is open from the first visit", () => {
  const items = unlockLadder().flatMap(step => step.items);

  expect(items).not.toContainEqual({kind: "board", name: "Classic"});
  expect(items).not.toContainEqual({kind: "pieces", name: "Traditional"});
});

it("climbs from the cheapest unlock to the dearest, one step per amount", () => {
  const amounts = unlockLadder().map(step => step.xp);

  expect(amounts).toEqual([...new Set(amounts)].sort((cheaper, dearer) => cheaper - dearer));
});

it("names a board and a piece set of one name at one price as a theme", () => {
  expect(unlockLadder()).toContainEqual({xp: 150, items: [{kind: "theme", name: "Diagram"}]});
});

it("names what opens on its own by what it is", () => {
  expect(unlockLadder().slice(0, 3)).toEqual([
    {xp: 30, items: [{kind: "pieces", name: "Hanja"}]},
    {xp: 60, items: [{kind: "board", name: "Neon"}]},
    {xp: 150, items: [{kind: "theme", name: "Diagram"}]},
  ]);
  expect(unlockLadder()).toContainEqual({xp: 300, items: [{kind: "style-editor"}]});
});

it("ends at the Hacker theme, far past everything else", () => {
  expect(unlockLadder().at(-1)).toEqual({xp: 1_000_000, items: [{kind: "theme", name: "Hacker"}]});
});
