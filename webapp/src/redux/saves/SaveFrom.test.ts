import {DEFAULT_BOARD_MARKS} from "@src/styles/defaults/DefaultBoardMarks";
import type {BoardStyle} from "@src/styles/types/BoardStyle";
import {SaveBuilder} from "@src/redux/saves/SaveBuilder";
import {encodeKey} from "@janggi/shared/janggi/share-keys/EncodeKey";
import {expect, it} from "vitest";
import {saveFrom} from "@src/redux/saves/SaveFrom";

const mine: BoardStyle = {
  name: "Mine",
  ...DEFAULT_BOARD_MARKS,
  surface: "#ffffff",
  defaultCell: {stroke: "#000000", strokeWidth: 1},
  lastMove: {wash: "rgba(0, 0, 0, 0.2)", brackets: "#000000"},
};

const save = SaveBuilder.empty()
  .withXp(640)
  .beating("Casual", "cho", 800, 1000)
  .beating("Casual", "han", 800)
  .beating("Scored", "cho", 800)
  .withBoardStyle(mine)
  .build();

it("reads back the save a key was made from", () => {
  expect(saveFrom(SaveBuilder.of(save).key())).toEqual(save);
});

it("reads a save a player has edited by hand to hold far more XP", () => {
  const edited = encodeKey("save", {
    v: 1,
    xp: 1_000_000,
    beaten: save.progress.beaten,
    customStyles: save.customStyles,
  });

  expect(saveFrom(edited)?.progress.xp).toBe(1_000_000);
});

/** Somebody writing a key from scratch will not think to put a version in it, and need not. */
it("reads a key written without a version", () => {
  const written = encodeKey("save", {xp: 90, beaten: {Casual: {cho: [800], han: []}}});

  expect(saveFrom(written)?.progress).toEqual({
    xp: 90,
    beaten: {Casual: {cho: [800], han: []}, Scored: {cho: [], han: []}},
  });
});

it("is nothing for a key written in a shape this app does not know", () => {
  expect(saveFrom(encodeKey("save", {v: 2, xp: 90}))).toBeUndefined();
});

it("is nothing for text that is not a save key", () => {
  expect(saveFrom("my save")).toBeUndefined();
  expect(saveFrom(encodeKey("board", mine))).toBeUndefined();
});

it("is nothing for a key that does not say how much XP it holds", () => {
  for (const xp of [undefined, "lots", -5]) {
    expect(saveFrom(encodeKey("save", {v: 1, xp, beaten: save.progress.beaten}))).toBeUndefined();
  }
});

it("keeps the progress in a save whose styles do not check out", () => {
  const broken = {...mine, surface: "url(https://example.com/a.png)"};
  const written = encodeKey("save", {v: 1, ...save.progress, customStyles: {boards: [broken]}});

  expect(saveFrom(written)).toEqual({progress: save.progress, customStyles: {boards: [], pieceSets: []}});
});
