import type {Messages} from "@src/language/types/Messages";
import type {Side} from "@janggi/shared/janggi/pieces/Side";

/** The game in English, which every other language is checked against and which a player is read to until they choose another. */
export const ENGLISH: Messages = {
  heading: "Janggi: Korean Chess",
  tabs: {Play: "Play", Look: "Look", Sound: "Sound", You: "You"},
  controls: {
    pass: "Pass",
    bikjang: "Bikjang",
    draw: "Draw",
    undo: "Undo",
    redo: "Redo",
    settings: "Settings",
  },
  sides: {han: "Han", cho: "Cho"},
  announcements: {
    botUnavailable: "Bot unavailable",
    botLoading: "Bot is loading",
    botLayingOut: "Bot is laying out",
    botThinking: "Bot is thinking",
    won: side => `${sideName(side)} wins`,
    wonOnPoints: side => `${sideName(side)} wins on points`,
    drawn: {bikjang: "Drawn by bikjang", repetition: "Drawn by repetition", agreement: "Drawn by agreement"},
    inCheck: side => `${sideName(side)} is in check`,
    toMove: side => `${sideName(side)} to move`,
    layingOut: side => `${sideName(side)} to lay out`,
  },
  result: {
    won: side => `${sideName(side)} wins by checkmate`,
    wonOnPoints: side => `${sideName(side)} wins on points`,
    drawn: {bikjang: "Drawn by bikjang", repetition: "Drawn by repetition", agreement: "Drawn by agreement"},
    newGame: "New game",
    showBoard: "Show board",
    newGameAt: botElo => `New game at ${botElo}`,
    botPlaying: side => `The bot, playing ${sideName(side)},`,
    bikjangExplanation: (caller, drawn) => {
      const called = `${caller} called bikjang: the two generals stood facing each other down an open file, with nothing between them.`;
      if (drawn) {
        return `${called} Unlike chess, janggi lets the player to move call that a draw, so leaving the generals facing hands the other player the call.`;
      }

      return `${called} In a scored game that call ends the game, and it is settled on points.`;
    },
    repetitionExplanation: drawn => {
      const cause =
        "The same position stood a third time. With each army under thirty points, repeating is allowed, so nothing else would end it.";
      if (drawn) return `${cause} A casual game is drawn.`;

      return `${cause} A scored game has no draw, so it stops and the points decide it.`;
    },
  },
  play: {
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
    setupOf: side => `${sideName(side)}'s setup`,
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
  },
  look: {
    board: "Board",
    pieces: "Pieces",
    boardOf: side => `${sideName(side)}'s board`,
    piecesOf: side => `${sideName(side)}'s pieces`,
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
  },
  sound: {
    soundEffects: "Sound effects",
    muteSoundEffects: "Mute sound effects",
    music: "Music",
    muteMusic: "Mute music",
    muted: "Muted",
  },
  record: {
    title: "Your record",
    closeLabel: "Close your record",
    rating: format => `${format} Elo`,
    bot: "Bot",
    games: "Games",
    winsDrawsLosses: "W-D-L",
    winRate: "Win",
    winRateAs: side => `Win rate as ${sideName(side)}`,
    noGames: "No games against the bot yet.",
    gameLine: (botElo, side) => `Bot ${botElo} · as ${sideName(side)}`,
    results: {won: "Won", drawn: "Drawn", lost: "Lost"},
    endings: {
      checkmate: "checkmate",
      points: "on points",
      bikjang: "bikjang",
      repetition: "repetition",
      agreement: "agreement",
      abandoned: "left unfinished",
    },
    reset: "Reset record",
    resetLabel: "Reset your record",
    resetQuestion: "Clear your rating and every game, in both formats? This cannot be undone.",
    keepIt: "Keep it",
    resetConfirm: "Reset",
  },
  overlays: {
    drawOffer: offeredBy => `${sideName(offeredBy)} offers a draw`,
    drawOfferNote: "Both players have to agree to it.",
    accept: "Accept",
    decline: "Decline",
    theBot: "The bot",
    drawDeclined: who => `${who} declined the draw. The game carries on.`,
    botPlays: botSide => `The bot plays ${sideName(botSide)}, which moves first`,
    settingsStayOpen: "The settings stay open until it does.",
    letTheBotStart: "Let the bot start",
    wakingTheBot: "Waking the bot…",
    botCouldNotStart: "The bot could not be started",
    tryAgain: "Try again",
    repetitionNotice:
      "A move that would repeat a position a third time is not allowed. Unlike chess, repeating is no draw: the move is held back and the game carries on.",
  },
  plaque: {bot: "Bot", player: "You"},
  welcome: {
    title: "Welcome to Janggi",
    aboutTheGame:
      "Janggi is Korean chess. Two armies, Cho and Han, trade blows across the board, and whoever captures the opposing general wins.",
    aboutThisDevice:
      "You start against a gentle bot, and you do not need an account. Everything you set is kept on this device.",
    next: "Next",
    choicesTitle: "Set it up your way",
    music: "Music",
    soundEffects: "Sound effects",
    animations: "Animations",
    showWhereAPieceCanMove: "Show where a piece can move",
    answers: {On: "On", Off: "Off", Full: "Full", Reduced: "Reduced", Shown: "Shown", Hidden: "Hidden"},
    changeAnyTime: "You can change all of these any time in Settings.",
    takeTheTour: "Take the quick tour",
    skip: "Skip, just play",
  },
  tour: {
    steps: styleEditorXp => ({
      "pick-up": {title: "Pick up a piece", body: "Tap one of your pieces to see everywhere it can go."},
      move: {
        title: "Make a move",
        body: "Tap a highlighted point to move there. Sliding a soldier sideways is a solid way to open.",
      },
      controls: {
        title: "The controls",
        body: "Under the board, Pass rests your turn, Bikjang calls the generals' face-off, and Draw offers a draw. Undo and Redo take a move back. They are switched off against the bot and are for games between two people.",
      },
      settings: {
        title: "Settings",
        body: "Everything else lives in Settings: how the game is played, how it looks, how it sounds, and your progress. Tap it to open.",
      },
      xp: {
        title: "Earn XP",
        body: "Playing earns XP, and XP unlocks new boards, new pieces and stronger bots.",
      },
      styles: {
        title: "Make it your own",
        body: `At ${styleEditorXp} XP you can design your own board and pieces. Styles other players share are free to import.`,
      },
      account: {
        title: "Keep it in sync",
        body: "Signing in with Google is optional: skip it any time and Janggi plays the same. It keeps your XP, unlocks and styles in step across your devices, and it is the only way to play a friend, so sign in first if you want to.",
      },
      friend: {
        title: "Play a friend",
        body: "Tap Online to make a code and send it to a friend, or to enter theirs, and play each other live. You both need to be signed in.",
      },
      guide: {
        title: "New to Janggi?",
        body: "The guide teaches every piece and the rules in about five minutes. Read it before your first real game.",
      },
    }),
    card: "Quick tour",
    stepOf: (step, count) => `Step ${step} of ${count}`,
    openTheGuide: "Open the guide",
    skip: "Skip tour",
    back: "Back",
    next: "Next",
    finish: "Finish",
  },
  translationNotice: {
    title: "Korean translation in progress",
    body: "The Korean translation is a work in progress. Some of the game is still in English, and some wording may be wrong. Thank you for your patience.",
    dismiss: "OK",
  },
  language: {label: "Language", names: {en: "English", ko: "한국어"}},
};

function sideName(side: Side): string {
  return ENGLISH.sides[side];
}
