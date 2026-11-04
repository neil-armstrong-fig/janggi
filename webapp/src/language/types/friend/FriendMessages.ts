import type {FriendCodeGivenMessages} from "@src/language/types/friend/FriendCodeGivenMessages";
import type {FriendEnterCodeMessages} from "@src/language/types/friend/FriendEnterCodeMessages";
import type {FriendMakeCodeMessages} from "@src/language/types/friend/FriendMakeCodeMessages";
import type {FriendSetupMessages} from "@src/language/types/friend/FriendSetupMessages";
import type {FriendSheetMessages} from "@src/language/types/friend/FriendSheetMessages";
import type {FriendSignInMessages} from "@src/language/types/friend/FriendSignInMessages";
import type {FriendStripMessages} from "@src/language/types/friend/FriendStripMessages";

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
