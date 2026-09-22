import type {Position} from "@src/game/board/types/Position";
import {RANK_COUNT} from "@src/game/board/BoardDimensions";
import type {Side} from "@janggi/shared/janggi/pieces/Side";

/**
 * Which army's half of the board a point stands in. Han holds ranks 1-5, Cho 6-10 — the same line the
 * two palaces sit either side of (`palaces/Palaces.ts`), so a board split down the middle divides the
 * two armies exactly where the pieces already do.
 */
export function sideOfPosition(position: Position): Side {
  return position.rank <= RANK_COUNT / 2 ? "han" : "cho";
}
