// @vitest-environment jsdom
import "@src/testing/SetupDomTest";
import {expect, it} from "vitest";
import {CUSTOM_STYLES_STORAGE_KEY} from "@src/redux/custom-styles/storage/CustomStylesStorageKey";
import {DEFAULT_BOARD_MARKS} from "@src/styles/defaults/DefaultBoardMarks";
import type {BoardStyle} from "@src/styles/types/BoardStyle";
import {caughtUpLedger} from "@src/redux/account/stamping/CaughtUpLedger";
import {createStore} from "@src/redux/Store";

const mine: BoardStyle = {
  name: "Mine",
  ...DEFAULT_BOARD_MARKS,
  surface: "#ffffff",
  defaultCell: {stroke: "#000000", strokeWidth: 1},
  lastMove: {wash: "rgba(0, 0, 0, 0.2)", brackets: "#000000"},
};

function storageHoldingStyles(): Storage {
  const stored = JSON.stringify({boards: [mine], pieceSets: []});

  return {
    getItem: (key: string) => (key === CUSTOM_STYLES_STORAGE_KEY ? stored : null),
    setItem: () => undefined,
  } as unknown as Storage;
}

it("stamps styles the device held before there was a ledger, at the beginning of time", () => {
  const store = createStore(storageHoldingStyles());

  expect(store.getState().syncLedger.boards["Mine"]).toEqual({id: expect.any(String), at: 0});
});

it("leaves the ledger alone where it already says everything, so a device with no styles is not written to", () => {
  const store = createStore(undefined);
  const before = store.getState().syncLedger;

  caughtUpLedger(store);

  expect(store.getState().syncLedger).toBe(before);
});
