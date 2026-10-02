import {expect, it} from "vitest";
import {SaveBuilder} from "@src/redux/saves/SaveBuilder";
import {mergedProgress} from "@src/redux/account/merging/merged-progress/MergedProgress";

const empty = SaveBuilder.empty();

it("keeps the larger amount of XP, whichever side holds it", () => {
  const smaller = empty.withXp(640).build().progress;
  const larger = empty.withXp(900).build().progress;

  expect(mergedProgress(smaller, larger).xp).toBe(900);
  expect(mergedProgress(larger, smaller).xp).toBe(900);
});

it("keeps every strength beaten on either side, on the ladder it was beaten on", () => {
  const local = empty.beating("Casual", "cho", 800).build().progress;
  const remote = empty.beating("Casual", "cho", 800, 1200).beating("Casual", "han", 1000).build().progress;

  expect(mergedProgress(local, remote).beaten.Casual).toEqual({han: [1000], cho: [800, 1200]});
});

it("keeps the scored ladders apart from the casual ones", () => {
  const remote = empty.beating("Scored", "cho", 800).build().progress;

  expect(mergedProgress(empty.build().progress, remote).beaten).toEqual({
    Casual: {han: [], cho: []},
    Scored: {han: [], cho: [800]},
  });
});

it("lists a strength beaten on both sides once", () => {
  const both = empty.beating("Casual", "cho", 800).build().progress;

  expect(mergedProgress(both, both).beaten.Casual.cho).toEqual([800]);
});
