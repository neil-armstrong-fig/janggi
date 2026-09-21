import type {Engine} from "@src/bot/engine/types/Engine";
import {botAwaitsGoAhead} from "@src/react/pages/game/bot-duty/BotAwaitsGoAhead";
import {botDutyFor} from "@src/react/pages/game/bot-duty/BotDutyFor";
import {botEngineFailed} from "@src/redux/bot-engine/BotEngineSlice";
import {failureReasonOf} from "@src/react/pages/game/hooks/bot-failure/FailureReasonOf";
import {botReplyFor} from "@src/react/pages/game/hooks/use-bot-opponent/utils/BotReplyFor";
import {drawAnswerFor} from "@src/react/pages/game/hooks/use-bot-opponent/utils/DrawAnswerFor";
import {opponentOf} from "@src/game/utils/OpponentOf";
import {useAppDispatch, useAppSelector} from "@src/redux/Hooks";
import {useEffect, useRef} from "react";

/**
 * Plays the bot's side of the game whenever the game is waiting on it.
 *
 * What it is waiting for is `botDutyFor`, asked afresh whenever the record, the phase or the opponent
 * changes; what the bot does about it is `botReplyFor`'s to say. This only decides when the reply lands.
 *
 * **It never answers a position that has gone.** A deal, a new opponent or leaving the page cancels
 * the pending answer and tells the engine to stop, so a reply thought up for one game can never land
 * in the next — and a layout part-way through the openings it rates asks for none of the rest, which
 * would otherwise hold up the next game's searches behind them.
 *
 * **It holds the game's first move** while `botAwaitsGoAhead` says the player has not yet let the bot
 * start, so choosing to play Han is not what starts a rated game.
 *
 * **It asks nothing of the engine until the store says it is ready** (`useBotEngine` starts it), and a
 * search that fails or gets no answer is reported there too — as a bot that could not be started, with a
 * way to try again — rather than left as a bot that is thinking for good.
 *
 * A reply comes no sooner than `THINKS_FOR_AT_LEAST_MS` after the turn began, however quickly the
 * engine answered: a bottom-rung bot replying before the player's piece has finished landing reads as
 * the app playing both sides, not as an opponent.
 *
 * **It also answers a draw the player offers it**, after the same pause and for the same reason, from
 * what the engine last made of the position — `drawAnswerFor`. That is not a turn: nothing is searched,
 * and a move, a rested turn or an undo before the pause is over withdraws the offer and the answer with
 * it. It is a second effect rather than a duty because the game is not waiting on the bot's army, and
 * `botDutyFor` would close the board and grey the controls for as long as it did.
 */
export function useBotOpponent(engine: Engine): void {
  const {played, phase, opponent, botMayOpen, drawOffer} = useAppSelector(state => state.game);
  const engineStatus = useAppSelector(state => state.botEngine.status);
  const dispatch = useAppDispatch();
  const evaluationRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    if (opponent.name !== "Bot" || !drawOffer || drawOffer.declined) return;
    if (drawOffer.by === opponentOf(opponent.playerSide)) return;

    // The evaluation the bot last reached, as a turn carries it — belonging to this game only once
    // something has been played in it.
    const carried = played.past.length === 0 ? undefined : evaluationRef.current;
    const timer = setTimeout(() => {
      dispatch(drawAnswerFor(played.present, carried));
    }, THINKS_FOR_AT_LEAST_MS);

    return () => {
      clearTimeout(timer);
    };
  }, [drawOffer, played, opponent, dispatch]);

  useEffect(() => {
    const duty = botDutyFor(played, phase, opponent);
    if (!duty || botAwaitsGoAhead({played, phase, opponent, botMayOpen}) || engineStatus !== "ready") return;

    let cancelled = false;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const stopping = new AbortController();
    const startedAt = Date.now();

    botReplyFor(engine, {
      duty,
      played,
      elo: opponent.botElo,
      evaluation: evaluationRef.current,
      signal: stopping.signal,
    })
      .then(({action, evaluation}) => {
        if (cancelled) return;

        evaluationRef.current = evaluation;
        const remaining = Math.max(0, THINKS_FOR_AT_LEAST_MS - (Date.now() - startedAt));
        timer = setTimeout(() => {
          dispatch(action);
        }, remaining);
      })
      .catch((error: unknown) => {
        if (cancelled) return;

        console.error("The bot could not choose a move", error);
        dispatch(botEngineFailed(failureReasonOf(error)));
      });

    return () => {
      cancelled = true;
      clearTimeout(timer);
      stopping.abort();
      engine.stop();
    };
  }, [played, phase, opponent, botMayOpen, engineStatus, engine, dispatch]);
}

const THINKS_FOR_AT_LEAST_MS = 500;
