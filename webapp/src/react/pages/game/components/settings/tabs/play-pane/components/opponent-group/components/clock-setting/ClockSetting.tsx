import {TIME_CONTROL_LIMITS} from "@src/redux/clock/time-controls/TimeControlLimits";
import {TIME_CONTROL_FORMATS} from "@janggi/shared/janggi/settings/TimeControlName";
import {customTimeControlWritten, timeControlChosen} from "@src/redux/clock/ClockSlice";
import {ClockExplanation} from "@src/react/pages/game/components/settings/tabs/play-pane/components/opponent-group/components/clock-setting/components/clock-explanation/ClockExplanation";
import {CustomField} from "@src/react/pages/game/components/settings/tabs/play-pane/components/opponent-group/components/clock-setting/components/custom-field/CustomField";
import {OptionPicker} from "@src/react/pages/game/components/settings/components/option-picker/OptionPicker";
import {ExplainedSwitch} from "@src/react/pages/game/components/settings/tabs/play-pane/components/explained-switch/ExplainedSwitch";
import {useAppDispatch, useAppSelector} from "@src/redux/Hooks";
import {useMessages} from "@src/react/pages/game/hooks/use-messages/UseMessages";
import {playHasBegun} from "@src/react/pages/game/utils/PlayHasBegun";
import {useWithAFriend} from "@src/react/pages/game/components/settings/tabs/play-pane/hooks/use-with-a-friend/UseWithAFriend";

/**
 * The clock for a game between two people at one device: a switch, and only with it on, a format on offer or one written
 * out, so a game with no clock has one line in a busy tab. Laid out only for those two people, as `FlipBoardSetting` is,
 * and it stays in the page, only hidden. It locks once play has begun, as the setup pickers do, so nobody's time changes
 * under them.
 */
export function ClockSetting(): React.JSX.Element {
  const isHuman = useAppSelector(state => state.game.opponent.name === "Human");
  const withAFriend = useWithAFriend();
  const {name, formatWhenOn, custom} = useAppSelector(state => state.clock);
  const locked = useAppSelector(state => playHasBegun(state.game.played));
  const dispatch = useAppDispatch();
  const {clock} = useMessages();
  const on = name !== "Off";

  return (
    <div
      data-testid="clock-setting"
      hidden={!isHuman || withAFriend}
      className="flex flex-col gap-2 border-t border-wood/25 pt-3"
    >
      <ExplainedSwitch
        id="clock"
        label={clock.label}
        on={on}
        disabled={locked}
        explanation={<ClockExplanation />}
        onToggle={() => dispatch(timeControlChosen(on ? "Off" : formatWhenOn))}
      />

      {on && (
        <OptionPicker
          id="clock"
          label={clock.formatLabel}
          options={TIME_CONTROL_OPTIONS}
          labelOf={option => clock.formats[option.name]}
          selected={{name}}
          disabled={locked}
          onSelect={option => dispatch(timeControlChosen(option.name))}
        />
      )}

      {name === "Custom" && (
        <div className="flex gap-2">
          <CustomField
            testId="clock-custom-minutes"
            label={clock.minutes}
            value={custom.minutes}
            disabled={locked}
            limit={TIME_CONTROL_LIMITS.minutes}
            onChange={minutes => dispatch(customTimeControlWritten({...custom, minutes}))}
          />

          <CustomField
            testId="clock-custom-period-seconds"
            label={clock.secondsAPeriod}
            value={custom.periodSeconds}
            disabled={locked}
            limit={TIME_CONTROL_LIMITS.periodSeconds}
            onChange={periodSeconds => dispatch(customTimeControlWritten({...custom, periodSeconds}))}
          />

          <CustomField
            testId="clock-custom-periods"
            label={clock.periods}
            value={custom.periods}
            disabled={locked}
            limit={TIME_CONTROL_LIMITS.periods}
            onChange={periods => dispatch(customTimeControlWritten({...custom, periods}))}
          />
        </div>
      )}
    </div>
  );
}

const TIME_CONTROL_OPTIONS = TIME_CONTROL_FORMATS.map(name => ({name}));
