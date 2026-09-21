import type {BotEngineStatus} from "@src/redux/bot-engine/types/BotEngineStatus";
import type {Opponent} from "@src/redux/game/types/Opponent";
import type {PlayedGame} from "@src/game/record/types/PlayedGame";
import {botEngineHoldsPlay} from "@src/react/pages/game/bot-duty/BotEngineHoldsPlay";
import {dealtGame} from "@src/redux/game/dealing/DealtGame";
import {expect, it} from "vitest";
import {place} from "@src/game/setups/Place";
import {restTurn} from "@src/game/record/RestTurn";
import {SETUPS} from "@src/game/setups/Setups";
import {setupPhaseFor} from "@src/game/setups/SetupPhaseFor";

const bot: Opponent = {name: "Bot", botElo: 800, sideChoice: "Cho", playerSide: "cho"};
const human: Opponent = {name: "Human", botElo: 800, sideChoice: "Cho", playerSide: "cho"};

const NOT_READY: readonly BotEngineStatus[] = ["idle", "loading", "failed"];

it.each(NOT_READY)("holds a game against the bot while the engine is %s", status => {
  expect(botEngineHoldsPlay(newGame(), bot, status)).toBe(true);
});

it("holds nothing once the engine is ready", () => {
  expect(botEngineHoldsPlay(newGame(), bot, "ready")).toBe(false);
});

it.each(NOT_READY)("holds nothing in a game between two people, whatever the engine is doing (%s)", status => {
  expect(botEngineHoldsPlay(newGame(), human, status)).toBe(false);
});

it("holds nothing once the game is decided, there being no move left to wait for", () => {
  const settled: PlayedGame = restTurn(restTurn(newGame()));

  expect(botEngineHoldsPlay(settled, bot, "failed")).toBe(false);
});

function newGame(): PlayedGame {
  const inner = SETUPS.find(candidate => candidate.name === "Inner Elephant");
  if (!inner) throw new Error('Setups.ts no longer exports a setup called "Inner Elephant"');

  const arranged = place(place(setupPhaseFor("Casual"), "han", inner), "cho", inner);

  return dealtGame(arranged).played;
}
