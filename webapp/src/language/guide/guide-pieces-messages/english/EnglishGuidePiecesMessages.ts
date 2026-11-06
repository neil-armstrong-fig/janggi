import type {GuidePiecesMessages} from "@src/language/guide/guide-pieces-messages/GuidePiecesMessages";

/** The guide's pieces section, in English. */
export const ENGLISH_GUIDE_PIECES_MESSAGES: GuidePiecesMessages = {
  eyebrow: "03 · Seven kinds of piece",
  heading: "How the pieces move",
  introduction:
    "Every piece captures the same way it normally moves. A piece may never land on a point occupied by its own army. Tap a piece below to see its movement on a small board.",
  styleLabel: "Piece style",
  styleGroupLabel: "Choose how the example pieces look",
  styles: {traditional: "Traditional", hangul: "Hangul", modern: "Modern"},
  pieces: {
    general: {
      name: "General",
      mark: "궁 · 장",
      description:
        "Moves one point along any drawn line and may never leave its own palace. Checkmate this piece to win.",
      caption: "One step along a palace line. The general stays inside its own palace.",
    },
    guard: {
      name: "Guard",
      mark: "사",
      description: "Moves exactly like the general: one point along a line, always inside its own palace.",
      caption: "One step along a palace line, without leaving the palace.",
    },
    chariot: {
      name: "Chariot",
      mark: "차",
      description: "Moves any distance horizontally or vertically, or along a straight palace diagonal, until blocked.",
      caption: "Any distance in a straight line, plus the straight diagonals drawn through a palace.",
    },
    cannon: {
      name: "Cannon",
      mark: "포",
      description:
        "Moves like a chariot after jumping exactly one piece. That piece cannot be another cannon, and a cannon cannot capture a cannon.",
      caption: "It must jump one piece. The outlined points are the pieces it jumps over.",
    },
    horse: {
      name: "Horse",
      mark: "마",
      description:
        "Steps one point straight, then one diagonally outward. Unlike a chess knight it cannot jump: a piece of either army on that first point (멱) blocks both moves beyond it.",
      caption:
        "One step straight, then one diagonally out. A piece on the straight step cuts off the two moves through it.",
    },
    elephant: {
      name: "Elephant",
      mark: "상",
      description:
        "Steps one point straight, then two diagonally outward, anywhere on the board. It cannot jump either: a piece on the straight step or on the first diagonal point blocks it.",
      caption:
        "One step straight, then two diagonally out. A piece on the straight step cuts off two moves; one on the first diagonal point cuts off one.",
    },
    soldier: {
      name: "Soldier",
      mark: "졸 · 병",
      description:
        "Steps one point forward or sideways, never back. In the enemy palace it can also follow a forward diagonal.",
      caption: "One step forward or sideways, plus a forward palace diagonal. Never backwards.",
    },
  },
  valuesLabel: "Janggi piece values",
  values: {
    before: "",
    marked: "Traditional values:",
    after: " chariot 13 · cannon 7 · horse 5 · elephant 3 · guard 3 · soldier 2",
  },
  sources: {
    start: "Movement and values are based on the ",
    firstLink: "Korea Janggi Association’s piece rules",
    middle: ". The ",
    secondLink: "rules research for this game",
    end: " records the translations, comparisons and decisions behind this summary.",
  },
};
