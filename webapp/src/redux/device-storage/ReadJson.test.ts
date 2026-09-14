import {expect, it} from "vitest";
import {readJson} from "@src/redux/device-storage/ReadJson";

function storageHolding(stored: Record<string, string>): Pick<Storage, "getItem"> {
  return {getItem: key => stored[key] ?? null};
}

it("reads back the value stored under the key", () => {
  expect(readJson(storageHolding({kept: '{"elo":1250}'}), "kept")).toEqual({elo: 1250});
});

it("reads nothing where nothing is stored", () => {
  expect(readJson(storageHolding({}), "kept")).toBeUndefined();
});

it("reads nothing on a device with no storage at all", () => {
  expect(readJson(undefined, "kept")).toBeUndefined();
});

it("reads nothing when what is stored is not JSON", () => {
  expect(readJson(storageHolding({kept: "{not json"}), "kept")).toBeUndefined();
});

it("reads nothing when the storage refuses to be read", () => {
  const refusing: Pick<Storage, "getItem"> = {
    getItem: () => {
      throw new Error("SecurityError");
    },
  };

  expect(readJson(refusing, "kept")).toBeUndefined();
});
