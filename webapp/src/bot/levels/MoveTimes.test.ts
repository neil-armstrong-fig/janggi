import {BOT_ELOS} from "@janggi/shared/janggi/settings/BotElo";
import {MOVE_TIMES_MS} from "@src/bot/levels/MoveTimes";
import {expect, it} from "vitest";

it("thinks for longer at every rung it climbs", () => {
  const times = BOT_ELOS.map(elo => MOVE_TIMES_MS[elo]);

  expect(times).toEqual([...times].sort((a, b) => a - b));
  expect(new Set(times).size).toBe(times.length);
});

it("never keeps a player waiting more than three seconds for a move", () => {
  expect(Math.max(...BOT_ELOS.map(elo => MOVE_TIMES_MS[elo]))).toBeLessThanOrEqual(3_000);
});
