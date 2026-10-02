import {expect, it} from "vitest";
import {SYNC_LEDGER_STORAGE_KEY} from "@src/redux/account/ledger/storage/SyncLedgerStorageKey";
import {loadSyncLedger} from "@src/redux/account/ledger/storage/LoadSyncLedger";

const holding = (value: unknown): Pick<Storage, "getItem"> => ({
  getItem: key => (key === SYNC_LEDGER_STORAGE_KEY ? JSON.stringify(value) : null),
});

const EMPTY = {boards: {}, pieceSets: {}, deleted: [], preferencesAt: 0, ratingsResetAt: undefined};

it("is empty on a device that has kept nothing", () => {
  expect(loadSyncLedger({getItem: () => null})).toEqual(EMPTY);
  expect(loadSyncLedger(undefined)).toEqual(EMPTY);
});

it("reads back what was kept", () => {
  const kept = {
    boards: {Mine: {id: "a", at: 5}},
    pieceSets: {Set: {id: "b", at: 6}},
    deleted: [{kind: "Board", id: "c", at: 7}],
    preferencesAt: 8,
    ratingsResetAt: "2026-01-01T00:00:00Z",
  };

  expect(loadSyncLedger(holding(kept))).toEqual(kept);
});

it("keeps what checks out and drops what does not, a part at a time", () => {
  const ledger = loadSyncLedger(
    holding({
      boards: {Good: {id: "a", at: 1}, NoId: {at: 1}, NoTime: {id: "b"}, Odd: 7},
      pieceSets: "nonsense",
      deleted: [{kind: "Board", id: "c", at: 7}, {kind: "Sky", id: "d", at: 1}, 3],
      preferencesAt: "yesterday",
      ratingsResetAt: 4,
    }),
  );

  expect(ledger).toEqual({
    boards: {Good: {id: "a", at: 1}},
    pieceSets: {},
    deleted: [{kind: "Board", id: "c", at: 7}],
    preferencesAt: 0,
    ratingsResetAt: undefined,
  });
});
