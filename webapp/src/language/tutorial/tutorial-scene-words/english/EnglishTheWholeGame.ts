import type {TutorialSceneWords} from "@src/language/tutorial/tutorial-scene-words/TutorialSceneWords";

/** What the card says through the tutorial's whole game, to 외통 scene (`THE_WHOLE_GAME`, in `react/pages/game/tutorial/scenes/`), in English. */
export const ENGLISH_THE_WHOLE_GAME: TutorialSceneWords = {
  name: "외통 · A whole game",
  steps: [
    {
      title: "Soldiers step forward",
      body: "You play Cho (초), at the bottom, and move first. A soldier (졸) steps one point forward or sideways, never back. Step the lit soldier forward.",
    },
    {title: "Han steps up", body: "Han's soldier (병) steps up to meet yours."},
    {
      title: "Capture by moving onto a piece",
      body: "Han's soldier has stepped up to meet yours. A piece captures by moving onto an enemy piece the way it would move anyway. Take it.",
    },
    {title: "Han brings out a horse", body: "Han brings out a horse."},
    {
      title: "The horse",
      body: "Han has brought out a horse (마). A horse moves one point straight, then one point diagonally on, away from where it started. Bring out yours.",
    },
    {title: "Han's cannon jumps", body: "Han's cannon jumps its own horse to the middle of the board."},
    {
      title: "The cannon jumps",
      body: "Han's cannon jumped over its horse. A cannon (포) moves along a line, but only by jumping exactly one piece of either army, its screen. Jump yours over your horse to the middle too.",
    },
    {title: "Han brings out its other horse", body: "Han brings out its other horse."},
    {
      title: "The chariot",
      body: "The two cannons face each other, but neither can do anything about it: a cannon can never jump a cannon, or take one. The chariot (차) is the strongest piece, going any distance along a line. Slide it across: it then looks straight up the open line at Han's cannon.",
    },
    {title: "Han's cannon escapes", body: "Han's cannon escapes by jumping its horse."},
    {
      title: "장군: check",
      body: "Han's cannon now stands in front of its horse, and a horse can't move through a piece on its first, straight step (멱). Run your chariot up beside Han's palace. Attacking the general is 장군 (check), and Han must answer it.",
    },
    {title: "Han blocks", body: "Han answers by putting a guard in the way."},
    {
      title: "Soldiers step sideways",
      body: "Han answered the check by blocking it with a guard (사), which never leaves its palace. Step this soldier sideways: it will be a screen for your other cannon later.",
    },
    {title: "Han's cannon takes", body: "Han's cannon takes your soldier over its own."},
    {
      title: "The elephant",
      body: "Han's cannon jumped its own soldier to take yours: a cannon takes the first piece beyond its screen. Take it back with your elephant (상), which moves one point straight, then two diagonally on, and is stopped by any piece in its way.",
    },
    {title: "Han's horse attacks", body: "Han's horse attacks your elephant."},
    {
      title: "Uncover a check",
      body: "Han's horse attacks your elephant. Move it away, taking a soldier as it goes. That leaves Han's centre soldier as the only piece between your cannon and the general: a screen, so your cannon checks.",
    },
    {title: "Han blocks with its horse", body: "Han blocks with its horse."},
    {
      title: "The cannon takes",
      body: "Han put its horse in the way, so the line has two pieces on it and the cannon can't jump them both. It can jump one to take the other: take the horse.",
    },
    {title: "Han's general takes back", body: "Han's general takes your cannon."},
    {
      title: "A screen from either army",
      body: "Han's general (궁) took your cannon: the general takes too, one point at a time along the palace's lines. Jump your other cannon over your soldier to this point. It checks along the row, using Han's own horse as its screen.",
    },
    {title: "Han's general steps back", body: "Han's general steps back out of the line."},
    {
      title: "Bring up the other chariot",
      body: "Han's general has stepped back to the middle of its palace. Bring your other chariot up the side.",
    },
    {title: "Han makes room", body: "Han steps a soldier aside, to free its chariot."},
    {
      title: "Chariot to the open line",
      body: "Han is freeing its chariot. Swing yours across to the open line under Han's palace.",
    },
    {title: "Han's chariot comes out", body: "Han's chariot comes out."},
    {
      title: "Bring the cannon back",
      body: "Han's chariot is out and looking for your general. Jump your cannon back over your soldier: from there it can swing to the middle when it is needed.",
    },
    {title: "Han checks you", body: "Han's chariot checks your general."},
    {
      title: "Answer the check",
      body: "장군! Han's chariot checks your general down the middle. Answer it by stepping your general (궁) aside, one point along a line of the palace.",
    },
    {title: "Han's chariot charges in", body: "Han's chariot charges into your palace."},
    {
      title: "Guards defend",
      body: "Han's chariot checks again from beside your general, but nothing guards it. Take it with your guard (사), along the palace's diagonal line.",
    },
    {title: "Han makes a quiet move", body: "Han steps a soldier aside."},
    {
      title: "The cannon checks",
      body: "Jump your cannon over your chariot to the middle. Han's soldier is its screen, and Han's general is the target: 장군.",
    },
    {title: "Han's general runs to the corner", body: "Han's general runs to the corner of its palace."},
    {
      title: "외통: checkmate",
      body: "Han's general has run to the corner. Take the guard beside it with your chariot: your elephant guards that point, so the general can't take back, and your cannon covers every other way out.",
    },
  ],
  ending: {
    title: "외통: you win",
    body: "Han's general is in check with nowhere to go: that is 외통, and the game is yours. A game can end in other ways too. Next shows each of them in a short scene.",
  },
};
