import type {Opponent} from "@src/redux/game/types/Opponent";
import {expect, it} from "vitest";
import {rewardFor} from "@src/react/pages/game/components/status/components/board-overlay/rewards/RewardFor";

const bot: Opponent = {name: "Bot", botElo: 800, sideChoice: "Cho", playerSide: "cho"};

it("earns a casual win against the bot its XP", () => {
  expect(rewardFor({kind: "won", by: "cho"}, bot, "Casual", 500)).toEqual({xp: 30, unlocked: []});
});

it("earns a loss on points the XP for seeing it through", () => {
  expect(rewardFor({kind: "wonOnPoints", by: "han"}, bot, "Scored", 500)?.xp).toBe(20);
});

it("earns a bikjang draw the XP for seeing it through", () => {
  expect(rewardFor({kind: "drawn"}, bot, "Casual", 500)?.xp).toBe(10);
});

it("names what the game's XP was enough to unlock", () => {
  expect(rewardFor({kind: "won", by: "cho"}, bot, "Scored", 60)).toEqual({
    xp: 40,
    unlocked: ["Hanja pieces", "Neon board"],
  });
});

it("names nothing the player had already unlocked before the game", () => {
  expect(rewardFor({kind: "won", by: "cho"}, bot, "Casual", 90)?.unlocked).toEqual([]);
});

it("earns nothing between two people", () => {
  expect(rewardFor({kind: "won", by: "cho"}, {...bot, name: "Human"}, "Casual", 500)).toBeUndefined();
});

it("earns nothing while the game goes on", () => {
  expect(rewardFor({kind: "toMove", side: "cho"}, bot, "Casual", 500)).toBeUndefined();
});
