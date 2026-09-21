import {BOARD_POSITIONS} from "@src/react/pages/game/components/board/components/intersections/utils/BoardPositions";
import {Cell} from "@src/react/pages/game/components/board/components/intersections/components/cell/Cell";
import type {Flourish} from "@src/react/pages/game/components/board/types/Flourish";
import type {GameMoment} from "@src/react/pages/game/types/GameMoment";
import type {PositionKey} from "@src/game/board/types/Position";
import type {Threat} from "@src/react/pages/game/components/board/types/Threat";
import {bikjangHintShown} from "@src/react/pages/game/components/board/components/intersections/bikjang-hint/BikjangHintShown";
import {bikjangRisksFor} from "@src/react/pages/game/components/board/components/intersections/bikjang-hint/BikjangRisksFor";
import {botDutyFor} from "@src/react/pages/game/bot-duty/BotDutyFor";
import {botEngineHoldsPlay} from "@src/react/pages/game/bot-duty/BotEngineHoldsPlay";
import {emphasisFor} from "@src/react/pages/game/components/board/components/intersections/movable-pieces/EmphasisFor";
import {flourishesOf} from "@src/react/pages/game/components/board/components/intersections/motion/flourishes-of/FlourishesOf";
import {hintDelay} from "@src/react/pages/game/components/board/components/intersections/motion/HintDelay";
import {isArranged} from "@src/game/setups/IsArranged";
import {lastMoveEndAt} from "@src/react/pages/game/components/board/components/intersections/last-move/LastMoveEndAt";
import {lastMoveOf} from "@src/react/pages/game/components/board/components/intersections/last-move/LastMoveOf";
import {liftAt} from "@src/react/pages/game/components/board/components/intersections/motion/LiftAt";
import {movablePieces} from "@src/react/pages/game/components/board/components/intersections/movable-pieces/MovablePieces";
import {moved} from "@src/redux/game/GameSlice";
import {pieceAt} from "@src/game/board/lookup/PieceAt";
import {piecesByPosition} from "@src/game/board/lookup/PiecesByPosition";
import {toPositionKey} from "@src/game/board/PositionKeys";
import {useAppDispatch, useAppSelector} from "@src/redux/Hooks";
import {useEffect, useEffectEvent, useMemo} from "react";
import {useMoveSelection} from "@src/react/pages/game/components/board/components/intersections/hooks/use-move-selection/UseMoveSelection";
import {usePreferences} from "@src/react/pages/game/hooks/use-preferences/UsePreferences";

/**
 * Every intersection on the board, one `Cell` each — and where a game is played by touch. It owns which
 * piece is in hand and which is under the pointer, lights the points the piece in question may reach —
 * and, marked differently, those of its own army it would otherwise land on — and dispatches a completed
 * move itself. Of the points it lights, those where the move would leave the opponent a bikjang to call
 * are labelled 빅장 — where the player has that hint on and the opponent is one it is offered against.
 *
 * It reads what it draws from the store: the game, whether the player may touch it, the movable-piece
 * mark, the bikjang hint and whether effects are full. The styles it leaves to each `Cell`, which wears
 * them itself. Board hands down only the state its several layers coordinate — the current threat and
 * motion — plus the page-owned sound of picking a piece up.
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
  /** The check on the board, if there is one. */
  readonly threat: Threat | undefined;
  /** The point whose piece is hidden while a copy of it is shown flying in, if there is one. */
  readonly concealed: PositionKey | undefined;
  /** The most recent change to the game, which pieces show in place when effects are in full. */
  readonly moment: GameMoment | undefined;
  /** Called as a piece is picked up — a different piece, or the first. */
  readonly onPickUp: () => void;
}

export function Intersections({threat, concealed, moment, onPickUp}: Props): React.JSX.Element {
  const {played, phase, opponent} = useAppSelector(state => state.game);
  const engineStatus = useAppSelector(state => state.botEngine.status);
  const dispatch = useAppDispatch();
  const {movableHighlight, bikjangHint, effects} = usePreferences();
  const game = played.present;
  // False while a scored board is still being laid out — the pieces are drawn, but nothing on them may
  // be touched until both armies have chosen. Closed while the bot is thinking too, and while its engine
  // is not up: a first move made then would begin a rated game against nobody.
  const playable =
    isArranged(phase) &&
    botDutyFor(played, phase, opponent) === undefined &&
    !botEngineHoldsPlay(played, opponent, engineStatus);
  const animated = effects.full;
  const {selected, hovered, destinations, covered, tap, hover} = useMoveSelection(
    game,
    move => dispatch(moved(move)),
    playable,
  );
  const placedPieces = useMemo(() => piecesByPosition(game.pieces), [game.pieces]);
  const reachable = useMemo(() => new Set(destinations.map(toPositionKey)), [destinations]);
  const coveredKeys = useMemo(() => new Set(covered.map(toPositionKey)), [covered]);
  // Not asked at all where the hint is not offered, since it is one question of the engine per point.
  const bikjangRiskKeys = useMemo(
    () =>
      bikjangHintShown(bikjangHint, opponent) ? bikjangRisksFor(game, selected ?? hovered, destinations) : NOTHING,
    [game, selected, hovered, destinations, bikjangHint, opponent],
  );

  // On [game] rather than on every render: the cells re-render as the pointer crosses them, and
  // asking the engine for every legal move on the board is not something to do per hover.
  const movable = useMemo(
    () => (movableHighlight.shown ? movablePieces(game, playable) : NOTHING),
    [game, movableHighlight.shown, playable],
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
        const isCovered = coveredKeys.has(key);

        return (
          <Cell
            key={key}
            position={position}
            piece={pieceAt(placedPieces, position)}
            selected={heldKey === key}
            canMoveTo={canMoveTo}
            covered={isCovered}
            bikjangRisk={bikjangRiskKeys.has(key)}
            movable={emphasisFor(movable, position, selected !== undefined)}
            hovered={hoveredKey === key}
            lastMove={lastMoveEndAt(lastMove, position)}
            concealed={concealed === key}
            underAttack={threatenedKey === key}
            attacking={attackerKeys.has(key)}
            lift={liftAt(key, {heldKey, hoveredKey, animated})}
            flourish={flourishes.get(key)}
            hintDelay={hintOrigin && (canMoveTo || isCovered) ? hintDelay(hintOrigin, position) : undefined}
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
