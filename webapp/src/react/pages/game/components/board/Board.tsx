import {BikjangLine} from "@src/react/pages/game/components/board/components/bikjang-line/BikjangLine";
import {CELL_ASPECT_RATIO} from "@src/react/pages/game/components/board/utils/CellAspectRatio";
import {CheckLines} from "@src/react/pages/game/components/board/components/check-lines/CheckLines";
import {FILE_COUNT, RANK_COUNT} from "@src/game/board/BoardDimensions";
import type {GameMoment} from "@src/react/pages/game/types/GameMoment";
import {Impact} from "@src/react/pages/game/components/board/components/impact/Impact";
import {Intersections} from "@src/react/pages/game/components/board/components/intersections/Intersections";
import {MoveFlight} from "@src/react/pages/game/components/board/components/move-flight/MoveFlight";
import {isArranged} from "@src/game/setups/IsArranged";
import {moved} from "@src/redux/game/GameSlice";
import {threatIn} from "@src/react/pages/game/components/board/utils/ThreatIn";
import {useAppDispatch, useAppSelector} from "@src/redux/Hooks";
import {useBoardShake} from "@src/react/pages/game/components/board/hooks/use-board-shake/UseBoardShake";
import {useEndingShake} from "@src/react/pages/game/components/board/hooks/use-ending-shake/UseEndingShake";
import {useMemo} from "react";
import {useMoveFlight} from "@src/react/pages/game/components/board/hooks/use-move-flight/UseMoveFlight";
import {usePreferences} from "@src/react/pages/game/hooks/use-preferences/UsePreferences";

/**
 * The 9x10 grid of intersections, and everything drawn over it. Every mark on the board comes from a
 * cell, which is what makes it restyleable one intersection at a time.
 *
 * It reads the whole game from the store rather than being handed a list of pieces, because it is where
 * a game is played — a completed move is dispatched from here rather than applied in place. It reads the
 * board style, the piece set, the movable-piece mark and the effects the same way, so like `Status` and
 * `Settings` it is handed only what the page works out: the moment, and the sound a piece makes lifting.
 *
 * Its layers, bottom to top:
 *
 * - `Intersections` — the cells, and the piece in hand. It marks what a player needs to see however
 *   much the board may move: the pieces that may move, the last move's two points, and in a check the
 *   general under attack and each piece attacking it.
 * - `CheckLines` and `BikjangLine` — a line from each attacker to the general it attacks, and the open
 *   file between two generals a bikjang was called on.
 * - `Impact` and `MoveFlight` — with effects in full, a capture drawn landing and a piece drawn flying
 *   from where it was to where it now stands, while that cell keeps its own copy hidden (`useMoveFlight`).
 *
 * A capture shakes the board, and so does the end of a game (`useEndingShake`); both shove this one
 * element, through `useBoardShake`. All the motion is drawn *over* the cells or *inside* them rather than
 * by moving them, so every cell stays exactly where the game says it is, a tap during a flight lands on
 * the point under it, and nothing an acceptance test reads ever waits on motion.
 *
 * Fills whatever box it is given and centres a correctly proportioned board inside it.
 */
interface Props {
  /** The most recent change to the game, which is what is shown moving. */
  readonly moment: GameMoment | undefined;
  /** Called as a piece is picked up — a different piece, or the first. */
  readonly onPickUp: () => void;
}

export function Board({moment, onPickUp}: Props): React.JSX.Element {
  const {played, phase} = useAppSelector(state => state.game);
  const dispatch = useAppDispatch();
  const {boardStyle: style, pieceStyle, movableHighlight, effects} = usePreferences();
  const game = played.present;
  // False while a scored board is still being laid out — the pieces are drawn, but nothing on them may
  // be touched until both armies have chosen.
  const playable = isArranged(phase);
  const animated = effects.full;
  const momentId = moment?.id ?? 0;

  const threat = useMemo(() => (playable ? threatIn(game) : undefined), [game, playable]);
  const {flight, flying, landing, concealed, land, settle} = useMoveFlight(moment, animated);
  const {ref: shaken, shake} = useBoardShake();
  useEndingShake(moment, game, animated, shake);

  return (
    <div className="flex h-full w-full items-center justify-center" style={{containerType: "size"}}>
      <div
        ref={shaken}
        data-testid="board"
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
          background: style.surface,
        }}
      >
        <Intersections
          played={played}
          playable={playable}
          style={style}
          pieceStyle={pieceStyle}
          highlightMovable={movableHighlight.shown}
          threat={threat}
          concealed={concealed}
          moment={moment}
          animated={animated}
          onMove={move => dispatch(moved(move))}
          onPickUp={onPickUp}
        />

        <CheckLines threat={threat} momentId={momentId} drawing={animated} />

        <BikjangLine game={game} momentId={momentId} drawing={animated} />

        {flight?.taken && landing && (
          <Impact
            key={`impact-${flight.id}`}
            move={flight.move}
            taken={flight.taken}
            style={pieceStyle}
            seed={flight.id}
            onStrike={shake}
            onSettled={settle}
          />
        )}

        {flight && flying && (
          <MoveFlight
            key={`flight-${flight.id}`}
            piece={flight.piece}
            move={flight.move}
            style={pieceStyle}
            onLanded={land}
          />
        )}
      </div>
    </div>
  );
}

const BOARD_ASPECT_RATIO = (FILE_COUNT * CELL_ASPECT_RATIO) / RANK_COUNT;
