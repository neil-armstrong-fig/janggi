import {clsx} from "clsx";

/**
 * One choice among a few, as buttons in a row — a shape, a kind of mark — so every option is in sight and
 * a tap changes it. A value that is none of the options, which a style written by hand may have, leaves
 * none pressed.
 */
interface Props<Option extends string> {
  /** What the test ids are built from: `style-control-<id>-<option>`. */
  readonly id: string;
  readonly label: string;
  readonly options: readonly Option[];
  readonly value: Option | undefined;
  readonly onChange: (option: Option) => void;
}

export function ChoiceField<Option extends string>({
  id,
  label,
  options,
  value,
  onChange,
}: Props<Option>): React.JSX.Element {
  return (
    <div className="flex items-center gap-2">
      <span className="w-28 shrink-0 text-xs text-white/70">{label}</span>

      <div role="group" aria-label={label} className="flex min-w-0 flex-1 gap-1 rounded-lg bg-black/25 p-1">
        {options.map(option => (
          <button
            key={option}
            type="button"
            data-testid={`style-control-${id}-${option}`}
            aria-pressed={value === option}
            onClick={() => onChange(option)}
            className={clsx(
              "h-8 min-w-0 flex-1 cursor-pointer rounded-md px-2 text-xs capitalize transition-colors duration-150 motion-reduce:transition-none",
              value === option ? "bg-wood font-semibold text-ink" : "text-white/70 hover:bg-white/10",
            )}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
}
