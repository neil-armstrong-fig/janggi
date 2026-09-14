import {expect, it} from "vitest";
import {saveJson} from "@src/redux/device-storage/SaveJson";

it("writes the value as JSON under the key", () => {
  const written = new Map<string, string>();

  saveJson({setItem: (key, value) => void written.set(key, value)}, "kept", {elo: 1250});

  expect(JSON.parse(written.get("kept") ?? "null")).toEqual({elo: 1250});
});

it("carries on quietly when the storage is full or refuses to be written", () => {
  const refusing: Pick<Storage, "setItem"> = {
    setItem: () => {
      throw new Error("QuotaExceededError");
    },
  };

  expect(() => saveJson(refusing, "kept", {elo: 1250})).not.toThrow();
});

it("carries on quietly on a device with no storage at all", () => {
  expect(() => saveJson(undefined, "kept", {elo: 1250})).not.toThrow();
});
