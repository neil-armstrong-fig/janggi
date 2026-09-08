import {Board} from "@src/react/pages/game/components/board/Board";
import {
  BUILT_IN_PIECE_STYLES,
  DEFAULT_PIECE_STYLE,
} from "@src/react/pages/game/components/board/piece-styles/builtin/BuiltInPieceStyles";
import {BUILT_IN_STYLES, DEFAULT_STYLE} from "@src/react/pages/game/components/board/cell-styles/builtin/BuiltInStyles";
import type {BoardStyle} from "@src/react/pages/game/components/board/cell-styles/types/BoardStyle";
import {DEFAULT_SETUP, SETUPS} from "@src/react/pages/game/components/board/setups/Setups";
import {OptionPicker} from "@src/react/pages/game/components/option-picker/OptionPicker";
import type {PieceSetStyle} from "@src/react/pages/game/components/board/piece-styles/types/PieceSetStyle";
import type {Setup} from "@src/react/pages/game/components/board/setups/types/Setup";
import {startingPieces} from "@src/react/pages/game/components/board/setups/utils/StartingPieces";
import {useMemo, useState} from "react";

/**
 * The screen a game is played on. It owns which style the board and pieces are wearing, and how
 * each army is arranged — nothing else about how any of it looks, which belongs to the cells and
 * the pieces themselves.
 *
 * The two armies get a control each because they genuinely choose separately: Han lays out first,
 * Cho answers, and whether the elephants end up on the same wing or facing each other across the
 * board is the result of those two choices rather than of one setting. See `Setups.ts`.
 */
export function GamePage(): React.JSX.Element {
  const [style, setStyle] = useState<BoardStyle>(DEFAULT_STYLE);
  const [pieceStyle, setPieceStyle] = useState<PieceSetStyle>(DEFAULT_PIECE_STYLE);
  const [hanSetup, setHanSetup] = useState<Setup>(DEFAULT_SETUP);
  const [choSetup, setChoSetup] = useState<Setup>(DEFAULT_SETUP);

  const pieces = useMemo(() => startingPieces(hanSetup, choSetup), [hanSetup, choSetup]);

  return (
    <main className="flex h-full w-full flex-col gap-3 bg-[#1c140b] p-2">
      <div className="min-h-0 flex-1">
        <Board style={style} pieceStyle={pieceStyle} pieces={pieces} />
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
          label="Han"
          ariaLabel="Han's opening setup"
          options={SETUPS}
          selected={hanSetup}
          onSelect={setHanSetup}
        />

        <OptionPicker
          id="cho-setup"
          label="Cho"
          ariaLabel="Cho's opening setup"
          options={SETUPS}
          selected={choSetup}
          onSelect={setChoSetup}
        />
      </div>
    </main>
  );
}
