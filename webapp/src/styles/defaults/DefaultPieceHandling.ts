import type {PieceHandlingStyle} from "@src/styles/types/PieceHandlingStyle";

/** How a piece answered being touched before a set could choose — and what a set that says nothing of it gets. */
export const DEFAULT_PIECE_HANDLING: PieceHandlingStyle = {
  shadow: "rgba(0, 0, 0, 0.45)",
  hoverOutline: 2.25,
};
