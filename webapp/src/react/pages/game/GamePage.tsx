import {Board} from "@src/react/pages/game/components/board/Board";
import {BUILT_IN_STYLES, DEFAULT_STYLE} from "@src/react/pages/game/components/board/cell-styles/builtin/BuiltInStyles";
import type {BoardStyle} from "@src/react/pages/game/components/board/cell-styles/types/BoardStyle";
import {StylePicker} from "@src/react/pages/game/components/style-picker/StylePicker";
import {useState} from "react";

/**
 * The screen a game is played on. It owns which style the board is wearing and nothing else about
 * how the board looks — that belongs to the cells.
 */
export function GamePage(): React.JSX.Element {
  const [style, setStyle] = useState<BoardStyle>(DEFAULT_STYLE);

  return (
    <main className="flex h-full w-full flex-col gap-2 bg-[#1c140b] p-2">
      <div className="min-h-0 flex-1">
        <Board style={style} />
      </div>

      <StylePicker styles={BUILT_IN_STYLES} selected={style} onSelect={setStyle} />
    </main>
  );
}
