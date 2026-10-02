// @vitest-environment jsdom
import "@src/testing/SetupDomTest";
import {afterEach, beforeEach, expect, it, vi} from "vitest";
import {SaveBuilder} from "@src/redux/saves/SaveBuilder";
import {createStore} from "@src/redux/Store";
import {saveLoaded} from "@src/redux/saves/actions/SaveLoaded";
import {bikjangHintChosen, boardStyleChosen, musicVolumeChanged} from "@src/redux/preferences/PreferencesSlice";
import {sheetClosed} from "@src/redux/settings/SettingsSlice";
import {ratedGameFinished, ratedGameStarted} from "@src/redux/ratings/RatingsSlice";
import {ratingsResetStamped} from "@src/redux/account/ledger/SyncLedgerSlice";
import {signedIn, syncSucceeded} from "@src/redux/account/AccountSlice";

let fetched: string[];

beforeEach(() => {
  vi.useFakeTimers();
  fetched = [];
  vi.stubGlobal("fetch", (url: string, init?: RequestInit) => {
    fetched.push(`${init?.method ?? "GET"} ${new URL(url).pathname}`);

    return Promise.resolve(Response.json({version: 0, blob: null}));
  });
});

afterEach(() => {
  vi.useRealTimers();
});

it("syncs once the progress has stopped changing, for a player who is signed in", async () => {
  const store = createStore(undefined);
  store.dispatch(signedIn());

  store.dispatch(saveLoaded(SaveBuilder.empty().withXp(100).build()));
  store.dispatch(saveLoaded(SaveBuilder.empty().withXp(200).build()));
  await vi.runAllTimersAsync();

  expect(fetched.filter(call => call === "GET /api/data")).toHaveLength(1);
});

it("never syncs a player who is signed out, whatever changes", async () => {
  const store = createStore(undefined);

  store.dispatch(saveLoaded(SaveBuilder.empty().withXp(100).build()));
  await vi.runAllTimersAsync();

  expect(fetched).toEqual([]);
});

it("syncs a change to a preference that follows the player", async () => {
  const store = createStore(undefined);
  store.dispatch(signedIn());

  store.dispatch(bikjangHintChosen("Hidden"));
  await vi.runAllTimersAsync();

  expect(fetched).toContain("PUT /api/data");
});

it("does not sync a preference that belongs to the device, the volume or the look of the board", async () => {
  const store = createStore(undefined);
  store.dispatch(signedIn());

  store.dispatch(boardStyleChosen("Neon"));
  store.dispatch(musicVolumeChanged(0));
  await vi.runAllTimersAsync();

  expect(fetched).toEqual([]);
});

it("does not sync for a change to something the server does not hold", async () => {
  const store = createStore(undefined);
  store.dispatch(signedIn());

  store.dispatch(sheetClosed());
  await vi.runAllTimersAsync();

  expect(fetched).toEqual([]);
});

it("says syncing is under way as soon as something changes, rather than leaving the last sync's word standing", async () => {
  const store = createStore(undefined);
  store.dispatch(signedIn());
  store.dispatch(syncSucceeded());

  store.dispatch(saveLoaded(SaveBuilder.empty().withXp(100).build()));

  expect(store.getState().account.sync).toBe("idle");
  await vi.runAllTimersAsync();
});

it("syncs a change to the record", async () => {
  const store = createStore(undefined);
  store.dispatch(signedIn());

  store.dispatch(
    ratedGameStarted({format: "Casual", botElo: 800, playerSide: "cho", startedAt: "2026-01-01T00:00:00.000Z"}),
  );
  store.dispatch(ratedGameFinished({result: "won", ending: "checkmate", finishedAt: "2026-01-01T00:10:00.000Z"}));
  await vi.runAllTimersAsync();

  expect(fetched).toContain("GET /api/data");
});

it("syncs a change that only the ledger holds", async () => {
  const store = createStore(undefined);
  store.dispatch(signedIn());

  store.dispatch(ratingsResetStamped("2026-01-01T00:00:00.000Z"));
  await vi.runAllTimersAsync();

  expect(fetched).toContain("GET /api/data");
});
