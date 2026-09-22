import {clsx} from "clsx";

/** Whether a style has one of its optional parts — a marker on the point, an inlay in the piece — as an on and off button. */
interface Props {
  /** What the test id is built from: `style-control-<id>`. */
  readonly id: string;
  readonly label: string;
  readonly value: boolean;
  readonly onChange: (value: boolean) => void;
}

export function SwitchField({id, label, value, onChange}: Props): React.JSX.Element {
  return (
    <div className="flex items-center gap-2">
      <span className="w-28 shrink-0 text-xs text-white/70">{label}</span>

      <button
        type="button"
        role="switch"
        data-testid={`style-control-${id}`}
        aria-checked={value}
        aria-label={label}
        onClick={() => onChange(!value)}
        className={clsx(
          "h-8 w-16 cursor-pointer rounded-lg text-xs font-semibold transition-colors duration-150 motion-reduce:transition-none",
          value && "bg-wood text-ink",
          !value && "bg-black/25 text-white/60 hover:bg-white/10",
        )}
      >
        {value ? "On" : "Off"}
      </button>
    </div>
  );
}
