import type {YouAccountMessages} from "@src/language/types/you/YouAccountMessages";
import type {YouKeyMessages} from "@src/language/types/you/YouKeyMessages";
import type {YouLinksMessages} from "@src/language/types/you/YouLinksMessages";
import type {YouProgressMessages} from "@src/language/types/you/YouProgressMessages";
import type {YouSaveTransferMessages} from "@src/language/types/you/YouSaveTransferMessages";

/** Everything on the You tab but the language picker, which `LanguageMessages` has. */
export interface YouMessages {
  readonly progress: YouProgressMessages;
  readonly account: YouAccountMessages;
  readonly links: YouLinksMessages;
  readonly version: string;
  readonly saveTransfer: YouSaveTransferMessages;
  readonly keys: YouKeyMessages;
}
