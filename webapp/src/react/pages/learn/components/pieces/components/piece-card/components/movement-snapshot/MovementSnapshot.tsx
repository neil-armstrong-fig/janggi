import type {PieceSetStyle} from "@src/styles/types/PieceSetStyle";
import {Piece} from "@src/react/pages/game/components/board/components/piece/Piece";
import type {PieceType} from "@janggi/shared/janggi/pieces/PieceType";

interface Props {
  readonly pieceType: PieceType;
  readonly pieceStyle: PieceSetStyle;
}

interface MovementPoint {
  readonly file: number;
  readonly rank: number;
}

interface MovementExample {
  readonly destinations: readonly MovementPoint[];
  readonly screens?: readonly MovementPoint[];
  readonly palace?: boolean;
  readonly caption: string;
}

/** A seven-by-seven crop: enough board to show a piece's complete movement shape, and no more. */
export function MovementSnapshot({pieceType, pieceStyle}: Props): React.JSX.Element {
  const example = MOVEMENT_EXAMPLES[pieceType];

  return (
    <figure
      className="grid items-center gap-4 p-5 sm:grid-cols-[minmax(10rem,1fr)_minmax(9rem,0.75fr)]"
      aria-label={example.caption}
    >
      <div className="relative aspect-square w-full max-w-80 rounded-md border border-gold/50 bg-wood shadow-inner">
        <svg className="block size-full" viewBox="0 0 100 100" aria-hidden="true">
          {BOARD_COORDINATES.map(coordinate => (
            <line
              className="stroke-ink/70 [stroke-width:0.55]"
              key={`file-${coordinate}`}
              x1={coordinate}
              y1={BOARD_START}
              x2={coordinate}
              y2={BOARD_END}
            />
          ))}

          {BOARD_COORDINATES.map(coordinate => (
            <line
              className="stroke-ink/70 [stroke-width:0.55]"
              key={`rank-${coordinate}`}
              x1={BOARD_START}
              y1={coordinate}
              x2={BOARD_END}
              y2={coordinate}
            />
          ))}

          {example.palace && (
            <g className="stroke-ink/70 [stroke-width:0.8]">
              <line x1={pointAt(2)} y1={pointAt(2)} x2={pointAt(4)} y2={pointAt(4)} />

              <line x1={pointAt(4)} y1={pointAt(2)} x2={pointAt(2)} y2={pointAt(4)} />
            </g>
          )}

          {example.destinations.map(destination => (
            <circle
              key={`destination-${pointKey(destination)}`}
              data-testid="guide-movement-destination"
              className="fill-cho stroke-wood [stroke-width:0.9]"
              cx={pointAt(destination.file)}
              cy={pointAt(destination.rank)}
              r="2.8"
            />
          ))}

          {example.screens?.map(screen => (
            <circle
              key={`screen-${pointKey(screen)}`}
              className="fill-wood stroke-han [stroke-width:1.2]"
              cx={pointAt(screen.file)}
              cy={pointAt(screen.rank)}
              r="4"
            />
          ))}
        </svg>

        <div className="absolute z-1 aspect-square w-[15%] -translate-x-1/2 -translate-y-1/2" style={piecePosition()}>
          <Piece piece={{side: "cho", type: pieceType}} style={pieceStyle} emphasised={false} />
        </div>
      </div>

      <figcaption className="text-sm leading-relaxed text-wood/70">{example.caption}</figcaption>
    </figure>
  );
}

function pointAt(index: number): number {
  return BOARD_START + index * BOARD_STEP;
}

function pointKey(point: MovementPoint): string {
  return `${point.file}-${point.rank}`;
}

function piecePosition(): React.CSSProperties {
  return {left: `${pointAt(CENTRE)}%`, top: `${pointAt(CENTRE)}%`};
}

const BOARD_START = 8;
const BOARD_END = 92;
const BOARD_STEP = 14;
const CENTRE = 3;
const BOARD_COORDINATES = [8, 22, 36, 50, 64, 78, 92] as const;

const ALL_ADJACENT: readonly MovementPoint[] = [
  {file: 2, rank: 2},
  {file: 3, rank: 2},
  {file: 4, rank: 2},
  {file: 2, rank: 3},
  {file: 4, rank: 3},
  {file: 2, rank: 4},
  {file: 3, rank: 4},
  {file: 4, rank: 4},
];

const HORSE_DESTINATIONS: readonly MovementPoint[] = [
  {file: 1, rank: 2},
  {file: 1, rank: 4},
  {file: 2, rank: 1},
  {file: 4, rank: 1},
  {file: 5, rank: 2},
  {file: 5, rank: 4},
  {file: 2, rank: 5},
  {file: 4, rank: 5},
];

const ELEPHANT_DESTINATIONS: readonly MovementPoint[] = [
  {file: 0, rank: 1},
  {file: 0, rank: 5},
  {file: 1, rank: 0},
  {file: 5, rank: 0},
  {file: 6, rank: 1},
  {file: 6, rank: 5},
  {file: 1, rank: 6},
  {file: 5, rank: 6},
];

const CHARIOT_DESTINATIONS: readonly MovementPoint[] = [
  {file: 3, rank: 0},
  {file: 3, rank: 1},
  {file: 3, rank: 2},
  {file: 3, rank: 4},
  {file: 3, rank: 5},
  {file: 3, rank: 6},
  {file: 0, rank: 3},
  {file: 1, rank: 3},
  {file: 2, rank: 3},
  {file: 4, rank: 3},
  {file: 5, rank: 3},
  {file: 6, rank: 3},
  {file: 2, rank: 2},
  {file: 4, rank: 2},
  {file: 2, rank: 4},
  {file: 4, rank: 4},
];

const MOVEMENT_EXAMPLES: Readonly<Record<PieceType, MovementExample>> = {
  general: {
    destinations: ALL_ADJACENT,
    palace: true,
    caption: "One step along a palace line. The general stays inside its own palace.",
  },
  guard: {
    destinations: ALL_ADJACENT,
    palace: true,
    caption: "One step along a palace line, without leaving the palace.",
  },
  horse: {
    destinations: HORSE_DESTINATIONS,
    caption: "One step straight, then one step diagonally out. The first step can be blocked.",
  },
  elephant: {
    destinations: ELEPHANT_DESTINATIONS,
    caption: "One step straight, then two diagonally out. Either point on the route can be blocked.",
  },
  chariot: {
    destinations: CHARIOT_DESTINATIONS,
    palace: true,
    caption: "Any distance in a straight line, plus the straight diagonals drawn through a palace.",
  },
  cannon: {
    destinations: [
      {file: 3, rank: 0},
      {file: 3, rank: 1},
      {file: 6, rank: 3},
    ],
    screens: [
      {file: 3, rank: 2},
      {file: 5, rank: 3},
    ],
    caption: "It must jump one piece. The outlined points are the pieces it jumps over.",
  },
  soldier: {
    destinations: [
      {file: 2, rank: 2},
      {file: 3, rank: 2},
      {file: 4, rank: 2},
      {file: 2, rank: 3},
      {file: 4, rank: 3},
    ],
    palace: true,
    caption: "One step forward or sideways, plus a forward palace diagonal. Never backwards.",
  },
};
