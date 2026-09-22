import {clsx} from "clsx";

/**
 * The way into choosing a setting for each army apart — a plain switch under the one picker, since
 * nearly every player wants the same for both and should not have to think about it. Turned on it
 * changes nothing on the board: each army starts in whatever both were wearing.
 *
 * Shared by the board and piece-set pickers rather than living under either, since both need it.
 */
interface Props {
  /** Prefixes the `data-testid`, as the picker beside it is prefixed — `piece-style`, `board-style`. */
  readonly id: string;
  readonly split: boolean;
  /** What is being chosen apart, said in full — "Different pieces for each army", "Different board for each army". */
  readonly label: string;
  readonly onToggle: () => void;
}

export function ArmySplitToggle({id, split, label, onToggle}: Props): React.JSX.Element {
  return (
    <button
      type="button"
      data-testid={`${id}-split`}
      aria-pressed={split}
      onClick={onToggle}
      className={clsx(
        "flex h-9 cursor-pointer items-center gap-2 self-start rounded-lg px-2 text-xs transition-colors duration-150 motion-reduce:transition-none",
        split ? "bg-wood/20 text-wood" : "text-white/60 hover:bg-white/10",
      )}
    >
      <span aria-hidden>{split ? "☑" : "☐"}</span>
      {label}
    </button>
  );
}
