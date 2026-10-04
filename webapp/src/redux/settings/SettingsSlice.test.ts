import {expect, it} from "vitest";
import {
  settingsReducer,
  settingsTabSelected,
  sheetClosed,
  sheetOpened,
  signInPrompted,
} from "@src/redux/settings/SettingsSlice";

const initial = settingsReducer(undefined, {type: "@@init"});

it("starts with no sheet up, on the first tab", () => {
  expect(initial).toEqual({openSheet: undefined, tab: "Play", accountHighlighted: false, showings: 0});
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

  expect(again).toMatchObject({openSheet: "settings", tab: "Sound", accountHighlighted: false});
});

it("opens the settings on the You tab with the account picked out when sign-in is asked for", () => {
  const prompted = settingsReducer(initial, signInPrompted());

  expect(prompted).toMatchObject({openSheet: "settings", tab: "You", accountHighlighted: true});
});

it("stops picking out the account once the sheet is closed, or another tab or sheet is chosen", () => {
  const prompted = settingsReducer(initial, signInPrompted());

  expect(settingsReducer(prompted, sheetClosed()).accountHighlighted).toBe(false);
  expect(settingsReducer(prompted, settingsTabSelected("Play")).accountHighlighted).toBe(false);
  expect(settingsReducer(prompted, sheetOpened("record")).accountHighlighted).toBe(false);
});

it("counts every time a sheet or a tab is asked for, and not a sheet being closed", () => {
  const opened = settingsReducer(initial, sheetOpened("settings"));
  const turned = settingsReducer(opened, settingsTabSelected("You"));

  expect(turned.showings).toBe(2);
  expect(settingsReducer(turned, sheetClosed()).showings).toBe(2);
  expect(settingsReducer(turned, signInPrompted()).showings).toBe(3);
});
