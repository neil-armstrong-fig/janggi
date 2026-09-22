import {DEFAULT_BOARD_MARKS} from "@src/styles/defaults/DefaultBoardMarks";
import type {BoardStyle} from "@src/styles/types/BoardStyle";
import {SaveBuilder} from "@src/redux/saves/SaveBuilder";
import {decodeKey} from "@janggi/shared/janggi/share-keys/DecodeKey";
import {expect, it} from "vitest";
import {freshProgress} from "@src/redux/progress/fresh-progress/FreshProgress";
import {noCustomStyles} from "@src/redux/custom-styles/no-custom-styles/NoCustomStyles";
import {saveFrom} from "@src/redux/saves/SaveFrom";

const mine: BoardStyle = {
  name: "Mine",
  ...DEFAULT_BOARD_MARKS,
  surface: "#ffffff",
  defaultCell: {stroke: "#000000", strokeWidth: 1},
  lastMove: {wash: "rgba(0, 0, 0, 0.2)", brackets: "#000000"},
};

it("starts from a player who has nothing", () => {
  expect(SaveBuilder.empty().build()).toEqual({progress: freshProgress(), customStyles: noCustomStyles()});
});

it("writes a save key", () => {
  expect(SaveBuilder.empty().key()).toMatch(/^janggi-save:[A-Za-z0-9_-]+$/);
});

/**
 * The letter of it, because a player is invited to decode a key and edit what they find. A field renamed
 * on the state a save is built from must fail here rather than out in somebody's clipboard.
 */
it("holds plain JSON a player can decode, change and encode again", () => {
  const key = SaveBuilder.empty().withXp(640).beating("Casual", "cho", 800).key();

  expect(decodeKey("save", key)).toEqual({
    v: 1,
    xp: 640,
    beaten: {Casual: {cho: [800], han: []}, Scored: {cho: [], han: []}},
    customStyles: {boards: [], pieceSets: []},
  });
});

it("climbs one ladder at a time, leaving the other three alone", () => {
  const climbed = SaveBuilder.empty().beating("Casual", "cho", 800, 1000).beating("Scored", "han", 800).build();

  expect(climbed.progress.beaten).toEqual({
    Casual: {cho: [800, 1000], han: []},
    Scored: {cho: [], han: [800]},
  });
});

it("keeps each strength once, however often it is named", () => {
  const climbed = SaveBuilder.empty().beating("Casual", "cho", 800).beating("Casual", "cho", 800, 1000).build();

  expect(climbed.progress.beaten.Casual.cho).toEqual([800, 1000]);
});

it("carries the player's own styles", () => {
  expect(SaveBuilder.empty().withBoardStyle(mine).build().customStyles.boards).toEqual([mine]);
});

it("leaves the save it was branched from alone", () => {
  const base = SaveBuilder.empty().withXp(100);

  expect(base.withXp(900).build().progress.xp).toBe(900);
  expect(base.build().progress.xp).toBe(100);
});

it("reads back through the loader exactly as it was built", () => {
  const save = SaveBuilder.empty().withXp(640).beating("Casual", "cho", 800).withBoardStyle(mine).build();

  expect(saveFrom(SaveBuilder.of(save).key())).toEqual(save);
});
