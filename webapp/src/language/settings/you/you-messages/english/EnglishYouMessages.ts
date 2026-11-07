import type {YouMessages} from "@src/language/settings/you/you-messages/YouMessages";

/** The You tab, in English. */
export const ENGLISH_YOU_MESSAGES: YouMessages = {
  progress: {
    xp: amount => `${amount} XP`,
    explainLabel: "How XP is earned",
    explanation:
      "Finish a game against the bot to earn XP. A win earns more, and so does a scored game. Beat a bot to open the one above it, with each army kept apart.",
    nextUnlock: (xp, unlocks) => `Next, at ${xp} XP: ${unlocks}`,
    allUnlocked: "Everything is unlocked.",
    barLabel: "Progress to the next unlock",
  },
  account: {
    summary: (name, sync) => `${name} · ${sync}`,
    signedOut: "Signed out",
    syncSummary: sync => {
      if (sync === "idle") return "Syncing…";

      if (sync === "synced") return "Synced";

      if (sync === "paused") return "Sync paused";

      return "Device only";
    },
    label: "Account",
    heading: "Keep your game in sync",
    signedOutIntro:
      "Sign in with Google to keep your XP, unlocks, bot record, styles and look in step across devices. Janggi works the same without an account.",
    whatIsKept:
      "Janggi keeps an anonymous Google account ID, your display name and your save. It never sees your Google name or email.",
    signIn: "Sign in with Google",
    signingIn: "Finishing sign-in…",
    signedInWith: "Signed in with Google",
    sync: {
      idle: "Syncing…",
      synced: "Your progress is kept in step.",
      paused: "Sync paused. It will try again after your next change.",
      tooLarge:
        "Your data is too big to sync, so it is kept on this device only. Deleting a style or two would let it sync again.",
    },
    signOut: "Sign out",
    deleteAccount: "Delete my account",
    deleteWhatTheServerHolds: "Delete what the server holds",
    legal: {
      start: "By signing in, you agree to the ",
      firstLink: "Terms of Service",
      middle: " and acknowledge the ",
      secondLink: "Privacy Policy",
      end: ".",
    },
    name: {
      label: "Display name",
      placeholder: "Change your display name",
      save: "Save",
      badLength: longest => `A name is 1 to ${longest} characters, with no line breaks.`,
      notAllowed: "That name is not allowed.",
      couldNotChange: "Could not change your name just now. Try again later.",
      changed: "Name changed.",
    },
    turnNotifications: {
      label: "Tell me when it is my turn",
      on: "On",
      off: "Off",
      blocked:
        "Notifications are blocked for Janggi in your browser's settings, so it cannot tell you when it is your turn.",
    },
  },
  links: {
    heading: "App & help",
    install: "Install Janggi",
    guide: {title: "How to play Janggi", note: "Rules & piece guide"},
    replayTour: {title: "Replay the tour", note: "Show me around again"},
    references: {title: "References & credits", note: "Lots of resources"},
    developerWebsite: "Developer's website",
    repository: {title: "Source code", note: "Github"},
  },
  version: "Version",
  saveTransfer: {
    heading: "Save key",
    summary: "Copy or load",
    toggle: "Move your progress to another device",
    explanation:
      "A save key lets you move your progress by hand, with no account and no connection, so Janggi can stay fully offline. It holds your XP, the bots you have beaten and your own styles, and loading one replaces your XP. If you would rather not copy keys around, signing in with Google above keeps everything in sync for you.",
    copy: "Copy save key",
    load: "Load save",
    placeholder: "Paste a save key",
    notAKey: "That is not a save key.",
    loaded: "Loaded. Your XP and unlocks are the save's now.",
  },
  keys: {
    keyLabel: "The key to share",
    copied: "Copied. Keep it somewhere safe, or send it on.",
    selectToCopy: "Select the key above and copy it.",
  },
};
