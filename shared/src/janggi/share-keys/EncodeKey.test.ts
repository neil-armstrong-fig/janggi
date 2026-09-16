import {expect, it} from "vitest";
import {encodeKey} from "./EncodeKey.js";

it("opens with the kind of thing the key carries", () => {
  expect(encodeKey("board", {})).toMatch(/^janggi-board:/);
  expect(encodeKey("pieces", {})).toMatch(/^janggi-pieces:/);
  expect(encodeKey("save", {})).toMatch(/^janggi-save:/);
});

/** The letter of it: players decode these by hand, so the format itself is a promise. */
it("writes the kind of key first, then the JSON in base64url", () => {
  expect(encodeKey("save", {xp: 1})).toBe("janggi-save:eyJ4cCI6MX0");
});

it("writes hanja and hangul as UTF-8", () => {
  expect(encodeKey("pieces", {c: "漢"})).toBe("janggi-pieces:eyJjIjoi5ryiIn0");
});

it("writes a key as one unbroken run a chat message will not split, whatever the value holds", () => {
  const key = encodeKey("pieces", {general: {han: "漢", cho: "楚"}, soldier: "졸", odd: "?>~ /+="});

  expect(key.slice("janggi-pieces:".length)).toMatch(/^[A-Za-z0-9_-]+$/);
});
