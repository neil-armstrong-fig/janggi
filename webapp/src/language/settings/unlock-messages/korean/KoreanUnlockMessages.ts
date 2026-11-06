import type {UnlockMessages} from "@src/language/settings/unlock-messages/UnlockMessages";

/** What the unlocks are called, wherever they are shown, in Korean. */
export const KOREAN_UNLOCK_MESSAGES: UnlockMessages = {
  theme: name => `${name} 테마`,
  board: name => `${name} 판`,
  pieces: name => `${name} 말`,
  styleEditor: "나만의 스타일 만들기",
};
