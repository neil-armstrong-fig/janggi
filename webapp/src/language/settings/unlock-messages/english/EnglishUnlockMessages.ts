import type {UnlockMessages} from "@src/language/settings/unlock-messages/UnlockMessages";

/** What the unlocks are called, wherever they are shown, in English. */
export const ENGLISH_UNLOCK_MESSAGES: UnlockMessages = {
  theme: name => `${name} theme`,
  board: name => `${name} board`,
  pieces: name => `${name} pieces`,
  styleEditor: "Creating your own styles",
};
