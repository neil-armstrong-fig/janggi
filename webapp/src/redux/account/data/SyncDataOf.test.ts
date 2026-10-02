// @vitest-environment jsdom
import "@src/testing/SetupDomTest";
import {expect, it} from "vitest";
import {DEFAULT_BOARD_MARKS} from "@src/styles/defaults/DefaultBoardMarks";
import type {BoardStyle} from "@src/styles/types/BoardStyle";
import {createStore} from "@src/redux/Store";
import {boardStyleImported} from "@src/redux/custom-styles/CustomStylesSlice";
import {syncDataOf} from "@src/redux/account/data/SyncDataOf";
import {stylesStamped} from "@src/redux/account/ledger/SyncLedgerSlice";

const mine: BoardStyle = {
  name: "Mine",
  ...DEFAULT_BOARD_MARKS,
  surface: "#ffffff",
  defaultCell: {stroke: "#000000", strokeWidth: 1},
  lastMove: {wash: "rgba(0, 0, 0, 0.2)", brackets: "#000000"},
};

it("pairs each of the player's styles with the id and time the ledger holds for it", () => {
  const store = createStore(undefined);
  store.dispatch(boardStyleImported(mine));

  const {id, at} = store.getState().syncLedger.boards["Mine"]!;

  expect(syncDataOf(store.getState()).styles.boards).toEqual([{id, at, style: mine}]);
});

it("sends a style the ledger has no stamp for, as the oldest thing there is", () => {
  const store = createStore(undefined);
  store.dispatch(boardStyleImported(mine));
  store.dispatch(stylesStamped({boards: {}, pieceSets: {}, deleted: []}));

  expect(syncDataOf(store.getState()).styles.boards).toEqual([{id: "unstamped:Mine", at: 0, style: mine}]);
});

it("sends the time of the last preference change and of the record's last reset", () => {
  const store = createStore(undefined);

  expect(syncDataOf(store.getState()).preferences.at).toBe(store.getState().syncLedger.preferencesAt);
  expect(syncDataOf(store.getState()).ratings.resetAt).toBe(store.getState().syncLedger.ratingsResetAt);
});
