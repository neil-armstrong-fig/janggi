import type {Engine} from "@src/bot/engine/types/Engine";
import {botEngineFailed, botEngineLoading, botEngineReady} from "@src/redux/bot-engine/BotEngineSlice";
import {failureReasonOf} from "@src/react/pages/game/hooks/bot-failure/FailureReasonOf";
import {useAppDispatch, useAppSelector} from "@src/redux/Hooks";
import {useEffect, useState} from "react";

/**
 * Starts the bot's engine once the bot is the opponent and the page has settled, and says in the store
 * how that goes.
 *
 * The engine used to start on the first search, which put its download, its compile and its threads
 * between the player's first move and the bot's answer — and left no way to tell a bot that was thinking
 * from one that was never coming. Started when the bot is chosen it is usually ready before the first
 * move, and where it is not, `botEngineHoldsPlay` closes the board and the herald says why.
 *
 * **It waits `SETTLES_AFTER_MS` after the page opens before starting anything.** The app ships against the
 * bot, so the bot is the opponent on most first visits — and starting an engine is not cheap: a wasm module
 * to compile and up to four threads. A player who swaps to a person straight away, or opens the settings,
 * should not pay for it, and the first paint should not share the device with it. A player takes longer than
 * that to make a first move, so the engine is still ready in time. Once the page has settled, choosing the
 * bot, or asking to try again, starts it at once.
 *
 * **Retrying is the store going back to `idle`**, which is where a game against the bot begins: this
 * starts the engine whenever it finds the bot chosen and the engine idle, so the button that asks to try
 * again needs nothing but to say so. `engine.prepare` starts afresh after a failure and is otherwise
 * idempotent, so a second call while the first is under way just waits on it.
 */
export function useBotEngine(engine: Engine): void {
  const opponentName = useAppSelector(state => state.game.opponent.name);
  const status = useAppSelector(state => state.botEngine.status);
  const dispatch = useAppDispatch();
  const [settled, setSettled] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setSettled(true);
    }, SETTLES_AFTER_MS);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  useEffect(() => {
    if (!settled || opponentName !== "Bot" || status !== "idle") return;

    dispatch(botEngineLoading());
    engine.prepare().then(
      () => {
        dispatch(botEngineReady());
      },
      (error: unknown) => {
        dispatch(botEngineFailed(failureReasonOf(error)));
      },
    );
  }, [settled, opponentName, status, engine, dispatch]);
}

/** How long the page has to itself before the engine is started — well inside the time a first move takes. */
const SETTLES_AFTER_MS = 1_500;
