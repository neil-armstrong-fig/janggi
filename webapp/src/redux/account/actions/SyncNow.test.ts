// @vitest-environment jsdom
import "@src/testing/SetupDomTest";
import {afterEach, beforeEach, expect, it, vi} from "vitest";
import {DEFAULT_BOARD_MARKS} from "@src/styles/defaults/DefaultBoardMarks";
import type {BoardStyle} from "@src/styles/types/BoardStyle";
import type {GameRecord} from "@src/redux/ratings/types/GameRecord";
import {SaveBuilder} from "@src/redux/saves/SaveBuilder";
import type {Save} from "@src/redux/saves/types/Save";
import {createStore} from "@src/redux/Store";
import type {AppStore} from "@src/redux/Store";
import type {SyncData} from "@src/redux/account/data/types/SyncData";
import {MAX_SYNCED_DATA_LENGTH} from "@janggi/shared/janggi/account/SyncedDataLimit";
import {boardStyleImported} from "@src/redux/custom-styles/CustomStylesSlice";
import {bikjangHintChosen, boardStyleChosen} from "@src/redux/preferences/PreferencesSlice";
import {syncedPreferencesOf} from "@src/redux/preferences/synced/SyncedPreferencesOf";
import {defaultPreferences} from "@src/redux/preferences/default-preferences/DefaultPreferences";
import {freshRatings} from "@src/redux/ratings/fresh-ratings/FreshRatings";
import {recordReset} from "@src/redux/ratings/RatingsSlice";
import {saveLoaded} from "@src/redux/saves/actions/SaveLoaded";
import {signedIn} from "@src/redux/account/AccountSlice";
import {syncDataFrom} from "@src/redux/account/data/SyncDataFrom";
import {syncDataOf} from "@src/redux/account/data/SyncDataOf";
import {syncDataText} from "@src/redux/account/data/SyncDataText";
import {syncMerged} from "@src/redux/account/actions/SyncMerged";
import {syncNow} from "@src/redux/account/actions/SyncNow";

interface Call {
  readonly method: string;
  readonly ifMatch?: string;
  readonly body: unknown;
}

const empty = SaveBuilder.empty();
const mine: BoardStyle = {
  name: "Mine",
  ...DEFAULT_BOARD_MARKS,
  surface: "#ffffff",
  defaultCell: {stroke: "#000000", strokeWidth: 1},
  lastMove: {wash: "rgba(0, 0, 0, 0.2)", brackets: "#000000"},
};
let calls: Call[];

beforeEach(() => {
  vi.useFakeTimers();
  calls = [];
});

afterEach(() => {
  vi.useRealTimers();
});

/** A device that is signed in and holds `save`, talking to a server that answers with each of `answers` in turn. */
function deviceHolding(save: Save, answers: readonly Response[]): AppStore {
  const remaining = [...answers];

  vi.stubGlobal("fetch", (_url: string, init?: RequestInit) => {
    const headers = new Headers(init?.headers);

    calls.push({
      method: init?.method ?? "GET",
      ifMatch: headers.get("If-Match") ?? undefined,
      body: typeof init?.body === "string" ? JSON.parse(init.body) : undefined,
    });

    return Promise.resolve(remaining.shift() ?? new Response(undefined, {status: 500}));
  });

  const store = createStore(undefined);
  store.dispatch(saveLoaded(save));
  store.dispatch(signedIn());

  return store;
}

/** What a server that holds `data` answers a read with. */
function holding(version: number, data?: SyncData): Response {
  return Response.json({version, blob: data ? syncDataText(data) : null});
}

/** What another device would have written: the progress of `save`, and nothing else of its own. */
function otherDevice(save: Save, overrides: Partial<SyncData> = {}): SyncData {
  return {
    progress: save.progress,
    styles: {boards: [], pieceSets: [], deleted: []},
    ratings: {byFormat: freshRatings().byFormat, resetAt: undefined},
    preferences: {value: syncedPreferencesOf(defaultPreferences()), at: 0},
    ...overrides,
  };
}

function game(finishedAt: string): GameRecord {
  return {
    format: "Casual",
    botElo: 800,
    playerSide: "cho",
    result: "won",
    ending: "checkmate",
    eloBefore: 1200,
    eloAfter: 1210,
    finishedAt,
  };
}

it("writes what the device holds when the server holds nothing", async () => {
  const store = deviceHolding(empty.withXp(640).build(), [holding(0), Response.json({version: 1})]);

  await store.dispatch(syncNow());

  expect(calls[1]).toEqual({
    method: "PUT",
    ifMatch: "0",
    body: {blob: syncDataText(syncDataOf(store.getState()))},
  });
  expect(store.getState().account.sync).toBe("synced");
});

it("takes on the progress the server holds beyond the device's, and has nothing to write back", async () => {
  const server = empty.withXp(900).build();
  const store = deviceHolding(empty.withXp(640).build(), [holding(4, otherDevice(server))]);

  await store.dispatch(syncNow());

  expect(store.getState().progress.xp).toBe(900);
  expect(calls.map(call => call.method)).toEqual(["GET"]);
});

it("writes the merge of both when each has gone further than the other", async () => {
  const device = empty.withXp(900).beating("Casual", "cho", 800).build();
  const server = empty.withXp(640).beating("Casual", "han", 1000).build();
  const store = deviceHolding(device, [holding(2, otherDevice(server)), Response.json({version: 3})]);

  await store.dispatch(syncNow());

  const merged = store.getState().progress;
  expect(merged.xp).toBe(900);
  expect(merged.beaten.Casual).toEqual({cho: [800], han: [1000]});
  expect(calls[1]?.ifMatch).toBe("2");
});

it("writes nothing when the server already holds exactly what the device does", async () => {
  const store = deviceHolding(empty.withXp(640).build(), []);
  vi.stubGlobal("fetch", () => Promise.resolve(holding(1, syncDataOf(store.getState()))));

  await store.dispatch(syncNow());

  expect(store.getState().account.sync).toBe("synced");
});

it("does not touch the store when the merge adds nothing, or the change would start another sync", async () => {
  const save = empty.withXp(640).build();
  const store = deviceHolding(save, [holding(1, otherDevice(save))]);
  const before = store.getState();

  await store.dispatch(syncNow());

  expect(store.getState().progress).toBe(before.progress);
  expect(store.getState().customStyles).toBe(before.customStyles);
  expect(store.getState().ratings).toBe(before.ratings);
});

it("does not bring back a style that was deleted on another device", async () => {
  const store = deviceHolding(empty.withBoardStyle(mine).build(), []);
  const id = store.getState().syncLedger.boards["Mine"]?.id ?? "";
  const deleted = {kind: "Board", id, at: Date.now() + 1000} as const;
  vi.stubGlobal("fetch", () => {
    return Promise.resolve(
      holding(3, otherDevice(empty.build(), {styles: {boards: [], pieceSets: [], deleted: [deleted]}})),
    );
  });

  await store.dispatch(syncNow());

  expect(store.getState().customStyles.boards).toEqual([]);
});

it("remembers a style the player deleted here, and tells the server so it is not brought back", async () => {
  const store = deviceHolding(empty.withBoardStyle(mine).build(), [holding(0), Response.json({version: 1})]);
  const id = store.getState().syncLedger.boards["Mine"]?.id;
  store.dispatch({type: "customStyles/boardStyleDeleted", payload: "Mine"});

  await store.dispatch(syncNow());

  const written = syncDataFrom((calls[1]?.body as {blob: string}).blob);
  expect(written?.styles.deleted.map(deletion => deletion.id)).toEqual([id]);
  expect(written?.styles.boards).toEqual([]);
});

it("takes a style another device made", async () => {
  const store = deviceHolding(empty.build(), []);
  const theirs = {id: "theirs", at: 5, style: mine};
  vi.stubGlobal("fetch", () => {
    return Promise.resolve(
      holding(1, otherDevice(empty.build(), {styles: {boards: [theirs], pieceSets: [], deleted: []}})),
    );
  });

  await store.dispatch(syncNow());

  expect(store.getState().customStyles.boards).toEqual([mine]);
  expect(store.getState().syncLedger.boards).toEqual({Mine: {id: "theirs", at: 5}});
});

it("keeps the time the other device gave a style it changed, rather than stamping the merge as if it were chosen here", async () => {
  const store = deviceHolding(empty.withBoardStyle(mine).build(), []);
  const {id} = store.getState().syncLedger.boards["Mine"]!;
  const changed = {...mine, surface: "#000000"};
  vi.stubGlobal("fetch", () => {
    return Promise.resolve(
      holding(
        2,
        otherDevice(empty.build(), {
          styles: {boards: [{id, at: Date.now() + 5000, style: changed}], pieceSets: [], deleted: []},
        }),
      ),
    );
  });

  await store.dispatch(syncNow());

  expect(store.getState().customStyles.boards).toEqual([changed]);
  expect(store.getState().syncLedger.boards["Mine"]).toEqual({id, at: Date.now() + 5000});
});

it("does not bring back the games of a record that was started again on another device", async () => {
  const store = deviceHolding(empty.build(), []);
  const fresh = freshRatings().byFormat;
  store.dispatch(
    syncMerged({
      ...syncDataOf(store.getState()),
      ratings: {
        byFormat: {...fresh, Casual: {elo: 1210, games: [game("2026-01-01T00:00:00.000Z")]}},
        resetAt: undefined,
      },
    }),
  );
  vi.stubGlobal("fetch", () => {
    return Promise.resolve(
      holding(2, otherDevice(empty.build(), {ratings: {byFormat: fresh, resetAt: "2026-02-01T00:00:00.000Z"}})),
    );
  });

  await store.dispatch(syncNow());

  expect(store.getState().ratings.byFormat.Casual.games).toEqual([]);
});

it("tells the server when the player starts their record again", async () => {
  const store = deviceHolding(empty.build(), [holding(0), Response.json({version: 1})]);
  store.dispatch(recordReset());

  await store.dispatch(syncNow());

  const written = syncDataFrom((calls[1]?.body as {blob: string}).blob);
  expect(written?.ratings.resetAt).toBeDefined();
});

it("takes the preferences chosen most recently, here or there", async () => {
  const store = deviceHolding(empty.build(), []);
  vi.stubGlobal("fetch", () => {
    return Promise.resolve(
      holding(
        1,
        otherDevice(empty.build(), {
          preferences: {
            value: {...syncedPreferencesOf(defaultPreferences()), bikjangHint: "Hidden"},
            at: Date.now() + 1000,
          },
        }),
      ),
    );
  });

  await store.dispatch(syncNow());

  expect(store.getState().preferences.bikjangHint).toBe("Hidden");
});

it("keeps the device's own preferences when it takes the ones that follow the player", async () => {
  const store = deviceHolding(empty.build(), []);
  store.dispatch(boardStyleChosen("Neon"));
  vi.stubGlobal("fetch", () => {
    return Promise.resolve(
      holding(
        1,
        otherDevice(empty.build(), {
          preferences: {
            value: {...syncedPreferencesOf(defaultPreferences()), bikjangHint: "Hidden"},
            at: Date.now() + 1000,
          },
        }),
      ),
    );
  });

  await store.dispatch(syncNow());

  expect(store.getState().preferences.bikjangHint).toBe("Hidden");
  expect(store.getState().preferences.boardStyle).toBe("Neon");
});

it("keeps the preferences the player has just chosen over older ones on the server", async () => {
  const store = deviceHolding(empty.build(), [
    holding(
      1,
      otherDevice(empty.build(), {
        preferences: {value: {...syncedPreferencesOf(defaultPreferences()), bikjangHint: "Hidden"}, at: 1},
      }),
    ),
    Response.json({version: 2}),
  ]);
  store.dispatch(bikjangHintChosen("Shown"));
  store.dispatch(bikjangHintChosen("Hidden"));
  store.dispatch(bikjangHintChosen("Shown"));

  await store.dispatch(syncNow());

  expect(store.getState().preferences.bikjangHint).toBe("Shown");
  expect(calls[1]?.method).toBe("PUT");
});

it("reads again and writes again when another device wrote in between", async () => {
  const store = deviceHolding(empty.withXp(640).build(), [
    holding(0),
    Response.json({version: 1}, {status: 409}),
    holding(1, otherDevice(empty.withXp(500).build())),
    Response.json({version: 2}),
  ]);

  await store.dispatch(syncNow());

  expect(calls.map(call => call.method)).toEqual(["GET", "PUT", "GET", "PUT"]);
  expect(calls[3]?.ifMatch).toBe("1");
  expect(store.getState().account.sync).toBe("synced");
});

it("gives up after a second conflict and says syncing is paused", async () => {
  const conflict = (): Response => Response.json({version: 1}, {status: 409});
  const store = deviceHolding(empty.withXp(640).build(), [holding(0), conflict(), holding(1), conflict()]);

  await store.dispatch(syncNow());

  expect(store.getState().account.sync).toBe("paused");
});

it("says syncing is paused when the server cannot be used, and keeps the player signed in", async () => {
  const store = deviceHolding(empty.withXp(640).build(), [new Response(undefined, {status: 503})]);

  await store.dispatch(syncNow());

  expect(store.getState().account).toEqual({status: "signed-in", sync: "paused"});
});

it("says syncing is paused when the server cannot be reached", async () => {
  const store = deviceHolding(empty.build(), []);
  vi.stubGlobal("fetch", () => Promise.reject(new TypeError("offline")));

  await store.dispatch(syncNow());

  expect(store.getState().account.sync).toBe("paused");
});

it("signs the player out when the server no longer knows them", async () => {
  const store = deviceHolding(empty.withXp(640).build(), [new Response(undefined, {status: 401})]);

  await store.dispatch(syncNow());

  expect(store.getState().account.status).toBe("signed-out");
});

it("leaves what the device holds alone when the server's data is not a document it can read", async () => {
  const store = deviceHolding(empty.withXp(640).build(), [
    Response.json({version: 1, blob: "not a document"}),
    Response.json({version: 2}),
  ]);

  await store.dispatch(syncNow());

  expect(store.getState().progress.xp).toBe(640);
});

it("says the data is too big to sync, and writes nothing, when the document is past what the server keeps", async () => {
  const store = deviceHolding(empty.build(), [holding(0)]);
  store.dispatch(boardStyleImported({...mine, name: "x".repeat(MAX_SYNCED_DATA_LENGTH)}));

  await store.dispatch(syncNow());

  expect(calls.map(call => call.method)).toEqual(["GET"]);
  expect(store.getState().account).toMatchObject({status: "signed-in", sync: "too-large"});
});

it("says the data is too big to sync where the server says so", async () => {
  const store = deviceHolding(empty.withXp(640).build(), [holding(0), new Response(undefined, {status: 413})]);

  await store.dispatch(syncNow());

  expect(store.getState().account.sync).toBe("too-large");
});

it("syncs again once the player has less, the next time something changes", async () => {
  const store = deviceHolding(empty.build(), [holding(0), holding(0), Response.json({version: 1})]);
  store.dispatch(boardStyleImported({...mine, name: "x".repeat(MAX_SYNCED_DATA_LENGTH)}));
  await store.dispatch(syncNow());

  store.dispatch({type: "customStyles/boardStyleDeleted", payload: "x".repeat(MAX_SYNCED_DATA_LENGTH)});
  await store.dispatch(syncNow());

  expect(store.getState().account.sync).toBe("synced");
});
