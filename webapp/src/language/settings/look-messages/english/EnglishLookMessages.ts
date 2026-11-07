import type {LookMessages} from "@src/language/settings/look-messages/LookMessages";
import {englishSideName} from "@src/language/sides/english/EnglishSideName";

/** The Look tab, in English. */
export const ENGLISH_LOOK_MESSAGES: LookMessages = {
  hintsSummary: (hints, fullMotion) => {
    if (hints === 1) {
      if (fullMotion) return "1 hint · Full motion";

      return "1 hint · Reduced motion";
    }

    const count = `${hints} hints`;
    if (fullMotion) return `${count} · Full motion`;

    return `${count} · Reduced motion`;
  },
  board: "Board",
  pieces: "Pieces",
  boardOf: side => `${englishSideName(side)}'s board`,
  piecesOf: side => `${englishSideName(side)}'s pieces`,
  differentBoard: "Different board for each army",
  differentPieces: "Different pieces for each army",
  yourStyles: "Your styles",
  onTheBoard: "On the board",
  markMovable: "Mark the pieces that can move",
  labelBikjang: "Label moves that allow a bikjang",
  bikjangHintNote:
    "Writes 빅장 on a move that would leave the generals facing each other. Offered against a person at the same device and the 800 and 1000 bots only.",
  motion: "Motion: flights, flourishes and shakes",
  transparency: "Settings transparency",
  opponentLook: "Show opponent's board and pieces",
  opponentLookHelp:
    "Online PvP only. Shows the game in your opponent's board and pieces, and shares yours with them. Turn it off to use your own look.",
};
