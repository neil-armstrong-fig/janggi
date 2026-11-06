import type {PlayMessages} from "@src/language/settings/play-messages/PlayMessages";
import {englishSideName} from "@src/language/sides/english/EnglishSideName";

/** The Play tab, in English. */
export const ENGLISH_PLAY_MESSAGES: PlayMessages = {
  games: "Games",
  gameNames: {local: "Local", friend: "Online"},
  yourMove: " · your move",
  format: "Format",
  formatNames: {Casual: "Casual", Scored: "Scored"},
  opponent: "Opponent",
  opponentNames: {Human: "Human", Bot: "Bot"},
  botStrength: "Bot strength",
  yourSide: "Your side",
  sideChoiceNames: {Cho: "Cho", Han: "Han", Random: "Random"},
  setup: "Setup",
  setupOf: side => `${englishSideName(side)}'s setup`,
  setupNames: {
    "Inner Elephant": "Inner Elephant",
    "Outer Elephant": "Outer Elephant",
    "Left Elephant": "Left Elephant",
    "Right Elephant": "Right Elephant",
    "Central Chariot": "Central Chariot",
  },
  flipBoard: "Flip board for Han",
  newGame: "New game",
  newGameCostsALoss: "Starting a new game now counts as a loss.",
  setupDescriptions: {
    "Inner Elephant": "Both elephants beside the guards, both horses out by the chariots. The usual choice.",
    "Outer Elephant": "Both elephants out by the chariots, leaving both horses covering the palace.",
    "Left Elephant": "One of each: the elephant out on the player's left, in on their right.",
    "Right Elephant": "The mirror image of the left: elephant out on the player's right, in on their left.",
    "Central Chariot": "Chariots drawn in beside the guards. Casual play only. It is not a tournament setup.",
  },
  setupPickerLabel: side => `${englishSideName(side)}'s opening setup`,
  armySwitchLabel: "Which army's setup to show",
  botStrengthLabel: "How strongly the bot plays, as an Elo rating",
  yourSideLabel: "Which army you play against the bot",
  flipBoardHelp: "Turns the pieces to face Han's player on Han's move, for the player sat across from you.",
  gamesLabel: "Which game is on the board",
  formatLabel: "Which of janggi's two games is being played",
  opponentLabel: "Who plays the other army",
  botNeedsIsolation: "This browser cannot run the bot: it needs a cross-origin isolated page.",
  elephantPairings: {
    matsang: "맞상 — the outer elephants face each other, and must trade",
    eotsang: "엇상 — both armies developed on the same wing",
  },
  botLock: ({beneath, choice, format}) => {
    if (choice === "Random") return `beat ${beneath} with both armies in a ${format.toLowerCase()} game first`;

    return `beat ${beneath} as ${choice} in a ${format.toLowerCase()} game first`;
  },
  formatExplanation: {
    casual: {
      summary: "The friendly game most janggi sites play.",
      points: [
        ["Both armies start set up. Either can be changed until the first move."],
        [
          "When the generals face each other down an open file, either player may call ",
          {strong: "bikjang"},
          ", and the game is a ",
          {strong: "draw"},
          ".",
        ],
        [
          "Players may agree to a draw, and once ",
          {strong: "both sides are under 30 points"},
          " a position that comes round a third time is a draw too.",
        ],
      ],
    },
    scored: {
      summary: "The Korea Janggi Association’s tournament game. There are no draws.",
      points: [
        ["Han picks its setup first and can’t change it. Cho picks after seeing Han’s."],
        [
          "Bikjang can only be called once ",
          {strong: "both sides are under 30 points"},
          ", and whoever is ahead on points ",
          {strong: "wins"},
          ". So does a position that comes round a third time under 30 points.",
        ],
      ],
    },
    both: "In both, two passes in a row end the game on points, and Han starts 1.5 points up for moving second. Your rating is kept separately for each.",
  },
};
