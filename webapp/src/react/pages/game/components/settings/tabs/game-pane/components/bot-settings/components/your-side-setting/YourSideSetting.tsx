import {botStrengthChosen, sideChosen} from "@src/redux/game/GameSlice";
import {useAppDispatch, useAppSelector} from "@src/redux/Hooks";
import {OptionPicker} from "@src/react/pages/game/components/settings/components/option-picker/OptionPicker";
import {SIDE_CHOICE_OPTIONS} from "@src/react/pages/game/components/settings/tabs/game-pane/utils/OpponentOptions";
import {playHasBegun} from "@src/react/pages/game/utils/PlayHasBegun";
import {strengthToFallBackTo} from "@src/react/pages/game/components/settings/tabs/game-pane/locks/StrengthToFallBackTo";

/**
 * Which army the player takes against the bot: Cho, Han, or Random, settled when the game is dealt.
 * Closed between two people, and locked once play has begun.
 *
 * Each army climbs its own ladder, so taking the other one can leave the bot set above what that army has
 * reached — and drops it to the strongest bot open there, rather than locking the army.
 */
export function YourSideSetting(): React.JSX.Element {
  const {played, phase, opponent} = useAppSelector(state => state.game);
  const beaten = useAppSelector(state => state.progress.beaten);
  const dispatch = useAppDispatch();

  return (
    <OptionPicker
      id="your-side"
      disabled={playHasBegun(played) || opponent.name !== "Bot"}
      label="Your side"
      ariaLabel="Which army you play against the bot"
      options={SIDE_CHOICE_OPTIONS}
      selected={{name: opponent.sideChoice}}
      onSelect={option => {
        const fallBackTo = strengthToFallBackTo({
          beaten,
          format: phase.format,
          choice: option.name,
          botElo: opponent.botElo,
        });
        if (fallBackTo !== undefined) dispatch(botStrengthChosen(fallBackTo));

        dispatch(sideChosen(option.name));
      }}
    />
  );
}
