import type {NumberRange} from "@src/styles/limits/types/NumberRange";
import {clampedTo} from "@src/styles/limits/ClampedTo";
import {useState} from "react";

/**
 * One number of a style, on a slider held to the range a style may use it in, with the number itself to
 * type. A number typed past the range is brought back into it, so the style can never be given a value the
 * check on an imported style would refuse.
 */
interface Props {
  /** What the test id is built from: `style-control-<id>` is the number, `style-control-<id>-slider` the slider. */
  readonly id: string;
  readonly label: string;
  readonly numberRange: NumberRange;
  readonly step: number;
  readonly value: number;
  readonly onChange: (value: number) => void;
}

export function SliderField({id, label, numberRange, step, value, onChange}: Props): React.JSX.Element {
  // What is being typed, while it is not yet a number worth keeping — "0." on the way to "0.5".
  const [typed, setTyped] = useState<string | undefined>(undefined);

  return (
    <div className="flex items-center gap-2">
      <span className="w-28 shrink-0 text-xs text-white/70">{label}</span>

      <input
        type="range"
        data-testid={`style-control-${id}-slider`}
        aria-label={label}
        min={numberRange.least}
        max={numberRange.most}
        step={step}
        value={value}
        onChange={event => {
          setTyped(undefined);
          onChange(clampedTo(numberRange, Number(event.target.value)));
        }}
        className="h-9 min-w-0 flex-1 cursor-pointer accent-wood"
      />

      <input
        type="number"
        data-testid={`style-control-${id}`}
        aria-label={`${label}, as a number`}
        min={numberRange.least}
        max={numberRange.most}
        step={step}
        value={typed ?? value}
        onChange={event => {
          const raw = event.target.value;
          const typedValue = Number(raw);
          if (raw === "" || !Number.isFinite(typedValue)) {
            setTyped(raw);
            return;
          }

          const kept = clampedTo(numberRange, typedValue);
          setTyped(kept === typedValue ? raw : undefined);
          onChange(kept);
        }}
        onBlur={() => setTyped(undefined)}
        className="h-9 w-20 shrink-0 rounded-lg bg-black/25 px-2 text-right text-sm text-white/90"
      />
    </div>
  );
}
