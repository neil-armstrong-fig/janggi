import type {BoardStyle} from "@src/styles/types/BoardStyle";
import {CUSTOM_STYLES_STORAGE_KEY} from "@src/redux/custom-styles/storage/CustomStylesStorageKey";
import {expect, it} from "vitest";
import {loadCustomStyles} from "@src/redux/custom-styles/storage/LoadCustomStyles";
import {noCustomStyles} from "@src/redux/custom-styles/no-custom-styles/NoCustomStyles";

/** A stand-in for `localStorage`, holding whatever it is handed. */
function storageHolding(stored: unknown): Pick<Storage, "getItem"> {
  return {getItem: key => (key === CUSTOM_STYLES_STORAGE_KEY ? JSON.stringify(stored) : null)};
}

const mine: BoardStyle = {
  name: "Mine",
  surface: "#ffffff",
  defaultCell: {stroke: "#000000", strokeWidth: 1},
  lastMove: {wash: "rgba(0, 0, 0, 0.2)", brackets: "#000000"},
};

it("starts with none when nothing has been stored", () => {
  expect(loadCustomStyles({getItem: () => null})).toEqual(noCustomStyles());
});

it("starts with none on a device with no storage to read", () => {
  expect(loadCustomStyles(undefined)).toEqual(noCustomStyles());
});

it("reads back exactly what was saved", () => {
  expect(loadCustomStyles(storageHolding({boards: [mine], pieceSets: []}))).toEqual({boards: [mine], pieceSets: []});
});

it("drops a stored style that no longer checks out, and keeps the rest", () => {
  const tampered = {...mine, name: "Tampered", surface: "url(https://example.com/a.png)"};

  expect(loadCustomStyles(storageHolding({boards: [mine, tampered], pieceSets: "none"}))).toEqual({
    boards: [mine],
    pieceSets: [],
  });
});

it("starts with none when what is stored is not an object", () => {
  expect(loadCustomStyles(storageHolding([mine]))).toEqual(noCustomStyles());
});
