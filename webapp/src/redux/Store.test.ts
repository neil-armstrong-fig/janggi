// @vitest-environment jsdom
import "@src/testing/SetupDomTest";
import {expect, it} from "vitest";
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

  expect(written).toHaveLength(6);
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

  expect(written).toHaveLength(6);
});
