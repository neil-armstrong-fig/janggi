import type {Opponent} from "@src/redux/game/types/Opponent";
import type {PlayedGame} from "@src/game/record/types/PlayedGame";
import {SETUPS} from "@src/game/setups/Setups";
import type {Setup} from "@src/game/setups/types/Setup";
import type {SetupPhase} from "@src/game/setups/types/SetupPhase";
import {botDutyFor} from "@src/react/pages/game/bot-duty/BotDutyFor";
import {dealtGame} from "@src/redux/game/dealing/DealtGame";
import {expect, it} from "vitest";
import {place} from "@src/game/setups/Place";
import {playMove} from "@src/game/record/PlayMove";
import {restTurn} from "@src/game/record/RestTurn";
import {setupPhaseFor} from "@src/game/setups/SetupPhaseFor";

const botAsHan: Opponent = {name: "Bot", botElo: 800, sideChoice: "Cho", playerSide: "cho"};
const botAsCho: Opponent = {name: "Bot", botElo: 800, sideChoice: "Han", playerSide: "han"};
const human: Opponent = {name: "Human", botElo: 800, sideChoice: "Cho", playerSide: "cho"};

const inner = setupNamed("Inner Elephant");

const scoredNobodyLaidOut: SetupPhase = setupPhaseFor("Scored");
const scoredHanLaidOut: SetupPhase = place(scoredNobodyLaidOut, "han", inner);
const casual: SetupPhase = place(place(setupPhaseFor("Casual"), "han", inner), "cho", inner);

it("has nothing to do in a game between two people at one device", () => {
  expect(botDutyFor(dealtGame(casual).played, casual, human)).toBeUndefined();
});

it("lays han out first in a scored game when it plays han", () => {
  expect(botDutyFor(dealtGame(scoredNobodyLaidOut).played, scoredNobodyLaidOut, botAsHan)).toEqual({
    kind: "layOut",
    side: "han",
    hanSetup: undefined,
  });
});

it("waits for han to lay out before answering as cho", () => {
  expect(botDutyFor(dealtGame(scoredNobodyLaidOut).played, scoredNobodyLaidOut, botAsCho)).toBeUndefined();
});

it("answers han's layout as cho, knowing what han laid out", () => {
  expect(botDutyFor(dealtGame(scoredHanLaidOut).played, scoredHanLaidOut, botAsCho)).toEqual({
    kind: "layOut",
    side: "cho",
    hanSetup: inner,
  });
});

it("does not lay out again once its own army has chosen, leaving the player to answer", () => {
  expect(botDutyFor(dealtGame(scoredHanLaidOut).played, scoredHanLaidOut, botAsHan)).toBeUndefined();
});

it("plays when its army is to move", () => {
  expect(botDutyFor(dealtGame(casual).played, casual, botAsCho)).toEqual({kind: "play"});
});

it("waits while the player's army is to move", () => {
  expect(botDutyFor(dealtGame(casual).played, casual, botAsHan)).toBeUndefined();
});

it("plays han's reply once cho has moved", () => {
  const played = playMove(dealtGame(casual).played, {from: {file: 1, rank: 7}, to: {file: 1, rank: 6}});

  expect(botDutyFor(played, casual, botAsHan)).toEqual({kind: "play"});
});

it("has nothing to do once the game is decided", () => {
  const settled: PlayedGame = restTurn(restTurn(dealtGame(casual).played));

  expect(botDutyFor(settled, casual, botAsCho)).toBeUndefined();
});

function setupNamed(name: string): Setup {
  const found = SETUPS.find(candidate => candidate.name === name);
  if (!found) throw new Error(`Setups.ts no longer exports a setup called "${name}"`);

  return found;
}
