/** A few characters of a style, typed — what a piece has written on it. */
interface Props {
  /** What the test id is built from: `style-control-<id>`. */
  readonly id: string;
  readonly label: string;
  readonly value: string;
  readonly maxLength: number;
  readonly onChange: (text: string) => void;
}

export function TextField({id, label, value, maxLength, onChange}: Props): React.JSX.Element {
  return (
    <div className="flex items-center gap-2">
      <span className="w-28 shrink-0 text-xs text-white/70">{label}</span>

      <input
        type="text"
        data-testid={`style-control-${id}`}
        aria-label={label}
        value={value}
        maxLength={maxLength}
        spellCheck={false}
        onChange={event => {
          // A piece with nothing written on it is not a style the check would take.
          if (event.target.value !== "") onChange(event.target.value);
        }}
        className="h-9 w-24 rounded-lg bg-black/25 px-2 text-center text-base text-white/90"
      />
    </div>
  );
}
