import {expect, it} from "vitest";
import {isCssValue} from "@src/redux/untrusted/IsCssValue";

it("accepts colours, gradients and font stacks", () => {
  for (const value of [
    "#e7c88f",
    "rgba(74, 49, 22, 0.2)",
    "linear-gradient(160deg, #0b1220, #131c2e)",
    "'Noto Sans KR', 'Malgun Gothic', sans-serif",
  ]) {
    expect(isCssValue(value)).toBe(true);
  }
});

it("accepts a url naming something on the page itself", () => {
  expect(isCssValue("url(#gold)")).toBe(true);
  expect(isCssValue("url('#gold')")).toBe(true);
});

it("refuses anything that would load from somewhere else", () => {
  for (const value of [
    "url(https://example.com/a.png)",
    "url(//example.com/a.png)",
    "URL( 'https://example.com/a.png' )",
    "linear-gradient(red, blue), url(https://example.com/a.png)",
    "url(#gold) url(https://example.com/a.png)",
    "image-set('a.png' 1x)",
    "-webkit-image-set('a.png' 1x)",
    "src(https://example.com/a.png)",
  ]) {
    expect(isCssValue(value)).toBe(false);
  }
});

it("refuses anything that could climb out of the one property it is set as", () => {
  for (const value of [
    "red; background: blue",
    "red } body { color: red",
    "</style>",
    "u\\72l(https://x.png)",
    "red /**/",
  ]) {
    expect(isCssValue(value)).toBe(false);
  }
});

it("refuses what is not a string, or is far too long to be a colour", () => {
  expect(isCssValue(42)).toBe(false);
  expect(isCssValue(undefined)).toBe(false);
  expect(isCssValue("a".repeat(501))).toBe(false);
});
