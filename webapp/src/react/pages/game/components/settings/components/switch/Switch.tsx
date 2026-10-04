import {clsx} from "clsx";

/**
 * An on-or-off preference, drawn as a switch with its label beside it. `aria-pressed` carries the state,
 * which is what the acceptance tests read.
 */
interface Props {
  readonly testId: string;
  readonly label: string;
  readonly on: boolean;
  readonly onToggle: () => void;
}

export function Switch({testId, label, on, onToggle}: Props): React.JSX.Element {
  return (
    <button
      type="button"
      data-testid={testId}
      aria-pressed={on}
      onClick={onToggle}
      className={clsx(
        "flex h-9 cursor-pointer items-center gap-3 self-start rounded-lg px-2 text-xs transition-colors duration-150 motion-reduce:transition-none",
        on && "text-wood",
        !on && "text-white/60 hover:bg-white/10",
      )}
    >
      <span
        aria-hidden
        className={clsx(
          "flex h-5 w-9 shrink-0 items-center rounded-full px-0.5 transition-colors duration-150 motion-reduce:transition-none",
          on && "bg-wood",
          !on && "bg-black/40",
        )}
      >
        <span
          className={clsx(
            "h-4 w-4 rounded-full transition-transform duration-150 motion-reduce:transition-none",
            on && "translate-x-4 bg-ink",
            !on && "translate-x-0 bg-white/60",
          )}
        />
      </span>

      {label}
    </button>
  );
}
