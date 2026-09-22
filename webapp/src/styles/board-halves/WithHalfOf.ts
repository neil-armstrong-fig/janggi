import type {BoardStyle, CellOverrides} from "@src/styles/types/BoardStyle";
import {FILES, RANKS} from "@src/game/board/BoardDimensions";
import type {CellStyle} from "@src/styles/types/CellStyle";
import type {Position, PositionKey} from "@src/game/board/types/Position";
import type {Side} from "@janggi/shared/janggi/pieces/Side";
import {sideOfPosition} from "@src/game/board/halves/SideOfPosition";
import {toPositionKey} from "@src/game/board/PositionKeys";

/**
 * The board with one army's half drawn as another board draws it.
 *
 * A piece set already has a `sides.han`/`sides.cho` to take a whole army's look from at once
 * (`WithArmyOf.ts`); a board has no such split — one `defaultCell` covers every point of it — so
 * giving one half its own look means writing out an explicit override for every point in it, each
 * resolved from the source board's own style. The other half, and everything that is not per-point
 * (the surface, the marks), stays the board's own.
 */
export function withHalfOf(boardStyle: BoardStyle, sourceBoardStyle: BoardStyle, side: Side): BoardStyle {
  const kept = Object.entries(boardStyle.cells ?? {}).filter(([key]) => SIDE_OF_KEY.get(key as PositionKey) !== side);
  const materialized = ALL_POSITIONS.filter(position => sideOfPosition(position) === side).map(
    (position): readonly [PositionKey, CellStyle] => [toPositionKey(position), cellStyleAt(sourceBoardStyle, position)],
  );
  const cells: CellOverrides = Object.fromEntries([...kept, ...materialized]);

  return {...boardStyle, cells};
}

/**
 * As `resolveCellStyle` (`react/.../intersections/components/cell/utils/ResolveCellStyle.ts`) reads one
 * point — duplicated rather than imported, since `styles/` may not reach into `react/`.
 */
function cellStyleAt(boardStyle: BoardStyle, position: Position): CellStyle {
  return boardStyle.cells?.[toPositionKey(position)] ?? boardStyle.defaultCell;
}

const ALL_POSITIONS: readonly Position[] = RANKS.flatMap(rank => FILES.map(file => ({file, rank})));
const SIDE_OF_KEY: ReadonlyMap<PositionKey, Side> = new Map(
  ALL_POSITIONS.map(position => [toPositionKey(position), sideOfPosition(position)]),
);
