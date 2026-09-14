import {clsx} from "clsx";

/**
 * The brackets in the four corners of a point the last move went between.
 *
 * In the corners because nothing else in a cell stays uncovered: a set may draw a piece at up to 0.94
 * of the cell, so anything under the piece that arrived is hidden by it. The cell draws this over its
 * piece rather than under it so an octagonal set's corners cannot hide it either. `LastMoveStyle` has
 * the rest of the reasoning.
 *
 * Drawn with borders in their own elements rather than in the cell's `<svg>`, which is
 * `preserveAspectRatio="none"` and would draw the two arms of each bracket at different thicknesses.
 * Each bracket is square, so its arms are the same length on a cell wider than it is tall.
 */
interface Props {
  /** Any CSS colour, from the board style. */
  readonly colour: string;
}

export function LastMoveMark({colour}: Props): React.JSX.Element {
  return (
    <span className="pointer-events-none absolute inset-[5%]">
      {CORNERS.map(corner => (
        <span
          key={corner}
          className={clsx("absolute block h-[30%]", corner)}
          style={{aspectRatio: 1, borderColor: colour}}
        />
      ))}
    </span>
  );
}

/** Written out whole, so Tailwind finds every class. */
const CORNERS: readonly string[] = [
  "top-0 left-0 rounded-tl-[3px] border-t-[3px] border-l-[3px]",
  "top-0 right-0 rounded-tr-[3px] border-t-[3px] border-r-[3px]",
  "bottom-0 left-0 rounded-bl-[3px] border-b-[3px] border-l-[3px]",
  "right-0 bottom-0 rounded-br-[3px] border-r-[3px] border-b-[3px]",
];
