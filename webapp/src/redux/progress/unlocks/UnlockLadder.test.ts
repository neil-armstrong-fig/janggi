import {expect, it} from "vitest";
import {unlockLadder} from "@src/redux/progress/unlocks/UnlockLadder";

it("lists nothing that is open from the first visit", () => {
  const labels = unlockLadder().flatMap(step => step.labels);

  expect(labels).not.toContain("Classic board");
  expect(labels).not.toContain("Traditional pieces");
});

it("climbs from the cheapest unlock to the dearest, one step per amount", () => {
  const amounts = unlockLadder().map(step => step.xp);

  expect(amounts).toEqual([...new Set(amounts)].sort((cheaper, dearer) => cheaper - dearer));
});

it("names a board and a piece set of one name at one price as a theme", () => {
  expect(unlockLadder()).toContainEqual({xp: 150, labels: ["Diagram theme"]});
});

it("names what opens on its own by what it is", () => {
  expect(unlockLadder().slice(0, 3)).toEqual([
    {xp: 30, labels: ["Hanja pieces"]},
    {xp: 60, labels: ["Neon board"]},
    {xp: 150, labels: ["Diagram theme"]},
  ]);
  expect(unlockLadder()).toContainEqual({xp: 300, labels: ["Creating your own styles"]});
});

it("ends at the Hacker theme, far past everything else", () => {
  expect(unlockLadder().at(-1)).toEqual({xp: 1_000_000, labels: ["Hacker theme"]});
});
