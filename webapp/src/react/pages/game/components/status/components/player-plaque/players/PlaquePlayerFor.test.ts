import type {Opponent} from "@src/redux/game/types/Opponent";
import {expect, it} from "vitest";
import {plaquePlayerFor} from "@src/react/pages/game/components/status/components/player-plaque/players/PlaquePlayerFor";

const theBot: Opponent = {name: "Bot", botElo: 1400, sideChoice: "Cho", playerSide: "cho"};

it("names nobody between two people at one device", () => {
  expect(plaquePlayerFor("cho", {...theBot, name: "Human"}, 1200, 640)).toBeUndefined();
  expect(plaquePlayerFor("han", {...theBot, name: "Human"}, 1200, 640)).toBeUndefined();
});

it("names the bot, at the strength it plays at, on the bot's army", () => {
  expect(plaquePlayerFor("han", theBot, 1200, 640)).toEqual({kind: "bot", elo: 1400});
});

it("names the player, their rating and their XP, on their own army", () => {
  expect(plaquePlayerFor("cho", theBot, 1200, 640)).toMatchObject({kind: "player", elo: 1200, xp: 640});
});

it("names the next unlock past the player's XP", () => {
  expect(plaquePlayerFor("cho", theBot, 1200, 640)).toMatchObject({
    nextUnlock: {xp: 1_200, labels: ["Celadon theme"]},
  });
});

it("names no next unlock once everything is open", () => {
  expect(plaquePlayerFor("cho", theBot, 1200, 2_000_000)).toMatchObject({nextUnlock: undefined});
});
