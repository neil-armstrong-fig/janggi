import type {
  BlockTurn,
  MovementBlock,
} from "@src/react/pages/learn/components/pieces/components/piece-card/components/movement-snapshot/blocking/types/MovementBlock";
import type {MovementRoute} from "@src/react/pages/learn/components/pieces/components/piece-card/components/movement-snapshot/routes/types/MovementRoute";
import {clsx} from "clsx";
import {pointAt} from "@src/react/pages/learn/components/pieces/components/piece-card/components/movement-snapshot/geometry/PointAt";

interface Props {
  readonly route: MovementRoute;
  /** The piece standing in this route's way, if one does; the route then dims under a cross for that turn. */
  readonly block?: MovementBlock;
}

/** One way a horse or elephant can go: the path traced out from the piece, and the point it lands on. */
export function RouteLine({route, block}: Props): React.JSX.Element | undefined {
  const landing = route.points.at(-1);
  if (!landing) return undefined;

  return (
    <g>
      <g className={clsx(block && "opacity-25", block && CUT_MOTION[block.turn], "motion-reduce:animate-none")}>
        <polyline
          className="fill-none stroke-cho/70 [stroke-dasharray:1] [stroke-linejoin:round] [stroke-width:1.1] animate-[guide-route-trace_8s_linear_infinite] motion-reduce:animate-none"
          pathLength={1}
          points={route.points.map(point => `${pointAt(point.file)},${pointAt(point.rank)}`).join(" ")}
        />

        <circle
          data-testid="guide-movement-destination"
          className="fill-cho stroke-wood [stroke-width:0.9] animate-[guide-landing-show_8s_linear_infinite] motion-reduce:animate-none"
          cx={pointAt(landing.file)}
          cy={pointAt(landing.rank)}
          r="2.8"
        />
      </g>

      {block && (
        <g
          data-testid="guide-movement-cut-off"
          className={clsx(
            "stroke-han [stroke-linecap:round] [stroke-width:1.3]",
            CROSS_MOTION[block.turn],
            "motion-reduce:animate-none",
          )}
        >
          <line
            x1={pointAt(landing.file) - CROSS_ARM}
            y1={pointAt(landing.rank) - CROSS_ARM}
            x2={pointAt(landing.file) + CROSS_ARM}
            y2={pointAt(landing.rank) + CROSS_ARM}
          />

          <line
            x1={pointAt(landing.file) + CROSS_ARM}
            y1={pointAt(landing.rank) - CROSS_ARM}
            x2={pointAt(landing.file) - CROSS_ARM}
            y2={pointAt(landing.rank) + CROSS_ARM}
          />
        </g>
      )}
    </g>
  );
}

const CROSS_ARM = 3.4;

const CUT_MOTION: Readonly<Record<BlockTurn, string>> = {
  first: "animate-[guide-cut-first_8s_linear_infinite]",
  second: "animate-[guide-cut-second_8s_linear_infinite]",
};

const CROSS_MOTION: Readonly<Record<BlockTurn, string>> = {
  first: "animate-[guide-cross-first_8s_linear_infinite]",
  second: "animate-[guide-cross-second_8s_linear_infinite]",
};
