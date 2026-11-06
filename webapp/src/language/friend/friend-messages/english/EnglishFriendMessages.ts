import type {FriendMessages} from "@src/language/friend/friend-messages/FriendMessages";
import {englishSideName} from "@src/language/sides/english/EnglishSideName";

/** Playing a friend, in English. */
export const ENGLISH_FRIEND_MESSAGES: FriendMessages = {
  signIn: {
    title: "Sign in to join your friend",
    body: "Playing a friend needs a Google account, so the game knows who is who. Sign in and you will be taken straight to their game.",
    confirm: "Sign in with Google",
    dismiss: "Not now",
  },
  strip: {
    connection: {connecting: "Connecting…", connected: "Connected", reconnecting: "Reconnecting…"},
    states: {
      idle: "",
      "waiting-for-a-friend": "Waiting for friend to join",
      "choosing-setups": "Choosing arrangements",
      playing: "Playing",
      "opponent-left": "Your friend has left. Your game is kept for them",
      over: "Game over",
    },
    youResigned: "You resigned",
    opponentResigned: name => `${name} resigned`,
    friendResigned: "Your friend resigned",
    youAre: side => `You are ${englishSideName(side)}`,
    backToGame: "Back to this game",
    choose: "Choose",
    resign: "Resign",
    leave: "Leave",
  },
  sheet: {
    title: "Play a friend",
    closeLabel: "Close play a friend",
    reaching: "Reaching the room…",
    waiting: "Waiting for your friend. Give them the code, or send the link.",
    leaveRoom: "Leave this room",
  },
  makeCode: {
    title: "Make a code",
    chooseArmy: "Choose your army. Your friend plays the other.",
    sides: {cho: "Cho (first)", han: "Han (second)"},
    create: "Make a code",
    failed: "A code could not be made just now. Try again in a little while.",
  },
  enterCode: {
    title: "Enter code to join a room",
    codeLabel: "Your friend's code",
    join: "Join",
    refused: "There is no game with that code. Check it with your friend.",
  },
  codeGiven: {yourCode: "Your code", linkCopied: "Link copied", copyLink: "Copy a link to send"},
  setup: {
    playing: opponent => `You are playing ${opponent}`,
    choose: side => `Choose how to arrange your army (${englishSideName(side)}). Your friend chooses theirs unseen.`,
    chose: setup => `You chose the ${setup}. Waiting for your friend to choose.`,
  },
};
