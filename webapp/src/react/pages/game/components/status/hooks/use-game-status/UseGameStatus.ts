import type {LiveStatus} from "@src/react/pages/game/components/status/hooks/use-game-status/types/LiveStatus";
import {botAwaitsGoAhead} from "@src/react/pages/game/bot-duty/BotAwaitsGoAhead";
import {botDutyFor} from "@src/react/pages/game/bot-duty/BotDutyFor";
import {botEngineHoldsPlay} from "@src/react/pages/game/bot-duty/BotEngineHoldsPlay";
import {gameStatusOf} from "@src/react/pages/game/components/status/utils/GameStatusOf";
import {useAppSelector} from "@src/redux/Hooks";

/**
 * What the game is doing right now, as every part of the frame around the board needs to know it: what the
 * position says, and whether the board is waiting on the bot.
 *
 * Each part asks this for itself rather than being handed it, so nothing at the top of the frame threads it
 * down — and the plaques, the herald, the controls and the overlay all get the same answer, because they
 * ask the same question in the same place. It is derived from the store on every render and none of it is
 * stored, the way `GameStatusOf.ts` says a fact the engine can work out should be.
 *
 * Not unit tested itself: it is a composition of `gameStatusOf`, `botDutyFor`, `botAwaitsGoAhead` and
 * `botEngineHoldsPlay`, each tested beside it, and the parts that read it are covered by the acceptance specs.
 */
export function useGameStatus(): LiveStatus {
  const game = useAppSelector(state => state.game);
  const botEngine = useAppSelector(state => state.botEngine);

  return {
    status: gameStatusOf(game.played.present, game.phase),
    botsTurn: botDutyFor(game.played, game.phase, game.opponent) !== undefined,
    awaitingGoAhead: botAwaitsGoAhead(game),
    engineHoldsPlay: botEngineHoldsPlay(game.played, game.opponent, botEngine.status),
    botEngine,
  };
}
