import type {BuiltInPieceSetStyle} from "@src/react/pages/game/components/board/piece-styles/builtin/types/BuiltInPieceSetStyle";
import {HACKER_CHARACTERS} from "@src/react/pages/game/components/board/piece-styles/builtin/hacker/marks/HackerCharacters";
import type {PieceStyle} from "@src/styles/types/PieceStyle";
import type {Side} from "@janggi/shared/janggi/pieces/Side";
import {toPieceKey} from "@janggi/shared/janggi/pieces/ToPieceKey";

const MONOSPACE = "'JetBrains Mono', 'Fira Code', 'Cascadia Code', Consolas, 'Courier New', monospace";

/** The two phosphors a terminal came in: green for Cho, amber for Han. */
const PHOSPHOR: Record<Side, string> = {
  cho: "#00ff66",
  han: "#ffb000",
};

/**
 * Black discs outlined in phosphor, each marked with one monospaced character — the set the Hacker board
 * was made for, and the other half of the prize for having found your way to a million XP.
 */
export const hackerPieces: BuiltInPieceSetStyle = {
  name: "Hacker",
  sides: {
    han: terminal("han", 0.84),
    cho: terminal("cho", 0.84),
  },
  pieces: {
    [toPieceKey({side: "han", type: "general"})]: terminal("han", 0.94),
    [toPieceKey({side: "cho", type: "general"})]: terminal("cho", 0.94),
  },
};

function terminal(side: Side, size: number): PieceStyle {
  return {
    body: {shape: "disc", fill: "#030603", stroke: PHOSPHOR[side], strokeWidth: 3},
    glyph: {
      kind: "character",
      characters: HACKER_CHARACTERS,
      colour: PHOSPHOR[side],
      scale: 0.56,
      fontFamily: MONOSPACE,
      fontWeight: 700,
    },
    size,
  };
}
