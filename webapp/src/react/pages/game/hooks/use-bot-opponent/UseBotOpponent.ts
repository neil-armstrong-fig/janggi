import type {Engine} from "@src/bot/engine/types/Engine";
import {botDutyFor} from "@src/react/pages/game/bot-duty/BotDutyFor";
import {botReplyFor} from "@src/react/pages/game/hooks/use-bot-opponent/utils/BotReplyFor";
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
 * in the next.
 *
 * A reply comes no sooner than `THINKS_FOR_AT_LEAST_MS` after the turn began, however quickly the
 * engine answered: a bottom-rung bot replying before the player's piece has finished landing reads as
 * the app playing both sides, not as an opponent.
 */
export function useBotOpponent(engine: Engine): void {
  const {played, phase, opponent} = useAppSelector(state => state.game);
  const dispatch = useAppDispatch();
  const evaluationRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    const duty = botDutyFor(played, phase, opponent);
    if (!duty) return;

    let cancelled = false;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const startedAt = Date.now();

    botReplyFor(duty, engine, played, opponent.botElo, evaluationRef.current)
      .then(({action, evaluation}) => {
        if (cancelled) return;

        evaluationRef.current = evaluation;
        const remaining = Math.max(0, THINKS_FOR_AT_LEAST_MS - (Date.now() - startedAt));
        timer = setTimeout(() => {
          dispatch(action);
        }, remaining);
      })
      .catch((error: unknown) => {
        console.error("The bot could not choose a move", error);
      });

    return () => {
      cancelled = true;
      clearTimeout(timer);
      if (duty.kind === "play") engine.stop();
    };
  }, [played, phase, opponent, engine, dispatch]);
}

const THINKS_FOR_AT_LEAST_MS = 500;
