import {DEFAULT_BOARD_MARKS} from "@src/styles/defaults/DefaultBoardMarks";
import type {BuiltInBoardStyle} from "@src/react/pages/game/components/board/cell-styles/builtin/types/BuiltInBoardStyle";
import type {CellOverrides} from "@src/styles/types/BoardStyle";
import type {CellStyle} from "@src/styles/types/CellStyle";
import {toPositionKey} from "@src/game/board/PositionKeys";

const LINE: CellStyle = {stroke: "#2d3b1f", strokeWidth: 1};

/**
 * The roll-up vinyl board of a chess club, in its buff and green, borrowed by a janggi club that had
 * nothing else to hand. A janggi piece stands on a point rather than in a square, so the check is laid
 * under the points — every other cell green — and the grid is drawn over it in a green dark enough to
 * read on both.
 *
 * It is the one built-in that styles all ninety cells, which is what `cells` exists for.
 */
export const tournamentStyle: BuiltInBoardStyle = {
  name: "Tournament",
  ...DEFAULT_BOARD_MARKS,
  surface: "#eeeed2",
  defaultCell: LINE,
  cells: checkered(),
  lastMove: {
    wash: "rgba(246, 246, 105, 0.55)",
    brackets: "#6b7b2a",
  },
};

function checkered(): CellOverrides {
  const green: CellStyle = {...LINE, surface: "#8aa86a"};
  const files = [1, 2, 3, 4, 5, 6, 7, 8, 9] as const;
  const ranks = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] as const;

  return Object.fromEntries(
    files.flatMap(file =>
      ranks.filter(rank => (file + rank) % 2 === 0).map(rank => [toPositionKey({file, rank}), green]),
    ),
  );
}
