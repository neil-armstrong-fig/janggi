import type {BuiltInBoardStyle} from "@src/react/pages/game/components/board/cell-styles/builtin/types/BuiltInBoardStyle";

/**
 * Goryeo celadon: a pale jade glaze, a little deeper where it pooled, crazed with the fine crackle a
 * glaze takes on as it cools. The crackle is two faint sets of lines at odd angles and odd spacings, so
 * they never line up with the grid or with each other.
 *
 * The lines are the darker green of glaze gathered in an incision — the board is inlaid, as 상감 celadon
 * is, rather than drawn on.
 */
export const celadonStyle: BuiltInBoardStyle = {
  name: "Celadon",
  surface: [
    "repeating-linear-gradient(35deg, rgba(255, 255, 255, 0.1) 0 1px, transparent 1px 23px)",
    "repeating-linear-gradient(-55deg, rgba(40, 70, 60, 0.07) 0 1px, transparent 1px 31px)",
    "radial-gradient(circle at 30% 20%, #d4e7d9, #a4c7b1 60%, #89b59d)",
  ].join(", "),
  defaultCell: {
    stroke: "#3f6b58",
    strokeWidth: 1.1,
    diagonalStroke: "#2f5546",
  },
  lastMove: {
    wash: "rgba(31, 61, 49, 0.16)",
    brackets: "#1f3d31",
  },
};
