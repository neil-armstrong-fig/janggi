import {useAppDispatch, useAppSelector} from "@src/redux/Hooks";
import {BOT_STRENGTH_OPTIONS} from "@src/react/pages/game/components/settings/tabs/game-pane/utils/OpponentOptions";
import {OptionPicker} from "@src/react/pages/game/components/settings/components/option-picker/OptionPicker";
import {botStrengthChosen} from "@src/redux/game/GameSlice";
import {lockBehindBot} from "@src/react/pages/game/components/settings/tabs/game-pane/components/bot-settings/components/bot-strength-setting/locks/LockBehindBot";
import {playHasBegun} from "@src/react/pages/game/utils/PlayHasBegun";

/**
 * How strongly the bot plays. Dealt, and locked once play has begun; closed altogether between two people.
 *
 * **Each strength is earned** from the one beneath it, on the ladder being played — that army, in that
 * format. A locked strength is still listed, naming the rung beneath it, so a player sees the cascade for
 * themselves: `lockBehindBot`.
 */
export function BotStrengthSetting(): React.JSX.Element {
  const {played, phase, opponent} = useAppSelector(state => state.game);
  const beaten = useAppSelector(state => state.progress.beaten);
  const dispatch = useAppDispatch();

  return (
    <OptionPicker
      id="bot-strength"
      disabled={playHasBegun(played) || opponent.name !== "Bot"}
      label="Bot strength"
      ariaLabel="How strongly the bot plays, as an Elo rating"
      options={BOT_STRENGTH_OPTIONS}
      selected={BOT_STRENGTH_OPTIONS.find(option => option.elo === opponent.botElo)}
      lockedReason={option => lockBehindBot(option.elo, beaten, phase.format, opponent.sideChoice)}
      onSelect={option => dispatch(botStrengthChosen(option.elo))}
    />
  );
}
