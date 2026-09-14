import {FILE_COUNT, RANK_COUNT} from "@src/game/board/BoardDimensions";
import type {BoardLine} from "@src/react/pages/game/components/board/types/BoardLine";
import type {LineTone} from "@src/react/pages/game/components/board/components/lines-overlay/types/LineTone";
import {clsx} from "clsx";
import {toPositionKey} from "@src/game/board/PositionKeys";

/**
 * Lines drawn across the board from point to point — from each piece giving check to the general it
 * attacks, or down the open file between two generals a bikjang was called on.
 *
 * Drawn in board units, one to a cell, so a line lands on the centres of its points at any size the
 * board is drawn. The `<svg>` is stretched with the board, and the stroke told not to stretch with it,
 * so a line keeps its width whichever way it runs.
 *
 * While `drawing`, each line is drawn out from its first point — along the path the attack travels —
 * and then eases back to a quieter line that stays for as long as what it shows does. Otherwise the
 * quieter line is simply there: a mark rather than motion, so it is shown however little the board may
 * move.
 */
interface Props {
  readonly testId: string;
  readonly lines: readonly BoardLine[];
  readonly tone: LineTone;
  readonly drawing: boolean;
}

export function LinesOverlay({testId, lines, tone, drawing}: Props): React.JSX.Element {
  return (
    <svg
      data-testid={testId}
      aria-hidden
      viewBox={`0 0 ${FILE_COUNT} ${RANK_COUNT}`}
      preserveAspectRatio="none"
      className="pointer-events-none absolute inset-0 z-10 h-full w-full"
    >
      {lines.map(line => (
        <line
          key={`${toPositionKey(line.from)}-${toPositionKey(line.to)}`}
          x1={line.from.file - 0.5}
          y1={line.from.rank - 0.5}
          x2={line.to.file - 0.5}
          y2={line.to.rank - 0.5}
          stroke={TONES[tone]}
          strokeWidth={4}
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
          pathLength={1}
          strokeDasharray={1}
          className={clsx(
            "opacity-40",
            drawing && "animate-[line-draw_420ms_ease-out_both,line-fade_1400ms_ease-out_both]",
          )}
        />
      ))}
    </svg>
  );
}

const TONES: Record<LineTone, string> = {danger: "var(--color-danger)", gold: "var(--color-gold)"};
