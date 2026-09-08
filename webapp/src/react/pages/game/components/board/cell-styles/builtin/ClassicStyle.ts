import type {BuiltInBoardStyle} from "@src/react/pages/game/components/board/cell-styles/builtin/types/BuiltInBoardStyle";

/** Wood and ink: the board as it looks sitting on a table. */
export const classicStyle: BuiltInBoardStyle = {
  name: "Classic",
  surface: "#e7c88f",
  defaultCell: {
    stroke: "#4a3116",
    strokeWidth: 1.25,
  },
};
