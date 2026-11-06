import type {
  BlockTurn,
  MovementBlock,
} from "@src/react/pages/learn/components/pieces/components/piece-card/components/movement-snapshot/blocking/types/MovementBlock";
import type {MovementPoint} from "@src/react/pages/learn/components/pieces/components/piece-card/components/movement-snapshot/types/MovementPoint";
import type {MovementRoute} from "@src/react/pages/learn/components/pieces/components/piece-card/components/movement-snapshot/routes/types/MovementRoute";
import type {PieceSetStyle} from "@src/styles/types/PieceSetStyle";
import type {PieceType} from "@janggi/shared/janggi/pieces/PieceType";
import {RouteLine} from "@src/react/pages/learn/components/pieces/components/piece-card/components/movement-snapshot/components/route-line/RouteLine";
import {StandingPiece} from "@src/react/pages/learn/components/pieces/components/piece-card/components/movement-snapshot/components/standing-piece/StandingPiece";
import {blockOnRoute} from "@src/react/pages/learn/components/pieces/components/piece-card/components/movement-snapshot/blocking/BlockOnRoute";
import {pointAt} from "@src/react/pages/learn/components/pieces/components/piece-card/components/movement-snapshot/geometry/PointAt";
import {routesOf} from "@src/react/pages/learn/components/pieces/components/piece-card/components/movement-snapshot/routes/RoutesOf";

interface Props {
  readonly pieceType: PieceType;
  readonly pieceName: string;
  /** What the piece stood in a horse's or elephant's way is called, in the language of the guide. */
  readonly blockerName: string;
  readonly pieceStyle: PieceSetStyle;
  /** What the example shows, in the language of the guide. It is written beneath and read aloud for the figure. */
  readonly caption: string;
}

interface MovementExample {
  readonly destinations?: readonly MovementPoint[];
  readonly screens?: readonly MovementPoint[];
  readonly palace?: boolean;
  /** For a piece that goes by way of other points (the horse and elephant), each way it goes, traced out. */
  readonly routes?: readonly MovementRoute[];
  /** Pieces stood in those routes' way, one turn after another, to show what stops it. */
  readonly blocks?: readonly MovementBlock[];
}

/** A seven-by-seven crop: enough board to show a piece's complete movement shape, and no more. */
export function MovementSnapshot({pieceType, pieceName, blockerName, pieceStyle, caption}: Props): React.JSX.Element {
  const example = MOVEMENT_EXAMPLES[pieceType];
  const blocks = example.blocks ?? [];

  return (
    <figure
      className="grid items-center gap-4 p-5 sm:grid-cols-[minmax(10rem,1fr)_minmax(9rem,0.75fr)]"
      aria-label={caption}
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

          {example.routes?.map(route => (
            <RouteLine key={`route-${routeKey(route)}`} route={route} block={blockOnRoute(route, blocks)} />
          ))}

          {example.destinations?.map(destination => (
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

        <StandingPiece
          at={{file: CENTRE, rank: CENTRE}}
          piece={{side: "cho", type: pieceType}}
          name={pieceName}
          style={pieceStyle}
          testId="guide-movement-piece"
        />

        {blocks.map(block => (
          <StandingPiece
            key={`blocker-${block.turn}`}
            at={block.at}
            piece={BLOCKER}
            name={blockerName}
            style={pieceStyle}
            testId="guide-movement-blocker"
            motion={BLOCKER_MOTION[block.turn]}
            unspoken
          />
        ))}
      </div>

      <figcaption className="text-sm leading-relaxed text-wood/70">{caption}</figcaption>
    </figure>
  );
}

function pointKey(point: MovementPoint): string {
  return `${point.file}-${point.rank}`;
}

function routeKey(route: MovementRoute): string {
  return route.points.map(pointKey).join("_");
}

const CENTRE = 3;
const BOARD_COORDINATES = [0, 1, 2, 3, 4, 5, 6].map(pointAt);
const BOARD_START = pointAt(0);
const BOARD_END = pointAt(6);

/** Any piece of either army blocks, so the example stands the other army's soldier in the way. */
const BLOCKER = {side: "han", type: "soldier"} as const;

const BLOCKER_MOTION: Readonly<Record<BlockTurn, string>> = {
  first: "animate-[guide-blocker-first_8s_linear_infinite]",
  second: "animate-[guide-blocker-second_8s_linear_infinite]",
};

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
  },
  guard: {
    destinations: ALL_ADJACENT,
    palace: true,
  },
  horse: {
    routes: routesOf(1),
    // A piece on the straight step above, then on the one to the right: each takes away the two ways through it.
    blocks: [
      {turn: "first", at: {file: 3, rank: 2}},
      {turn: "second", at: {file: 4, rank: 3}},
    ],
  },
  elephant: {
    routes: routesOf(2),
    // A piece on the straight step above takes two ways; then one on a diagonal step to the upper right takes one.
    blocks: [
      {turn: "first", at: {file: 3, rank: 2}},
      {turn: "second", at: {file: 5, rank: 2}},
    ],
  },
  chariot: {
    destinations: CHARIOT_DESTINATIONS,
    palace: true,
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
  },
};
