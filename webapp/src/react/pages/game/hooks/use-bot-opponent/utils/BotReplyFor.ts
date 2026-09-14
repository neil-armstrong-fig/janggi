import type {BotDuty} from "@src/react/pages/game/types/BotDuty";
import type {BotElo} from "@janggi/shared/janggi/settings/BotElo";
import type {BotReply} from "@src/react/pages/game/hooks/use-bot-opponent/types/BotReply";
import type {BotTurn} from "@src/bot/types/BotTurn";
import type {Engine} from "@src/bot/engine/types/Engine";
import type {PlayedGame} from "@src/game/record/types/PlayedGame";
import type {Setup} from "@src/game/setups/types/Setup";
import type {Side} from "@janggi/shared/janggi/pieces/Side";
import type {UnknownAction} from "@reduxjs/toolkit";
import {bikjangCalled, choSetupChosen, hanSetupChosen, moved, passed} from "@src/redux/game/GameSlice";
import {botTurnFor} from "@src/bot/BotTurnFor";
import {tournamentSetupFor} from "@src/react/pages/game/hooks/use-bot-opponent/utils/TournamentSetupFor";

/**
 * What the bot does about the duty it has been handed, as the same store action a player's tap or
 * button would dispatch.
 *
 * Laying out, it picks a tournament arrangement at random. Playing, it asks `botTurnFor`, carrying in
 * the evaluation it reached last turn — except on a record with no turns in it yet, where that
 * evaluation belongs to a game that has gone.
 */
export async function botReplyFor(
  duty: BotDuty,
  engine: Engine,
  played: PlayedGame,
  elo: BotElo,
  evaluation: number | undefined,
): Promise<BotReply> {
  if (duty.kind === "layOut") {
    return {action: setupChosenFor(duty.side, tournamentSetupFor(Math.random())), evaluation: undefined};
  }

  const carried = played.past.length === 0 ? undefined : evaluation;
  const decision = await botTurnFor(engine, played, elo, carried);

  return {action: actionFor(decision.turn), evaluation: decision.evaluation};
}

function setupChosenFor(side: Side, setup: Setup): UnknownAction {
  return side === "han" ? hanSetupChosen(setup) : choSetupChosen(setup);
}

function actionFor(turn: BotTurn): UnknownAction {
  switch (turn.kind) {
    case "move":
      return moved(turn.move);
    case "pass":
      return passed();
    case "callBikjang":
      return bikjangCalled();
  }
}
