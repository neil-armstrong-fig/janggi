import type {Side} from "@janggi/shared/janggi/pieces/Side";
import {sideName} from "@src/react/pages/game/utils/SideNames";

/**
 * Over the board while the bot holds the game's first move: that the bot's army moves first, that
 * nothing is settled until it does, and the one button that lets it. `botAwaitsGoAhead` has why the bot
 * waits at all — choosing a side against it should not be what starts a rated game.
 *
 * Only the button takes a tap. The board beneath is closed anyway, the move being the bot's.
 */
interface Props {
  readonly botSide: Side;
  readonly onGoAhead: () => void;
}

export function BotGoAhead({botSide, onGoAhead}: Props): React.JSX.Element {
  return (
    <div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center">
      <div className="rounded-2xl border border-wood/40 bg-ground/85 px-6 py-3 text-center shadow-2xl shadow-black backdrop-blur-sm">
        <p className="text-sm font-semibold tracking-wide text-white/90">
          <span role="img" aria-label="Bot">
            🤖
          </span>{" "}
          The bot plays {sideName(botSide)}, which moves first
        </p>

        <p className="mt-0.5 text-xs text-white/60">The settings stay open until it does.</p>

        <button
          type="button"
          data-testid="bot-go-ahead"
          onClick={onGoAhead}
          className="pointer-events-auto mt-3 h-10 w-full cursor-pointer rounded-xl bg-wood px-5 text-sm font-semibold tracking-wide text-ink uppercase shadow transition-[transform,background-color] duration-150 hover:bg-wood/90 active:scale-[0.97] motion-reduce:transition-none"
        >
          Let the bot start
        </button>
      </div>
    </div>
  );
}
