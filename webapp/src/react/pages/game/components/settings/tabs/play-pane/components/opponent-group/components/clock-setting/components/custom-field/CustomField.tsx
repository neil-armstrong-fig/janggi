import type {FigureLimit} from "@src/redux/slices/clock/time-controls/types/FigureLimit";
import {isTypedFigureWithin} from "@src/react/pages/game/components/settings/tabs/play-pane/components/opponent-group/components/clock-setting/components/custom-field/typed-figure/IsTypedFigureWithin";
import {useState} from "react";

/**
 * One figure of a format written out: a label over a number.
 *
 * What is being typed is held here while it is typed, so "3" on the way to "30" is not corrected from under a thumb, and
 * only a figure within its limits reaches the store until the field is left. Leaving it hands over what was typed, which
 * the store brings within its limits; leaving it blank goes back to what it held.
 */
interface Props {
  readonly testId: string;
  readonly label: string;
  readonly value: number;
  readonly limit: FigureLimit;
  readonly disabled: boolean;
  readonly onChange: (value: number) => void;
}

export function CustomField({testId, label, value, limit, disabled, onChange}: Props): React.JSX.Element {
  const [typed, setTyped] = useState<string | undefined>(undefined);

  return (
    <label className="flex min-w-0 flex-1 flex-col gap-1 text-xs font-medium text-white/60">
      {label}

      <input
        data-testid={testId}
        type="number"
        inputMode="numeric"
        min={limit.min}
        max={limit.max}
        value={typed ?? value}
        disabled={disabled}
        onChange={event => {
          setTyped(event.target.value);

          if (isTypedFigureWithin(event.target.value, limit)) onChange(Number(event.target.value));
        }}
        onBlur={() => {
          if (typed) onChange(Number(typed));

          setTyped(undefined);
        }}
        className="w-full min-w-0 rounded-xl bg-black/25 px-3 py-2 text-base text-white/90 tabular-nums select-text disabled:opacity-50"
      />
    </label>
  );
}
