import type {FriendStripMessages} from "@src/language/friend/friend-messages/types/FriendStripMessages";
import type {Side} from "@janggi/shared/janggi/pieces/Side";

/** Everything playing a friend says: the sheet, the strip over the board and the prompt a link meets. */
export interface FriendMessages {
  readonly signIn: FriendSignInMessages;
  readonly strip: FriendStripMessages;
  readonly sheet: FriendSheetMessages;
  readonly makeCode: FriendMakeCodeMessages;
  readonly enterCode: FriendEnterCodeMessages;
  readonly codeGiven: FriendCodeGivenMessages;
  readonly setup: FriendSetupMessages;
}

interface FriendCodeGivenMessages {
  readonly yourCode: string;
  readonly linkCopied: string;
  readonly copyLink: string;
}

interface FriendEnterCodeMessages {
  readonly title: string;
  readonly codeLabel: string;
  readonly join: string;
  readonly refused: string;
}

interface FriendMakeCodeMessages {
  readonly title: string;
  readonly chooseArmy: string;
  readonly sides: Record<Side, string>;
  readonly create: string;
  readonly failed: string;
}

interface FriendSetupMessages {
  readonly playing: (opponent: string) => string;
  readonly choose: (side: Side) => string;
  /** Handed the setup's name in the language being read. */
  readonly chose: (setup: string) => string;
}

interface FriendSheetMessages {
  readonly title: string;
  readonly closeLabel: string;
  readonly reaching: string;
  readonly waiting: string;
  readonly leaveRoom: string;
}

interface FriendSignInMessages {
  readonly title: string;
  readonly body: string;
  readonly confirm: string;
  readonly dismiss: string;
}
