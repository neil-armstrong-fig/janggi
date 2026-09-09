import {Board} from "@src/react/pages/game/components/board/Board";
import {
  BUILT_IN_PIECE_STYLES,
  DEFAULT_PIECE_STYLE,
} from "@src/react/pages/game/components/board/piece-styles/builtin/BuiltInPieceStyles";
import {BUILT_IN_STYLES, DEFAULT_STYLE} from "@src/react/pages/game/components/board/cell-styles/builtin/BuiltInStyles";
import type {BoardStyle} from "@src/react/pages/game/components/board/cell-styles/types/BoardStyle";
import {SETUPS} from "@src/game/setups/Setups";
import {NewGameButton} from "@src/react/pages/game/components/new-game-button/NewGameButton";
import {OptionPicker} from "@src/react/pages/game/components/option-picker/OptionPicker";
import {TurnIndicator} from "@src/react/pages/game/components/turn-indicator/TurnIndicator";
import type {PieceSetStyle} from "@src/react/pages/game/components/board/piece-styles/types/PieceSetStyle";
import {choSetupChosen, hanSetupChosen, moved, restarted} from "@src/redux/game/GameSlice";
import {useAppDispatch, useAppSelector} from "@src/redux/Hooks";
import {useState} from "react";

/**
 * The screen a game is played on. It owns which style the board and pieces are wearing, and how
 * each army is arranged — nothing else about how any of it looks, which belongs to the cells and
 * the pieces themselves.
 *
 * The two armies get a control each because they genuinely choose separately: Han lays out first,
 * Cho answers, and whether the elephants end up on the same wing or facing each other across the
 * board is the result of those two choices rather than of one setting. See `Setups.ts`.
 *
 * The game itself comes from the store; the board style and the piece set stay in local state,
 * because those are preferences about how the game is drawn rather than part of the game.
 */
export function GamePage(): React.JSX.Element {
  const [style, setStyle] = useState<BoardStyle>(DEFAULT_STYLE);
  const [pieceStyle, setPieceStyle] = useState<PieceSetStyle>(DEFAULT_PIECE_STYLE);
  const {game, hanSetup, choSetup, movesPlayed} = useAppSelector(state => state.game);
  const dispatch = useAppDispatch();

  return (
    <main className="flex h-full w-full flex-col gap-3 bg-[#1c140b] p-2">
      <div className="flex shrink-0 items-center justify-center gap-3">
        <TurnIndicator game={game} />

        <NewGameButton onStart={() => dispatch(restarted())} />
      </div>

      <div className="min-h-0 flex-1">
        <Board game={game} style={style} pieceStyle={pieceStyle} onMove={move => dispatch(moved(move))} />
      </div>

      <div data-testid="settings" className="flex shrink-0 flex-col gap-2">
        <OptionPicker id="board-style" label="Board" options={BUILT_IN_STYLES} selected={style} onSelect={setStyle} />

        <OptionPicker
          id="piece-style"
          label="Pieces"
          options={BUILT_IN_PIECE_STYLES}
          selected={pieceStyle}
          onSelect={setPieceStyle}
        />

        <OptionPicker
          id="han-setup"
          disabled={movesPlayed > 0}
          label="Han"
          ariaLabel="Han's opening setup"
          options={SETUPS}
          selected={hanSetup}
          onSelect={setup => dispatch(hanSetupChosen(setup))}
        />

        <OptionPicker
          id="cho-setup"
          disabled={movesPlayed > 0}
          label="Cho"
          ariaLabel="Cho's opening setup"
          options={SETUPS}
          selected={choSetup}
          onSelect={setup => dispatch(choSetupChosen(setup))}
        />
      </div>
    </main>
  );
}
