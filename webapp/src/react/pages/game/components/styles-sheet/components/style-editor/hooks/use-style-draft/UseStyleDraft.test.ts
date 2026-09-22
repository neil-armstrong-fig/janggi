// @vitest-environment jsdom
import "@src/testing/SetupDomTest";
import type {BoardStyle} from "@src/styles/types/BoardStyle";
import type {StyleDraft} from "@src/react/pages/game/components/styles-sheet/components/style-editor/hooks/use-style-draft/UseStyleDraft";
import {act, renderHook} from "@testing-library/react";
import {boardFromText} from "@src/react/pages/game/components/styles-sheet/components/style-editor/components/board-style-editor/board-text/BoardFromText";
import {classicStyle} from "@src/react/pages/game/components/board/cell-styles/builtin/ClassicStyle";
import {expect, it} from "vitest";
import {useStyleDraft} from "@src/react/pages/game/components/styles-sheet/components/style-editor/hooks/use-style-draft/UseStyleDraft";

interface LatestDraft {
  readonly current: StyleDraft<BoardStyle>;
}

interface RenderedDraft {
  readonly result: LatestDraft;
}

it("starts on the style it was given, in the controls", () => {
  const {result} = draft();

  expect(result.current.style).toBe(classicStyle);
  expect(result.current.view).toBe("controls");
});

it("changes the style by hand, from what it is now", () => {
  const {result} = draft();

  act(() => result.current.change(boardStyle => ({...boardStyle, surface: "#000000"})));
  act(() =>
    result.current.change(boardStyle => ({...boardStyle, defaultCell: {...boardStyle.defaultCell, stroke: "#ffffff"}})),
  );

  expect(result.current.style.surface).toBe("#000000");
  expect(result.current.style.defaultCell.stroke).toBe("#ffffff");
});

it("writes the style out when the raw view is opened, changes and all", () => {
  const {result} = draft();

  act(() => result.current.change(boardStyle => ({...boardStyle, surface: "#123456"})));
  act(() => result.current.showRaw());

  expect(result.current.view).toBe("raw");
  expect(JSON.parse(result.current.raw).surface).toBe("#123456");
});

it("takes a text that is a style as the style", () => {
  const {result} = draft();

  act(() => result.current.showRaw());
  act(() => result.current.writeRaw(JSON.stringify({...classicStyle, surface: "#abcdef"})));

  expect(result.current.style.surface).toBe("#abcdef");
  expect(result.current.rawRefusal).toBeUndefined();
});

it("keeps the last style that was one while what is typed is not, and says what is wrong", () => {
  const {result} = draft();

  act(() => result.current.showRaw());
  act(() => result.current.writeRaw("{"));

  expect(result.current.style).toBe(classicStyle);
  expect(result.current.raw).toBe("{");
  expect(result.current.rawRefusal).toContain("not JSON");
});

it("stops complaining once what is typed is a style again", () => {
  const {result} = draft();

  act(() => result.current.showRaw());
  act(() => result.current.writeRaw("{"));
  act(() => result.current.writeRaw(JSON.stringify(classicStyle)));

  expect(result.current.rawRefusal).toBeUndefined();
});

it("goes back to the controls with the last style that passed", () => {
  const {result} = draft();

  act(() => result.current.showRaw());
  act(() => result.current.writeRaw(JSON.stringify({...classicStyle, surface: "#abcdef"})));
  act(() => result.current.writeRaw("{"));
  act(() => result.current.showControls());

  expect(result.current.view).toBe("controls");
  expect(result.current.style.surface).toBe("#abcdef");
});

it("forgets a complaint when the raw view is opened afresh", () => {
  const {result} = draft();

  act(() => result.current.showRaw());
  act(() => result.current.writeRaw("{"));
  act(() => result.current.showControls());
  act(() => result.current.showRaw());

  expect(result.current.rawRefusal).toBeUndefined();
  expect(JSON.parse(result.current.raw).surface).toBe(classicStyle.surface);
});

it("cannot be saved while the raw view is open on text that is not a style", () => {
  const {result} = draft();

  act(() => result.current.showRaw());
  expect(result.current.unsavable).toBeUndefined();

  act(() => result.current.writeRaw("{"));
  expect(result.current.unsavable).toContain("not JSON");
});

it("can be saved again from the controls, whatever was left in the raw view", () => {
  const {result} = draft();

  act(() => result.current.showRaw());
  act(() => result.current.writeRaw("{"));
  act(() => result.current.showControls());

  expect(result.current.unsavable).toBeUndefined();
});

it("puts another style in its place", () => {
  const {result} = draft();
  const other = {...classicStyle, surface: "#123456"};

  act(() => result.current.replace(other));

  expect(result.current.style).toBe(other);
});

it("shows the style put in place in the raw view, and forgets what was wrong with the text it replaces", () => {
  const {result} = draft();

  act(() => result.current.showRaw());
  act(() => result.current.writeRaw("{"));
  act(() => result.current.replace({...classicStyle, surface: "#123456"}));

  expect(JSON.parse(result.current.raw).surface).toBe("#123456");
  expect(result.current.rawRefusal).toBeUndefined();
});

it("goes back to the style it was started from, whatever has been changed since", () => {
  const {result} = draft();

  act(() => result.current.change(boardStyle => ({...boardStyle, surface: "#000000"})));
  act(() => result.current.replace({...classicStyle, surface: "#123456"}));
  act(() => result.current.reset());

  expect(result.current.style).toBe(classicStyle);
});

function draft(): RenderedDraft {
  return renderHook(() => useStyleDraft(classicStyle, boardFromText));
}
