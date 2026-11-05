import {CLOCK_STORAGE_KEY} from "@src/redux/clock/storage/ClockStorageKey";
import {FIRST_CLOCK} from "@src/redux/clock/first-clock/FirstClock";
import type {GameSliceState} from "@src/redux/game/types/GameSliceState";
import {drawAccepted, drawOffered, gameReducer, moved, opponentChosen} from "@src/redux/game/GameSlice";
import {expect, it} from "vitest";
import {firstGame} from "@src/redux/game/first-game/FirstGame";
import {loadClock} from "@src/redux/clock/storage/LoadClock";

const NOT_BEGUN = gameReducer(firstGame(), opponentChosen("Human"));
const UNDER_WAY = gameReducer(NOT_BEGUN, moved({from: {file: 1, rank: 7}, to: {file: 1, rank: 6}}));
const DRAWN = [drawOffered(), drawAccepted()].reduce(gameReducer, UNDER_WAY);
const AGAINST_THE_BOT = {...UNDER_WAY, opponent: {...UNDER_WAY.opponent, name: "Bot"}} satisfies GameSliceState;

const ALL_OF_IT = {freeMs: 300_000, periods: 3};
const FIVE_MINUTES = {name: "5 min", formatWhenOn: "5 min", custom: FIRST_CLOCK.custom};
const LEFT_RUNNING = {...FIVE_MINUTES, armies: {cho: ALL_OF_IT, han: ALL_OF_IT}, turnStartedAt: 1000};

it("is the first clock where nothing has been kept", () => {
  expect(loadClock({getItem: () => null}, UNDER_WAY)).toEqual(FIRST_CLOCK);
});

it("is the first clock where what was kept is not one", () => {
  expect(loadClock(holding("five minutes"), UNDER_WAY)).toEqual(FIRST_CLOCK);
});

it("is the first clock where what was kept is null", () => {
  expect(loadClock(holding(null), UNDER_WAY)).toEqual(FIRST_CLOCK);
});

it("falls back on each thing that was chosen by itself", () => {
  const clock = loadClock(holding({name: "An hour", formatWhenOn: "20 min", custom: "long"}), NOT_BEGUN);

  expect(clock.name).toBe(FIRST_CLOCK.name);
  expect(clock.formatWhenOn).toBe("20 min");
  expect(clock.custom).toEqual(FIRST_CLOCK.custom);
});

it("takes a format written out only within the limits", () => {
  const custom = {minutes: 999, periodSeconds: 40, periods: 5};

  expect(loadClock(holding({custom}), NOT_BEGUN).custom).toEqual({minutes: 180, periodSeconds: 40, periods: 5});
});

it.each(["minutes", "periodSeconds", "periods"])(
  "refuses a format written out with %s that are not a number",
  figure => {
    const custom = {minutes: 7, periodSeconds: 40, periods: 5, [figure]: "7"};

    expect(loadClock(holding({custom}), NOT_BEGUN).custom).toEqual(FIRST_CLOCK.custom);
  },
);

it("has no time to keep with the clock off, and remembers what it would turn on", () => {
  const off = {name: "Off", formatWhenOn: "20 min", custom: {minutes: 7, periodSeconds: 40, periods: 5}};

  expect(loadClock(holding({...off, armies: {cho: ALL_OF_IT, han: ALL_OF_IT}}), UNDER_WAY)).toEqual(off);
});

it("gives all the time to a game with no move played, whatever was kept", () => {
  const spent = {freeMs: 1000, periods: 1};

  expect(loadClock(holding({...LEFT_RUNNING, armies: {cho: spent, han: spent}}), NOT_BEGUN)).toEqual({
    ...FIVE_MINUTES,
    armies: {cho: ALL_OF_IT, han: ALL_OF_IT},
  });
});

it("never brings back when a turn started, so the time away is not charged", () => {
  expect(loadClock(holding({...LEFT_RUNNING, leftAt: 21_000}), UNDER_WAY).turnStartedAt).toBeUndefined();
});

it("holds what the turn had spent when the page was left", () => {
  expect(loadClock(holding({...LEFT_RUNNING, leftAt: 21_000}), UNDER_WAY).heldMs).toBe(20_000);
});

it("charges none of the turn to a page killed with no warning", () => {
  expect(loadClock(holding(LEFT_RUNNING), UNDER_WAY).heldMs).toBe(0);
});

it("charges none of the turn for a stamp from before it began", () => {
  expect(loadClock(holding({...LEFT_RUNNING, leftAt: 500}), UNDER_WAY).heldMs).toBe(0);
});

it("charges none of the turn for a stamp that is not a time", () => {
  expect(loadClock(holding({...LEFT_RUNNING, leftAt: "later"}), UNDER_WAY).heldMs).toBe(0);
});

it("charges none of the turn for a start that is not a time", () => {
  const leftRunning = {...LEFT_RUNNING, turnStartedAt: "earlier", leftAt: 21_000};

  expect(loadClock(holding(leftRunning), UNDER_WAY).heldMs).toBe(0);
});

it("still holds the same after another reload while it waits", () => {
  const waiting = {...FIVE_MINUTES, armies: {cho: ALL_OF_IT, han: ALL_OF_IT}, heldMs: 20_000};

  expect(loadClock(holding(waiting), UNDER_WAY).heldMs).toBe(20_000);
});

it("refuses a held time below nothing", () => {
  const waiting = {...FIVE_MINUTES, armies: {cho: ALL_OF_IT, han: ALL_OF_IT}, heldMs: -20_000};

  expect(loadClock(holding(waiting), UNDER_WAY).heldMs).toBe(0);
});

it("waits for a game under way that has time but no turn being timed", () => {
  const armies = {cho: ALL_OF_IT, han: ALL_OF_IT};

  expect(loadClock(holding({...FIVE_MINUTES, armies}), UNDER_WAY)).toEqual({...FIVE_MINUTES, armies, heldMs: 0});
});

it("brings back what each army has banked", () => {
  const armies = {cho: {freeMs: 200_000, periods: 3}, han: {freeMs: 0, periods: 2}};

  expect(loadClock(holding({...LEFT_RUNNING, armies}), UNDER_WAY).armies).toEqual(armies);
});

it("flags an army whose turn had already run out when the page was left", () => {
  const armies = {cho: ALL_OF_IT, han: {freeMs: 10_000, periods: 0}};
  const clock = loadClock(holding({...LEFT_RUNNING, armies, leftAt: 11_000}), UNDER_WAY);

  expect(clock.armies).toEqual({cho: ALL_OF_IT, han: {freeMs: 0, periods: 0}});
  expect(clock.heldMs).toBeUndefined();
});

it("does not flag an army with a moment left on its turn", () => {
  const armies = {cho: ALL_OF_IT, han: {freeMs: 10_000, periods: 0}};

  expect(loadClock(holding({...LEFT_RUNNING, armies, leftAt: 10_999}), UNDER_WAY).heldMs).toBe(9999);
});

it("keeps a game lost on time lost, with nothing waiting", () => {
  const armies = {cho: ALL_OF_IT, han: {freeMs: 0, periods: 0}};

  expect(loadClock(holding({...FIVE_MINUTES, armies}), UNDER_WAY)).toEqual({...FIVE_MINUTES, armies});
});

it("has nothing waiting once the game is over, and keeps the final clocks", () => {
  const armies = {cho: ALL_OF_IT, han: {freeMs: 100_000, periods: 3}};

  expect(loadClock(holding({...FIVE_MINUTES, armies}), DRAWN)).toEqual({...FIVE_MINUTES, armies});
});

it("has nothing waiting against the bot, and keeps the format for the next game with a person", () => {
  const armies = {cho: ALL_OF_IT, han: ALL_OF_IT};

  expect(loadClock(holding({...FIVE_MINUTES, armies}), AGAINST_THE_BOT)).toEqual({...FIVE_MINUTES, armies});
});

it.each([
  ["more free time than the format gives", {freeMs: 300_001, periods: 3}],
  ["free time below nothing", {freeMs: -1, periods: 3}],
  ["free time that is not a number", {freeMs: "all", periods: 3}],
  ["more periods than the format gives", {freeMs: 1000, periods: 4}],
  ["periods below nothing", {freeMs: 1000, periods: -1}],
  ["part of a period", {freeMs: 1000, periods: 1.5}],
  ["no clock at all", undefined],
])("turns the clock off under a game where an army has %s, keeping what was chosen", (_case, han) => {
  const clock = loadClock(holding({...LEFT_RUNNING, armies: {cho: ALL_OF_IT, han}}), UNDER_WAY);

  expect(clock).toEqual({name: "Off", formatWhenOn: "5 min", custom: FIRST_CLOCK.custom});
});

function holding(value: unknown): Pick<Storage, "getItem"> {
  return {getItem: key => (key === CLOCK_STORAGE_KEY ? JSON.stringify(value) : null)};
}
