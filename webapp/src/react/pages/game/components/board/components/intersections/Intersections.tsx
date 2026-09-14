import {BOARD_POSITIONS} from "@src/react/pages/game/components/board/components/intersections/utils/BoardPositions";
import type {BoardStyle} from "@src/react/pages/game/components/board/cell-styles/types/BoardStyle";
import {Cell} from "@src/react/pages/game/components/board/components/intersections/components/cell/Cell";
import type {Flourish} from "@src/react/pages/game/components/board/types/Flourish";
import type {GameMoment} from "@src/react/pages/game/types/GameMoment";
import type {Move} from "@src/game/types/Move";
import type {PieceSetStyle} from "@src/react/pages/game/components/board/piece-styles/types/PieceSetStyle";
import type {PlayedGame} from "@src/game/record/types/PlayedGame";
import type {PositionKey} from "@src/game/board/types/Position";
import type {Threat} from "@src/react/pages/game/components/board/types/Threat";
import {emphasisFor} from "@src/react/pages/game/components/board/components/intersections/movable-pieces/EmphasisFor";
import {flourishesOf} from "@src/react/pages/game/components/board/components/intersections/motion/flourishes-of/FlourishesOf";
import {hintDelay} from "@src/react/pages/game/components/board/components/intersections/motion/HintDelay";
import {lastMoveEndAt} from "@src/react/pages/game/components/board/components/intersections/last-move/LastMoveEndAt";
import {lastMoveOf} from "@src/react/pages/game/components/board/components/intersections/last-move/LastMoveOf";
import {liftAt} from "@src/react/pages/game/components/board/components/intersections/motion/LiftAt";
import {movablePieces} from "@src/react/pages/game/components/board/components/intersections/movable-pieces/MovablePieces";
import {pieceAt} from "@src/game/board/lookup/PieceAt";
import {piecesByPosition} from "@src/game/board/lookup/PiecesByPosition";
import {toPositionKey} from "@src/game/board/PositionKeys";
import {useEffect, useEffectEvent, useMemo} from "react";
import {useMoveSelection} from "@src/react/pages/game/components/board/components/intersections/hooks/use-move-selection/UseMoveSelection";

/**
 * Every intersection on the board, one `Cell` each — and where a game is played by touch. It owns which
 * piece is in hand and which is under the pointer, lights the points the piece in question may reach,
 * and hands a completed move up rather than applying it.
 *
 * Every mark a cell carries is worked out here from the whole board and handed down one point at a
 * time, so a `Cell` knows only its own intersection: whether a piece there may move, whether it is the
 * one in hand, which end of the last move it was, whether it is in a check, and what motion it shows.
 *
 * The pointer state lives here rather than on the board, so a pointer crossing the board re-renders the
 * cells and nothing drawn over them.
 *
 * Rendered straight into the board's grid, one child per point, so the grid lays the cells out itself.
 */
interface Props {
  readonly played: PlayedGame;
  /** False while a scored board is still being laid out — the pieces are drawn, and none may be touched. */
  readonly playable: boolean;
  readonly style: BoardStyle;
  readonly pieceStyle: PieceSetStyle;
  /** Whether to ring every piece its owner may move this turn. */
  readonly highlightMovable: boolean;
  /** The check on the board, if there is one. */
  readonly threat: Threat | undefined;
  /** The point whose piece is hidden while a copy of it is shown flying in, if there is one. */
  readonly concealed: PositionKey | undefined;
  /** The most recent change to the game, which pieces show in place when effects are in full. */
  readonly moment: GameMoment | undefined;
  readonly animated: boolean;
  readonly onMove: (move: Move) => void;
  /** Called as a piece is picked up — a different piece, or the first. */
  readonly onPickUp: () => void;
}

export function Intersections({
  played,
  playable,
  style,
  pieceStyle,
  highlightMovable,
  threat,
  concealed,
  moment,
  animated,
  onMove,
  onPickUp,
}: Props): React.JSX.Element {
  const game = played.present;
  const {selected, hovered, destinations, tap, hover} = useMoveSelection(game, onMove, playable);
  const placedPieces = useMemo(() => piecesByPosition(game.pieces), [game.pieces]);
  const reachable = useMemo(() => new Set(destinations.map(toPositionKey)), [destinations]);

  // On [game] rather than on every render: the cells re-render as the pointer crosses them, and
  // asking the engine for every legal move on the board is not something to do per hover.
  const movable = useMemo(
    () => (highlightMovable ? movablePieces(game, playable) : NOTHING),
    [game, highlightMovable, playable],
  );
  const attackerKeys = useMemo(() => new Set((threat?.attackers ?? []).map(toPositionKey)), [threat]);
  const flourishes = useMemo(() => (animated ? flourishesOf(moment, game) : NO_FLOURISHES), [animated, moment, game]);

  const lastMove = lastMoveOf(played);
  const heldKey = selected && toPositionKey(selected);
  const hoveredKey = hovered && toPositionKey(hovered);
  const threatenedKey = threat && toPositionKey(threat.general);
  // The hints pop in outward from the piece in question, where there is motion to show it with.
  const hintOrigin = animated ? (selected ?? hovered) : undefined;

  const pickUp = useEffectEvent(onPickUp);
  useEffect(() => {
    if (heldKey) pickUp();
  }, [heldKey]);

  return (
    <>
      {BOARD_POSITIONS.map(position => {
        const key = toPositionKey(position);
        const canMoveTo = reachable.has(key);

        return (
          <Cell
            key={key}
            position={position}
            style={style}
            pieceStyle={pieceStyle}
            piece={pieceAt(placedPieces, position)}
            selected={heldKey === key}
            canMoveTo={canMoveTo}
            movable={emphasisFor(movable, position, selected !== undefined)}
            hovered={hoveredKey === key}
            lastMove={lastMoveEndAt(lastMove, position)}
            concealed={concealed === key}
            underAttack={threatenedKey === key}
            attacking={attackerKeys.has(key)}
            lift={liftAt(key, heldKey, hoveredKey, animated)}
            flourish={flourishes.get(key)}
            hintDelay={hintOrigin && canMoveTo ? hintDelay(hintOrigin, position) : undefined}
            pulsing={animated}
            onTap={tap}
            onHover={hover}
          />
        );
      })}
    </>
  );
}

/** A stable empty set, so turning the mark off does not hand every cell a new one each render. */
const NOTHING: ReadonlySet<PositionKey> = new Set();

const NO_FLOURISHES: ReadonlyMap<PositionKey, Flourish> = new Map();
