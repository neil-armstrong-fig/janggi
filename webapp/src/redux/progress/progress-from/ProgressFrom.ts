import type {BeatenBySide, BeatenElos, ProgressSliceState} from "@src/redux/progress/types/ProgressSliceState";
import {BOT_ELOS} from "@janggi/shared/janggi/settings/BotElo";
import {isAmong} from "@src/redux/untrusted/IsAmong";
import {isFiniteNumber} from "@src/redux/untrusted/IsFiniteNumber";
import {isObject} from "@src/redux/untrusted/IsObject";

/**
 * Progress read from outside the app — the device's storage, a save key a player has pasted, or a debug
 * message — or undefined where what was read is not an object at all.
 *
 * Checked field by field like everything else read from outside, and kept as narrowly as it fails: bad XP
 * leaves the ladders, a ladder that is not a list leaves the other three, and one strength the app does
 * not offer leaves the rest. But **it is generous about how much**. Any amount of XP is taken as it
 * stands, however large, because editing it by hand is a way to the last theme that the game leaves open
 * on purpose. What it refuses is XP that is not an amount of XP at all — negative, a string, NaN.
 *
 * A strength named on a ladder whose lower rungs are missing is kept as it is read; what it *opens* is
 * `openBotElos`'s to say, and it says a ladder climbs no higher than its first missing rung.
 */
export function progressFrom(value: unknown): ProgressSliceState | undefined {
  if (!isObject(value)) return undefined;

  const beaten = isObject(value["beaten"]) ? value["beaten"] : {};

  return {
    xp: xpFrom(value["xp"]),
    beaten: {Casual: laddersFrom(beaten["Casual"]), Scored: laddersFrom(beaten["Scored"])},
  };
}

function xpFrom(value: unknown): number {
  return isFiniteNumber(value) && value >= 0 ? Math.min(Math.floor(value), Number.MAX_SAFE_INTEGER) : 0;
}

function laddersFrom(value: unknown): BeatenBySide {
  const sides = isObject(value) ? value : {};

  return {cho: beatenFrom(sides["cho"]), han: beatenFrom(sides["han"])};
}

function beatenFrom(value: unknown): BeatenElos {
  if (!Array.isArray(value)) return [];

  const elos = value.flatMap((elo: unknown) => (isAmong(BOT_ELOS, elo) ? [elo] : []));

  return [...new Set(elos)];
}
