import {expect, it} from "vitest";
import {decodeKey} from "./DecodeKey.js";
import {encodeKey} from "./EncodeKey.js";

const value = {name: "한초", characters: {general: {han: "漢", cho: "楚"}}, size: 0.86};

it("reads back what was encoded, hangul and hanja included", () => {
  expect(decodeKey("pieces", encodeKey("pieces", value))).toEqual(value);
});

it("forgives the whitespace copying and pasting picks up", () => {
  expect(decodeKey("pieces", `  ${encodeKey("pieces", value)}\n`)).toEqual(value);
});

it("is nothing for a key of another kind", () => {
  expect(decodeKey("board", encodeKey("pieces", value))).toBeUndefined();
});

it("is nothing for text that is not a key", () => {
  expect(decodeKey("save", "hello")).toBeUndefined();
  expect(decodeKey("save", "janggi-save:")).toBeUndefined();
  expect(decodeKey("save", "janggi-save:not base64!")).toBeUndefined();
});

it("is nothing for a key cut short", () => {
  const key = encodeKey("pieces", value);

  expect(decodeKey("pieces", key.slice(0, key.length - 6))).toBeUndefined();
});

it("is nothing for a style key far longer than any style", () => {
  expect(decodeKey("board", encodeKey("board", {padding: "x".repeat(100_000)}))).toBeUndefined();
});
