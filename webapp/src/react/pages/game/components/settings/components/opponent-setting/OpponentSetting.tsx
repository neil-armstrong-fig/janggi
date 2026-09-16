import {useAppDispatch, useAppSelector} from "@src/redux/Hooks";
import {OPPONENT_OPTIONS} from "@src/react/pages/game/components/settings/utils/OpponentOptions";
import {OptionPicker} from "@src/react/pages/game/components/settings/components/option-picker/OptionPicker";
import {opponentChosen} from "@src/redux/game/GameSlice";
import {playHasBegun} from "@src/react/pages/game/utils/PlayHasBegun";

/**
 * Who plays the other army: someone else at the same device, or the bot. Part of the game rather than a
 * preference, so it is dealt and locks once play has begun.
 *
 * The bot needs the page cross-origin isolated (`docs/bot.md`). Where the browser will not isolate it, the
 * picker is closed — unless the bot is already chosen, so a player is never stuck on it — and a line says
 * why.
 */
export function OpponentSetting(): React.JSX.Element {
  const {played, opponent} = useAppSelector(state => state.game);
  const dispatch = useAppDispatch();

  const againstBot = opponent.name === "Bot";
  const botAvailable = globalThis.crossOriginIsolated;

  return (
    <>
      <OptionPicker
        id="opponent"
        disabled={playHasBegun(played) || (!botAvailable && !againstBot)}
        label="Opponent"
        ariaLabel="Who plays the other army"
        options={OPPONENT_OPTIONS}
        selected={{name: opponent.name}}
        onSelect={option => dispatch(opponentChosen(option.name))}
      />

      {!botAvailable && (
        <p className="-mt-1 text-xs text-white/50">
          This browser cannot run the bot: it needs a cross-origin isolated page.
        </p>
      )}
    </>
  );
}
