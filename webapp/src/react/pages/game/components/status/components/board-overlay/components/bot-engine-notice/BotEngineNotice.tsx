import type {BotEngineSliceState} from "@src/redux/bot-engine/types/BotEngineSliceState";
import {clsx} from "clsx";
import {SvgIcon} from "@src/react/pages/game/components/svg-icon/SvgIcon";
import {useMessages} from "@src/react/pages/game/hooks/use-messages/UseMessages";

/**
 * Over the board while the bot's engine is not up: that it is being loaded, or that it could not be
 * started, and why, with the one button that tries again. `botEngineHoldsPlay` has why the game waits on
 * it at all — a first move made against an engine that never came would begin a rated game with nobody
 * to answer.
 *
 * It covers the board and takes every tap, which is what keeps the pieces beneath it out of reach; the
 * board is closed anyway, and this is what says why. **The words are late on purpose.** An engine that is
 * ready within a fraction of a second — the usual case, since it starts loading when the bot is chosen —
 * should not flash a notice at the player, so a loading notice fades in only after 400ms (the delay in its
 * animation class), while the cover is there from the first moment. A failure says so at once.
 */
interface Props {
  readonly botEngine: BotEngineSliceState;
  readonly onRetry: () => void;
}

export function BotEngineNotice({botEngine, onRetry}: Props): React.JSX.Element {
  const {overlays} = useMessages();
  const failed = botEngine.status === "failed";

  return (
    <div data-testid="bot-engine-notice" className="absolute inset-0 z-20 flex items-center justify-center">
      {/* Keyed by what it says, so the fade starts over when loading gives way to a failure. */}
      <div
        key={failed ? "failed" : "loading"}
        className={clsx(
          "rounded-2xl border border-wood/40 bg-ground/85 px-6 py-3 text-center shadow-2xl shadow-black backdrop-blur-sm",
          failed && "animate-[notice-in_250ms_ease-out_both]",
          !failed && "animate-[notice-in_250ms_ease-out_400ms_both]",
        )}
      >
        {!failed && (
          <p
            data-testid="bot-engine-loading"
            role="status"
            className="flex items-center justify-center gap-2 text-sm font-semibold tracking-wide text-white/90"
          >
            <span
              aria-hidden="true"
              className="size-4 rounded-full border-2 border-wood/30 border-t-wood motion-safe:animate-spin"
            />
            {overlays.wakingTheBot}
          </p>
        )}

        {failed && (
          <>
            <p className="text-sm font-semibold tracking-wide text-white/90">
              <span role="img" aria-label="Bot">
                🤖
              </span>{" "}
              {overlays.botCouldNotStart}
            </p>

            <p data-testid="bot-engine-reason" className="mt-0.5 max-w-xs text-xs text-white/60">
              {botEngine.reason}
            </p>

            <button
              type="button"
              data-testid="bot-engine-retry"
              onClick={onRetry}
              className="mt-3 flex h-10 w-full cursor-pointer items-center justify-center gap-1.5 rounded-xl bg-wood px-5 text-sm font-semibold tracking-wide text-ink uppercase shadow transition-[transform,background-color] duration-150 hover:bg-wood/90 active:scale-[0.97] motion-reduce:transition-none"
            >
              <SvgIcon className="h-4 w-4">
                <path d="M20 12a8 8 0 1 1-2.5-5.8M20 4v5h-5" />
              </SvgIcon>
              {overlays.tryAgain}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
