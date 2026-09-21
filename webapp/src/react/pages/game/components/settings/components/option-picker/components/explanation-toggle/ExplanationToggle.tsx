import {clsx} from "clsx";

interface Props {
  readonly pickerId: string;
  /** The label of the picker being explained, which the button is read out as asking about. */
  readonly label: string;
  readonly expanded: boolean;
  /** The id of the explanation this unfolds. */
  readonly controls: string;
  readonly onToggle: () => void;
}

/**
 * The (?) beside a picker's label, which unfolds what its options mean and folds it away again.
 *
 * Drawn small so it sits quietly in the label row, but reaching a thumb-sized target through an
 * out-of-flow pseudo-element centred on it, so the row is no taller for it. Filled while unfolded, so
 * the question that opened the explanation reads as the thing that will close it.
 */
export function ExplanationToggle({pickerId, label, expanded, controls, onToggle}: Props): React.JSX.Element {
  return (
    <button
      type="button"
      data-testid={`${pickerId}-explain`}
      aria-label={`What each ${label.toLowerCase()} means`}
      aria-expanded={expanded}
      aria-controls={controls}
      onClick={onToggle}
      className="relative flex cursor-pointer items-center justify-center after:absolute after:size-10"
    >
      <span
        aria-hidden
        className={clsx(
          "flex h-5 w-5 items-center justify-center rounded-full border text-[11px] leading-none font-semibold transition-colors duration-150 motion-reduce:transition-none",
          expanded ? "border-wood bg-wood text-ink" : "border-white/30 text-white/60",
        )}
      >
        ?
      </span>
    </button>
  );
}
