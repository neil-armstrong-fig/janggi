import {botStrengthChosen, formatChosen} from "@src/redux/game/GameSlice";
import {useAppDispatch, useAppSelector} from "@src/redux/Hooks";
import {MATCH_FORMAT_OPTIONS} from "@src/react/pages/game/components/settings/tabs/play-pane/components/match-format-setting/utils/MatchFormats";
import {MatchFormatExplanation} from "@src/react/pages/game/components/settings/tabs/play-pane/components/match-format-setting/components/match-format-explanation/MatchFormatExplanation";
import {OptionPicker} from "@src/react/pages/game/components/settings/components/option-picker/OptionPicker";
import {useWithAFriend} from "@src/react/pages/game/components/settings/tabs/play-pane/hooks/use-with-a-friend/UseWithAFriend";
import {playHasBegun} from "@src/react/pages/game/utils/PlayHasBegun";
import {strengthToFallBackTo} from "@src/react/pages/game/components/settings/tabs/play-pane/locks/StrengthToFallBackTo";
import {useMessages} from "@src/react/pages/game/hooks/use-messages/UseMessages";

/**
 * Which of janggi's two games is being played.
 *
 * Beside the setups rather than beside the board style, because it is not a preference about how the game
 * is drawn: it decides whether a bikjang may be called at all and whether one draws. Like a back rank it
 * is settled before play, so it locks once play has begun. Its two names say nothing to a player who has
 * not read the rules, so it carries a (?) that unfolds `MatchFormatExplanation`, and that answers even once
 * the format is locked.
 *
 * The two formats are climbed apart, so choosing the other one can leave the bot set above what the player
 * has reached there — and drops it to the strongest bot open, rather than locking the format.
 */
export function MatchFormatSetting(): React.JSX.Element {
  const {played, phase, opponent} = useAppSelector(state => state.game);
  const withAFriend = useWithAFriend();
  const beaten = useAppSelector(state => state.progress.beaten);
  const dispatch = useAppDispatch();
  const {play} = useMessages();

  return (
    <OptionPicker
      id="match-format"
      disabled={playHasBegun(played) || withAFriend}
      label={play.format}
      ariaLabel="Which of janggi's two games is being played"
      options={MATCH_FORMAT_OPTIONS}
      labelOf={option => play.formatNames[option.name]}
      selected={{name: phase.format}}
      explanation={<MatchFormatExplanation />}
      onSelect={option => {
        const fallBackTo = strengthToFallBackTo({
          beaten,
          format: option.name,
          choice: opponent.sideChoice,
          botElo: opponent.botElo,
        });
        if (fallBackTo !== undefined) dispatch(botStrengthChosen(fallBackTo));

        dispatch(formatChosen(option.name));
      }}
    />
  );
}
