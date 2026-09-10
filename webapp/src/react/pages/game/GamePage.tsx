import {Board} from "@src/react/pages/game/components/board/Board";
import {DEFAULT_MOVABLE_HIGHLIGHT} from "@src/react/pages/game/utils/MovableHighlights";
import {DEFAULT_PIECE_STYLE} from "@src/react/pages/game/components/board/piece-styles/builtin/BuiltInPieceStyles";
import {DEFAULT_STYLE} from "@src/react/pages/game/components/board/cell-styles/builtin/BuiltInStyles";
import type {BoardStyle} from "@src/react/pages/game/components/board/cell-styles/types/BoardStyle";
import type {MovableHighlight} from "@src/react/pages/game/types/MovableHighlight";
import type {PieceSetStyle} from "@src/react/pages/game/components/board/piece-styles/types/PieceSetStyle";
import {Settings} from "@src/react/pages/game/components/settings/Settings";
import {Status} from "@src/react/pages/game/components/status/Status";
import {isArranged} from "@src/game/setups/IsArranged";
import {moved} from "@src/redux/game/GameSlice";
import {useAppDispatch, useAppSelector} from "@src/redux/Hooks";
import {useState} from "react";

/**
 * The screen a game is played on, in the three sections the acceptance-test DSL already names:
 * `Status` says what the game is doing, `Board` is what is standing on it, and `Settings` is
 * everything a player may choose. Each of the three owns its own layout and its own prose.
 *
 * What is left here is the one thing none of them can own alone: the board style, the piece set and
 * the movable-piece mark. Those are preferences about how a game is *drawn* rather than part of the
 * game, so they are local state rather than a slice — but the board wears them and the settings
 * panel changes them, which makes this the nearest place that can hold them. Everything that *is*
 * part of the game comes from the store, and `Status` and `Settings` read it themselves.
 */
export function GamePage(): React.JSX.Element {
  const [style, setStyle] = useState<BoardStyle>(DEFAULT_STYLE);
  const [pieceStyle, setPieceStyle] = useState<PieceSetStyle>(DEFAULT_PIECE_STYLE);
  const [movableHighlight, setMovableHighlight] = useState<MovableHighlight>(DEFAULT_MOVABLE_HIGHLIGHT);
  const {played, phase} = useAppSelector(state => state.game);
  const dispatch = useAppDispatch();

  // A scored board is still being laid out until both armies have chosen, and until then there is
  // no game here to play — the pieces on screen are only what `boardShownFor` is painting.
  const laidOut = isArranged(phase);

  return (
    <main className="flex h-full w-full flex-col gap-3 bg-[#1c140b] p-2">
      <Status />

      <div className="min-h-0 flex-1">
        <Board
          game={played.present}
          style={style}
          pieceStyle={pieceStyle}
          highlightMovable={movableHighlight.shown}
          playable={laidOut}
          onMove={move => dispatch(moved(move))}
        />
      </div>

      <Settings
        style={style}
        onSelectStyle={setStyle}
        pieceStyle={pieceStyle}
        onSelectPieceStyle={setPieceStyle}
        movableHighlight={movableHighlight}
        onSelectMovableHighlight={setMovableHighlight}
      />
    </main>
  );
}
