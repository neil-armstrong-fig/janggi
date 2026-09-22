import {CELL_ASPECT_RATIO} from "@src/react/pages/game/components/board/utils/CellAspectRatio";
import {FILE_COUNT, RANK_COUNT} from "@src/game/board/BoardDimensions";

/**
 * The 9x10 grid a board is drawn on, and its surface: fills whatever box it is given and centres a
 * correctly proportioned board inside it. What goes in it — the cells, and the marks drawn over them — is
 * the children, so the board in play and the style editor's preview are the same shape by construction.
 */
interface Props {
  /** What a spec finds it by. */
  readonly testId: string;
  /** Any CSS background value, painted behind the whole grid — or behind its top half, given `bottomSurface`. */
  readonly surface: string;
  /**
   * Any CSS background value, painted behind the bottom half only, for a board split down the middle
   * between the two armies. Omit it to paint `surface` behind the whole grid, as one board always has.
   */
  readonly bottomSurface?: string;
  /** Handed to the grid itself, for the board that shakes. */
  readonly gridRef?: React.Ref<HTMLDivElement>;
  readonly children: React.ReactNode;
}

export function BoardGrid({testId, surface, bottomSurface, gridRef, children}: Props): React.JSX.Element {
  return (
    <div className="flex h-full w-full items-center justify-center" style={{containerType: "size"}}>
      <div
        ref={gridRef}
        data-testid={testId}
        className="relative grid"
        style={{
          // minmax(0, ...) rather than a bare 1fr: a track's automatic minimum is its content's
          // min-content size, and a cell's <svg> is intrinsically square, so bare 1fr rows floor
          // at the cell's width and the grid outgrows the aspect ratio set below.
          gridTemplateColumns: `repeat(${FILE_COUNT}, minmax(0, 1fr))`,
          gridTemplateRows: `repeat(${RANK_COUNT}, minmax(0, 1fr))`,
          aspectRatio: BOARD_ASPECT_RATIO,
          // Whichever of the two the parent runs out of first is what the board is sized against.
          width: `min(100cqw, 100cqh * ${BOARD_ASPECT_RATIO})`,
          background: surface,
        }}
      >
        {bottomSurface !== undefined && (
          // Out of grid flow (`position: absolute`), so it takes no cell of its own — a second layer
          // painted over the bottom half of `surface`, behind every cell, which follows it in the DOM.
          <span
            data-testid={`${testId}-bottom-surface`}
            aria-hidden
            className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2"
            style={{background: bottomSurface}}
          />
        )}

        {children}
      </div>
    </div>
  );
}

const BOARD_ASPECT_RATIO = (FILE_COUNT * CELL_ASPECT_RATIO) / RANK_COUNT;
