import {afterEach, expect, it, vi} from "vitest";
import {saveJson} from "@src/redux/device-storage/SaveJson";

afterEach(() => {
  vi.restoreAllMocks();
});

const refusing: Pick<Storage, "setItem"> = {
  setItem: () => {
    throw new Error("QuotaExceededError");
  },
};

it("writes the value as JSON under the key", () => {
  const written = new Map<string, string>();

  saveJson({setItem: (key, value) => void written.set(key, value)}, "kept", {elo: 1250});

  expect(JSON.parse(written.get("kept") ?? "null")).toEqual({elo: 1250});
});

it("carries on when the storage is full or refuses to be written", () => {
  vi.spyOn(console, "error").mockImplementation(() => undefined);

  expect(() => saveJson(refusing, "carries-on", {elo: 1250})).not.toThrow();
});

it("says in the console which key could not be kept, and how big it was", () => {
  const error = vi.spyOn(console, "error").mockImplementation(() => undefined);

  saveJson(refusing, "janggi.big", {games: "x".repeat(3000)});

  expect(error).toHaveBeenCalledOnce();
  expect(error.mock.calls[0]?.[0]).toMatch(/janggi\.big.*3 KB/);
});

it("says so once per key, not on every write that follows", () => {
  const error = vi.spyOn(console, "error").mockImplementation(() => undefined);

  saveJson(refusing, "janggi.repeated", 1);
  saveJson(refusing, "janggi.repeated", 2);
  saveJson(refusing, "janggi.other", 3);

  expect(error).toHaveBeenCalledTimes(2);
});

it("says nothing on a device with no storage at all, which is a choice rather than a fault", () => {
  const error = vi.spyOn(console, "error").mockImplementation(() => undefined);

  saveJson(undefined, "kept", {elo: 1250});

  expect(error).not.toHaveBeenCalled();
});
