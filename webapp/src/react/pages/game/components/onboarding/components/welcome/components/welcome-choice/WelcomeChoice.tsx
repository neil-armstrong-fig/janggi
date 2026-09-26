import {clsx} from "clsx";

interface Props<Name extends string> {
  /** What is being chosen, as the player reads it. */
  readonly label: string;
  /** What its buttons' test ids begin with, after `welcome-`. */
  readonly testId: string;
  readonly names: readonly Name[];
  readonly selected: Name;
  readonly onSelect: (name: Name) => void;
}

/** One question of the welcome's second screen, answered by pressing one of its named buttons. */
export function WelcomeChoice<Name extends string>({
  label,
  testId,
  names,
  selected,
  onSelect,
}: Props<Name>): React.JSX.Element {
  return (
    <div role="group" aria-label={label} className="flex items-center justify-between gap-3">
      <span className="text-sm text-white/80">{label}</span>

      <div className="flex shrink-0 gap-1">
        {names.map(name => (
          <button
            key={name}
            type="button"
            data-testid={`welcome-${testId}-${name.toLowerCase()}`}
            aria-pressed={name === selected}
            onClick={() => onSelect(name)}
            className={clsx(
              "min-w-16 cursor-pointer rounded-lg px-3 py-2 text-sm",
              name === selected && "bg-gold font-semibold text-ink",
              name !== selected && "bg-white/10 text-white/80 hover:bg-white/20",
            )}
          >
            {name}
          </button>
        ))}
      </div>
    </div>
  );
}
