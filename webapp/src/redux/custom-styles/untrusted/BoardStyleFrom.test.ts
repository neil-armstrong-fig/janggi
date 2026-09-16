import type {BoardStyle} from "@src/styles/types/BoardStyle";
import {boardStyleFrom} from "@src/redux/custom-styles/untrusted/BoardStyleFrom";
import {expect, it} from "vitest";

const style: BoardStyle = {
  name: "Mine",
  surface: "linear-gradient(160deg, #0b1220, #131c2e)",
  defaultCell: {stroke: "#2f6f8f", strokeWidth: 1, diagonalStroke: "#f472b6", diagonalStrokeWidth: 1.5},
  cells: {
    f5r2: {
      stroke: "#2f6f8f",
      strokeWidth: 1,
      surface: "#000",
      marker: {shape: "ring", radius: 18, colour: "#38bdf8", strokeWidth: 2},
    },
  },
  lastMove: {wash: "rgba(56, 189, 248, 0.16)", brackets: "#38bdf8"},
};

it("accepts a board style exactly as it was written", () => {
  expect(boardStyleFrom(style)).toEqual({kind: "accepted", value: style});
});

it("leaves behind anything written into it that a board style does not have", () => {
  expect(boardStyleFrom({...style, onload: "alert(1)"})).toEqual({kind: "accepted", value: style});
});

it("trims the name it is given", () => {
  expect(boardStyleFrom({...style, name: "  Mine  "})).toEqual({kind: "accepted", value: style});
});

it("refuses a surface that would load a picture from elsewhere, and says where", () => {
  expect(boardStyleFrom({...style, surface: "url(https://example.com/a.png)"})).toEqual({
    kind: "refused",
    reason: expect.stringContaining("style.surface"),
  });
});

it("refuses a colour deep inside it that would load from elsewhere", () => {
  const marker = {shape: "dot", radius: 18, colour: "url(https://example.com/a.png)"};

  expect(boardStyleFrom({...style, cells: {f5r2: {stroke: "#000", strokeWidth: 1, marker}}})).toEqual({
    kind: "refused",
    reason: expect.stringContaining("style.cells.f5r2.marker.colour"),
  });
});

it("refuses a point that is not on the board", () => {
  expect(boardStyleFrom({...style, cells: {f10r1: style.defaultCell}})).toEqual({
    kind: "refused",
    reason: expect.stringContaining("style.cells.f10r1"),
  });
});

it("refuses a line too wide to draw", () => {
  expect(boardStyleFrom({...style, defaultCell: {stroke: "#000", strokeWidth: 50}})).toEqual({
    kind: "refused",
    reason: expect.stringContaining("style.defaultCell.strokeWidth"),
  });
});

it("refuses a marker of a shape the board cannot draw", () => {
  const marker = {shape: "star", radius: 18, colour: "#000"};

  expect(boardStyleFrom({...style, cells: {f5r2: {stroke: "#000", strokeWidth: 1, marker}}})).toEqual({
    kind: "refused",
    reason: expect.stringContaining("style.cells.f5r2.marker.shape"),
  });
});

it("refuses a style with no name to pick it by", () => {
  expect(boardStyleFrom({...style, name: "   "})).toEqual({
    kind: "refused",
    reason: expect.stringContaining("style.name"),
  });
});

it("refuses a style missing something every board must have", () => {
  const {lastMove: _lastMove, ...withoutLastMove} = style;

  expect(boardStyleFrom(withoutLastMove)).toEqual({kind: "refused", reason: expect.stringContaining("style.lastMove")});
});

it("refuses what is not an object at all", () => {
  expect(boardStyleFrom("Neon")).toEqual({kind: "refused", reason: expect.stringContaining("style")});
});
