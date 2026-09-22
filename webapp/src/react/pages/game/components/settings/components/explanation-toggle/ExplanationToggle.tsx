import {clsx} from "clsx";

interface Props {
  readonly testId: string;
  /** What the button is read out as asking — "What each format means". */
  readonly ariaLabel: string;
  readonly expanded: boolean;
  /** The id of the explanation this unfolds. */
  readonly controls: string;
  readonly onToggle: () => void;
}

/**
 * The (?) beside a label in the sheet, which unfolds what it means and folds it away again.
 *
 * Drawn small so it sits quietly in the label row, but reaching a thumb-sized target through an
 * out-of-flow pseudo-element centred on it, so the row is no taller for it. Filled while unfolded, so
 * the question that opened the explanation reads as the thing that will close it.
 *
 * Shared by a picker's label and by the progress prose, which is why it takes what it is read out as
 * rather than working it out from a picker.
 */
export function ExplanationToggle({testId, ariaLabel, expanded, controls, onToggle}: Props): React.JSX.Element {
  return (
    <button
      type="button"
      data-testid={testId}
      aria-label={ariaLabel}
      aria-expanded={expanded}
      aria-controls={controls}
      onClick={onToggle}
      className="relative flex cursor-pointer items-center justify-center after:absolute after:size-10"
    >
      <span
        aria-hidden
        className={clsx(
          "flex h-5 w-5 items-center justify-center rounded-full border text-[11px] leading-none font-semibold transition-colors duration-150 motion-reduce:transition-none",
          expanded && "border-wood bg-wood text-ink",
          !expanded && "border-white/30 text-white/60",
        )}
      >
        ?
      </span>
    </button>
  );
}
