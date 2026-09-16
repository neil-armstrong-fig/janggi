import type {BotReply} from "@src/react/pages/game/hooks/use-bot-opponent/types/BotReply";
import type {BotTurn} from "@src/bot/types/BotTurn";
import type {Engine} from "@src/bot/engine/types/Engine";
import type {ReplyQuestion} from "@src/react/pages/game/hooks/use-bot-opponent/types/ReplyQuestion";
import type {Setup} from "@src/game/setups/types/Setup";
import type {Side} from "@janggi/shared/janggi/pieces/Side";
import type {UnknownAction} from "@reduxjs/toolkit";
import {bikjangCalled, choSetupChosen, hanSetupChosen, moved, passed} from "@src/redux/game/GameSlice";
import {botSetupFor} from "@src/bot/BotSetupFor";
import {botTurnFor} from "@src/bot/BotTurnFor";

/**
 * What the bot does about the duty it has been handed, as the same store action a player's tap or
 * button would dispatch.
 *
 * Laying out, it asks `botSetupFor`, which has the engine rate the openings each arrangement comes to.
 * Playing, it asks `botTurnFor`, carrying in the evaluation it reached last turn — except on a record
 * with no turns in it yet, where that evaluation belongs to a game that has gone.
 */
export async function botReplyFor(
  engine: Engine,
  {duty, played, elo, evaluation, signal}: ReplyQuestion,
): Promise<BotReply> {
  if (duty.kind === "layOut") {
    const {side, hanSetup} = duty;
    const setup = await botSetupFor(engine, {side, hanSetup, elo, roll: Math.random(), signal});

    return {action: setupChosenFor(side, setup), evaluation: undefined};
  }

  const carried = played.past.length === 0 ? undefined : evaluation;
  const decision = await botTurnFor(engine, {played, elo, evaluation: carried});

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
