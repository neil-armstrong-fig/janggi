/** One figure of a format written out: a label over a number. */
interface Props {
  readonly testId: string;
  readonly label: string;
  readonly value: number;
  readonly min: number;
  readonly max: number;
  readonly onChange: (value: number) => void;
}

export function CustomField({testId, label, value, min, max, onChange}: Props): React.JSX.Element {
  return (
    <label className="flex min-w-0 flex-1 flex-col gap-1 text-xs font-medium text-white/60">
      {label}

      <input
        data-testid={testId}
        type="number"
        inputMode="numeric"
        min={min}
        max={max}
        value={value}
        onChange={event => onChange(Number(event.target.value))}
        className="w-full min-w-0 rounded-xl bg-black/25 px-3 py-2 text-base text-white/90 tabular-nums select-text"
      />
    </label>
  );
}
