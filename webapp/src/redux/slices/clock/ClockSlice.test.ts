import {
  clockDealt,
  clockReducer,
  clockStarted,
  customTimeControlWritten,
  timeControlChosen,
  timeRanOut,
  turnCharged,
} from "@src/redux/slices/clock/ClockSlice";
import {expect, it} from "vitest";
import {firstGame} from "@src/redux/slices/game/first-game/FirstGame";
import {friendGameDealt} from "@src/redux/slices/online/actions/FriendGameDealt";
import {localGameRestored} from "@src/redux/slices/online/actions/LocalGameRestored";

const FRESH_FIVE_MINUTES = {cho: {freeMs: 300_000, periods: 3}, han: {freeMs: 300_000, periods: 3}};
const CHOSEN = clockReducer(undefined, timeControlChosen("5 min"));
const RUNNING = clockReducer(CHOSEN, clockStarted(1000));

it("keeps the last format chosen while the clock is off", () => {
  const off = clockReducer(clockReducer(CHOSEN, timeControlChosen("20 min")), timeControlChosen("Off"));

  expect(off.formatWhenOn).toBe("20 min");
});

it("keeps the last format chosen through a friend game turning the clock off", () => {
  expect(clockReducer(CHOSEN, {type: friendGameDealt.type}).formatWhenOn).toBe("5 min");
});

it("gives neither army any time while the clock is off", () => {
  expect(clockReducer(undefined, {type: "unknown"}).armies).toBeUndefined();
});

it("deals both armies the time of the format chosen, with no clock running", () => {
  const chosen = clockReducer(RUNNING, timeControlChosen("10 min"));

  expect(chosen.armies?.cho).toEqual({freeMs: 600_000, periods: 3});
  expect(chosen.turnStartedAt).toBeUndefined();
});

it("takes the time away again when the clock is turned off", () => {
  expect(clockReducer(CHOSEN, timeControlChosen("Off")).armies).toBeUndefined();
});

it("keeps a format written out within its limits, and deals its time", () => {
  const custom = clockReducer(undefined, timeControlChosen("Custom"));
  const written = clockReducer(custom, customTimeControlWritten({minutes: 0, periodSeconds: 999, periods: 0}));

  expect(written.custom).toEqual({minutes: 0, periodSeconds: 120, periods: 1});
  expect(written.armies?.han).toEqual({freeMs: 0, periods: 1});
});

it("runs from when it was started", () => {
  expect(RUNNING.turnStartedAt).toBe(1000);
});

it("charges a turn to the army that took it", () => {
  const charged = clockReducer(RUNNING, turnCharged({side: "cho", at: 2000, runsOn: true}));

  expect(charged.armies).toEqual({...FRESH_FIVE_MINUTES, cho: {freeMs: 299_000, periods: 3}});
  expect(charged.turnStartedAt).toBe(2000);
});

it("deals the time afresh, with no clock running, when a game is dealt", () => {
  const charged = clockReducer(RUNNING, turnCharged({side: "cho", at: 2000, runsOn: true}));
  const dealt = clockReducer(charged, clockDealt());

  expect(dealt.armies).toEqual(FRESH_FIVE_MINUTES);
  expect(dealt.turnStartedAt).toBeUndefined();
});

it("leaves an army nothing, and stops, when its time runs out", () => {
  const flagged = clockReducer(RUNNING, timeRanOut("han"));

  expect(flagged.armies).toEqual({...FRESH_FIVE_MINUTES, han: {freeMs: 0, periods: 0}});
  expect(flagged.turnStartedAt).toBeUndefined();
});

it.each([
  ["a format is chosen", timeControlChosen("20 min")],
  ["a format is written out", customTimeControlWritten({minutes: 7, periodSeconds: 40, periods: 5})],
  ["a game is dealt", clockDealt()],
  ["the clock is started", clockStarted(1000)],
])("lets go of what it held waiting to be resumed when %s", (_case, action) => {
  expect(clockReducer({...CHOSEN, heldMs: 20_000}, action).heldMs).toBeUndefined();
});

it("turns off for a game with a friend, and for a game restored after one", () => {
  const game = firstGame();
  const dealt = clockReducer(RUNNING, {type: friendGameDealt.type});
  const restored = clockReducer(RUNNING, localGameRestored(game));

  expect(dealt).toMatchObject({name: "Off", armies: undefined, turnStartedAt: undefined});
  expect(restored).toMatchObject({name: "Off", armies: undefined, turnStartedAt: undefined});
});
