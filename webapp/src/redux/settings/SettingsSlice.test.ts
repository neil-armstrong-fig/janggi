import {expect, it} from "vitest";
import {settingsReducer, settingsTabSelected, sheetClosed, sheetOpened} from "@src/redux/settings/SettingsSlice";

const initial = settingsReducer(undefined, {type: "@@init"});

it("starts with no sheet up, on the first tab", () => {
  expect(initial).toEqual({openSheet: undefined, tab: "Game"});
});

it("raises the sheet it is asked for, and puts it away again", () => {
  const up = settingsReducer(initial, sheetOpened("settings"));

  expect(up.openSheet).toBe("settings");
  expect(settingsReducer(up, sheetClosed()).openSheet).toBeUndefined();
});

it("puts away the sheet that was up when another is opened", () => {
  const record = settingsReducer(settingsReducer(initial, sheetOpened("settings")), sheetOpened("record"));

  expect(record.openSheet).toBe("record");
});

it("keeps the tab it was turned to through the sheet being closed and opened again", () => {
  const turned = settingsReducer(settingsReducer(initial, sheetOpened("settings")), settingsTabSelected("Sound"));
  const again = settingsReducer(settingsReducer(turned, sheetClosed()), sheetOpened("settings"));

  expect(again).toEqual({openSheet: "settings", tab: "Sound"});
});
