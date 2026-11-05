// @vitest-environment jsdom
import "@src/testing/SetupDomTest";
import {expect, it, vi} from "vitest";
import {CLOCK_STORAGE_KEY} from "@src/redux/clock/storage/ClockStorageKey";
import {clockStarted, timeControlChosen} from "@src/redux/clock/ClockSlice";
import {createStore} from "@src/redux/Store";

it("writes every kept slice again when the page is hidden, for a browser that delays its own flush", () => {
  const written: string[] = [];
  const storage = {
    getItem: () => null,
    setItem: (key: string) => {
      written.push(key);
    },
  } as unknown as Storage;
  createStore(storage);
  written.length = 0;

  document.dispatchEvent(new Event("visibilitychange"));
  expect(written).toEqual([]);

  Object.defineProperty(document, "visibilityState", {value: "hidden", configurable: true});
  document.dispatchEvent(new Event("visibilitychange"));

  expect(written).toHaveLength(10);
});

it("writes every kept slice again when the page is hidden by leaving it", () => {
  const written: string[] = [];
  const storage = {
    getItem: () => null,
    setItem: (key: string) => {
      written.push(key);
    },
  } as unknown as Storage;
  createStore(storage);
  written.length = 0;

  window.dispatchEvent(new Event("pagehide"));

  expect(written).toHaveLength(10);
});

it("stamps the clock as the page is left, and only then", () => {
  const kept = new Map<string, string>();
  const storage = {
    getItem: () => null,
    setItem: (key: string, text: string) => {
      kept.set(key, text);
    },
  } as unknown as Storage;
  const store = createStore(storage);
  store.dispatch(timeControlChosen("5 min"));
  store.dispatch(clockStarted(1000));

  expect(JSON.parse(kept.get(CLOCK_STORAGE_KEY) ?? "{}")).not.toHaveProperty("leftAt");

  window.dispatchEvent(new Event("pagehide"));
  expect(JSON.parse(kept.get(CLOCK_STORAGE_KEY) ?? "{}")).toHaveProperty("leftAt");

  store.dispatch(clockStarted(2000));
  expect(JSON.parse(kept.get(CLOCK_STORAGE_KEY) ?? "{}")).not.toHaveProperty("leftAt");
});

it("makes no call to the API for a player who has never signed in", async () => {
  const fetched = vi.fn();
  vi.stubGlobal("fetch", fetched);

  const store = createStore({getItem: () => null, setItem: () => undefined} as unknown as Storage);
  store.dispatch({type: "game/anything"});
  await Promise.resolve();

  expect(fetched).not.toHaveBeenCalled();
});
