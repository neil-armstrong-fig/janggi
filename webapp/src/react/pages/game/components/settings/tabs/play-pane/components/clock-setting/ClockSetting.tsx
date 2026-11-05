import {CLOCK_POSES} from "@src/redux/clock/types/ClockPose";
import {TIME_CONTROL_NAMES} from "@janggi/shared/janggi/settings/TimeControlName";
import type {TimeControlName} from "@janggi/shared/janggi/settings/TimeControlName";
import {clockPosed, customTimeControlWritten, timeControlChosen} from "@src/redux/clock/ClockSlice";
import {ClockExplanation} from "@src/react/pages/game/components/settings/tabs/play-pane/components/clock-setting/components/clock-explanation/ClockExplanation";
import {CustomField} from "@src/react/pages/game/components/settings/tabs/play-pane/components/clock-setting/components/custom-field/CustomField";
import {OptionPicker} from "@src/react/pages/game/components/settings/components/option-picker/OptionPicker";
import {useAppDispatch, useAppSelector} from "@src/redux/Hooks";
import {useWithAFriend} from "@src/react/pages/game/components/settings/tabs/play-pane/hooks/use-with-a-friend/UseWithAFriend";

/**
 * The clock for a game between two people at one device: off, a format on offer, or one written out. Laid out only for
 * those two people, as `FlipBoardSetting` is, and it stays in the page, only hidden.
 *
 * **Preview is scaffolding.** Nothing runs yet, so it stands the clocks in each state worth judging, and goes once they
 * run. Only a build with `IN_DEVELOPMENT` draws any of this, so its words stay here in English until release.
 */
export function ClockSetting(): React.JSX.Element {
  const isHuman = useAppSelector(state => state.game.opponent.name === "Human");
  const withAFriend = useWithAFriend();
  const {name, custom, pose} = useAppSelector(state => state.clock);
  const dispatch = useAppDispatch();

  return (
    <div data-testid="unreleased-clock-setting" hidden={!isHuman || withAFriend} className="flex flex-col gap-2">
      <OptionPicker
        id="unreleased-clock"
        label="Clock"
        options={TIME_CONTROL_OPTIONS}
        labelOf={option => LABELS[option.name]}
        selected={{name}}
        explanation={<ClockExplanation />}
        onSelect={option => dispatch(timeControlChosen(option.name))}
      />

      {name === "Custom" && (
        <div className="flex gap-2">
          <CustomField
            testId="unreleased-clock-custom-minutes"
            label="Minutes"
            value={custom.minutes}
            min={0}
            max={180}
            onChange={minutes => dispatch(customTimeControlWritten({...custom, minutes}))}
          />

          <CustomField
            testId="unreleased-clock-custom-period-seconds"
            label="Seconds a period"
            value={custom.periodSeconds}
            min={5}
            max={120}
            onChange={periodSeconds => dispatch(customTimeControlWritten({...custom, periodSeconds}))}
          />

          <CustomField
            testId="unreleased-clock-custom-periods"
            label="Periods"
            value={custom.periods}
            min={0}
            max={60}
            onChange={periods => dispatch(customTimeControlWritten({...custom, periods}))}
          />
        </div>
      )}

      {name !== "Off" && (
        <OptionPicker
          id="unreleased-clock-pose"
          label="Preview"
          options={POSE_OPTIONS}
          selected={{name: pose}}
          onSelect={option => dispatch(clockPosed(option.name))}
        />
      )}
    </div>
  );
}

const TIME_CONTROL_OPTIONS = TIME_CONTROL_NAMES.map(name => ({name}));

const POSE_OPTIONS = CLOCK_POSES.map(name => ({name}));

const LABELS: Record<TimeControlName, string> = {
  Off: "Off",
  "5 min": "5 min + 30s ×3",
  "10 min": "10 min + 30s ×3",
  "20 min": "20 min + 30s ×3",
  Custom: "Custom",
};
