import {BikjangLabel} from "@src/react/pages/game/components/board/components/intersections/components/cell/components/move-hint/components/bikjang-label/BikjangLabel";
import {clsx} from "clsx";
import type {HintsStyle} from "@src/styles/types/board-marks/HintsStyle";
import {tintOf} from "@src/react/pages/game/components/board/utils/TintOf";

/**
 * The mark on a point the piece in hand may move to: a dot on an empty intersection, a ring around
 * whatever is standing on one it would take.
 *
 * It draws in its own square rather than in the cell's `<svg>`, for the same reason `Piece` does —
 * that `<svg>` is `preserveAspectRatio="none"` and would stretch a circle into an ellipse. It is
 * also `pointer-events-none`, so the tap it invites lands on the cell beneath it.
 *
 * Deliberately not a `CellStyle` marker: a board style is plain data a user can author, and whose
 * turn it is has no business being written into one.
 *
 * White with a dark ring rather than one flat colour, because the board underneath it is whatever
 * style is in use — pale wood for Classic, near-black for Neon — and neither a light nor a dark
 * mark alone reads on both.
 *
 * Where the move would leave the opponent a bikjang to call, it says 빅장. The dot swells to hold the
 * word; a ring has no room for it without covering the piece it circles, so there the word sits on a
 * small pill along the bottom of the point.
 *
 * Given a delay, it pops in after it — the nearest points first and the furthest last, so the marks
 * spread outward from the piece in hand. Given none, it is simply there.
 */
interface Props {
  readonly overPiece: boolean;
  /** Whether the move would leave the opponent a bikjang to call. */
  readonly bikjangRisk: boolean;
  readonly hintsStyle: HintsStyle;
  /** How long to wait before popping in, in milliseconds, or undefined to appear at once. */
  readonly delay?: number;
}

export function MoveHint({overPiece, bikjangRisk, hintsStyle, delay}: Props): React.JSX.Element {
  return (
    <span
      className={clsx(
        "pointer-events-none absolute inset-0 flex items-center justify-center",
        delay !== undefined && "animate-[hint-pop_260ms_cubic-bezier(0.2,1.5,0.4,1)_both]",
      )}
      style={delay === undefined ? undefined : {animationDelay: `${delay}ms`}}
    >
      {!overPiece && (
        <span
          data-testid="move-hint"
          className={clsx("rounded-full", bikjangRisk ? "flex h-[64%] items-center justify-center" : "block h-[30%]")}
          style={{aspectRatio: 1, background: tintOf(hintsStyle.colour, 70), boxShadow: edge(hintsStyle)}}
        >
          {bikjangRisk && <BikjangLabel />}
        </span>
      )}

      {overPiece && (
        <span
          className="block h-[82%] rounded-full border-[3px]"
          style={{aspectRatio: 1, borderColor: tintOf(hintsStyle.colour, 80), boxShadow: edge(hintsStyle)}}
        />
      )}

      {overPiece && bikjangRisk && (
        <span className="absolute bottom-[4%] left-1/2 -translate-x-1/2 rounded-full bg-white/85 px-1 py-0.5 whitespace-nowrap ring-1 ring-black/30">
          <BikjangLabel />
        </span>
      )}
    </span>
  );
}

/** The dark hairline that keeps a light mark readable on a pale board. */
function edge(hintsStyle: HintsStyle): string {
  return `0 0 0 1px ${tintOf(hintsStyle.outline, 30)}`;
}
