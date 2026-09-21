import type {Side} from "@janggi/shared/janggi/pieces/Side";
import {sideName} from "@src/react/pages/game/utils/SideNames";

/**
 * A note across the top of the board saying the draw on offer was turned down — for as long as it is
 * true, which is until the next thing that happens in the game. Against the bot above all, whose answer
 * comes with no warning: an offer that simply vanished would read as the app ignoring the player.
 *
 * At the top edge for the reason `RepetitionNotice` is, and nothing here takes a tap.
 */
interface Props {
  /** The army that turned the offer down. */
  readonly decliner: Side;
  /** The army the bot is playing, so the refusal can be put in its mouth, or undefined between two people. */
  readonly botSide: Side | undefined;
}

export function DrawDeclinedNote({decliner, botSide}: Props): React.JSX.Element {
  const who = decliner === botSide ? "The bot" : sideName(decliner);

  return (
    <div
      data-testid="draw-declined"
      data-declined-by={decliner}
      role="status"
      className="pointer-events-none absolute inset-x-2 top-2 z-20 flex justify-center"
    >
      <p className="max-w-sm rounded-xl border border-white/15 bg-ground/85 px-3 py-1.5 text-center text-xs leading-snug text-white/80 shadow-lg shadow-black backdrop-blur-sm">
        {who} declined the draw. The game carries on.
      </p>
    </div>
  );
}
