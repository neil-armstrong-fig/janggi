import type {MovableEmphasis} from "@src/react/pages/game/components/board/components/intersections/types/MovableEmphasis";
import type {HintsStyle} from "@src/styles/types/board-marks/HintsStyle";
import {tintOf} from "@src/react/pages/game/components/board/utils/TintOf";

/**
 * The mark on a piece its owner may move this turn: a ring standing just outside it.
 *
 * Outside rather than behind, and a line rather than a fill. A disc behind the piece was the first
 * attempt and it failed on the modern sets, whose pieces are themselves discs of very nearly the
 * same size — the mark was perfectly hidden by the thing it was marking. The traditional sets only
 * showed it at the corners of their octagons, which is luck, not a design. A ring at the edge of
 * the cell cannot be swallowed by any piece shape, and a set may be drawn however it likes.
 *
 * Nearly the full height of the cell, because a set may draw a piece at up to that: the general in
 * the modern sets is 0.94 of it. The gap is thin there and wide on a smaller piece, and a crisp
 * line reads at both.
 *
 * White with a dark hairline, for the reason `MoveHint` gives: the board beneath is pale wood on
 * Classic and near-black on Neon, and neither a light nor a dark mark alone reads on both.
 *
 * Drawn in its own square rather than in the cell's `<svg>`, which is `preserveAspectRatio="none"`
 * and would stretch the ring into an ellipse.
 */
interface Props {
  readonly emphasis: MovableEmphasis;
  readonly hintsStyle: HintsStyle;
}

export function MovableMark({emphasis, hintsStyle}: Props): React.JSX.Element {
  return (
    <span className="pointer-events-none absolute inset-0 flex items-center justify-center">
      <span
        className="block h-[98%] rounded-full border-2"
        style={{
          aspectRatio: 1,
          borderColor: tintOf(hintsStyle.colour, emphasis === "full" ? 60 : 25),
          boxShadow: `0 0 0 1px ${tintOf(hintsStyle.outline, 25)}`,
        }}
      />
    </span>
  );
}
