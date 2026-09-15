import type {GameSliceState} from "@src/redux/game/types/GameSliceState";
import type {Move} from "@src/game/types/Move";
import {SETUPS} from "@src/game/setups/Setups";
import type {Setup} from "@src/game/setups/types/Setup";
import type {UnknownAction} from "@reduxjs/toolkit";
import {botAwaitsGoAhead} from "@src/react/pages/game/bot-duty/BotAwaitsGoAhead";
import {
  botLetOpen,
  choSetupChosen,
  formatChosen,
  gameReducer,
  hanSetupChosen,
  moved,
  opponentChosen,
  restarted,
  sideChosen,
} from "@src/redux/game/GameSlice";
import {expect, it} from "vitest";
import {firstGame} from "@src/redux/game/first-game/FirstGame";

const CHO_OPENING: Move = {from: {file: 1, rank: 7}, to: {file: 1, rank: 6}};

it("holds cho's first move when the bot plays cho", () => {
  expect(botAwaitsGoAhead(dealt(opponentChosen("Bot"), sideChosen("Han")))).toBe(true);
});

it("holds it no longer once the player lets the bot start", () => {
  expect(botAwaitsGoAhead(dealt(opponentChosen("Bot"), sideChosen("Han"), botLetOpen()))).toBe(false);
});

it("holds nothing when the first move is the player's own", () => {
  expect(botAwaitsGoAhead(dealt(opponentChosen("Bot")))).toBe(false);
});

it("holds nothing once a move has been played, the game being under way", () => {
  expect(botAwaitsGoAhead(dealt(opponentChosen("Bot"), moved(CHO_OPENING)))).toBe(false);
});

it("holds nothing in a game between two people at one device", () => {
  expect(botAwaitsGoAhead(dealt(sideChosen("Han")))).toBe(false);
});

it("lets the bot lay out a scored game unasked, and holds only the move after it", () => {
  const hanLaidOut = dealt(
    formatChosen("Scored"),
    opponentChosen("Bot"),
    sideChosen("Han"),
    hanSetupChosen(setupNamed("Inner Elephant")),
  );

  expect(botAwaitsGoAhead(hanLaidOut)).toBe(false);
  expect(botAwaitsGoAhead(gameReducer(hanLaidOut, choSetupChosen(setupNamed("Inner Elephant"))))).toBe(true);
});

it("holds the first move of every new game again", () => {
  const letOpen = dealt(opponentChosen("Bot"), sideChosen("Han"), botLetOpen());

  expect(botAwaitsGoAhead(gameReducer(letOpen, restarted()))).toBe(true);
});

function dealt(...actions: readonly UnknownAction[]): GameSliceState {
  return actions.reduce(gameReducer, firstGame());
}

function setupNamed(name: string): Setup {
  const found = SETUPS.find(candidate => candidate.name === name);
  if (!found) throw new Error(`Setups.ts no longer exports a setup called "${name}"`);

  return found;
}
