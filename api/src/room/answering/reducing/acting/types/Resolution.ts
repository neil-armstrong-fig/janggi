import type {GameState} from "@janggi/engine/types/GameState";
import type {RejectionReason} from "@janggi/shared/janggi/online/messages/RejectionReason";

/** What an action comes to once the engine has been asked: the game it leads to, or why it may not be done. */
export type Resolution = {readonly game: GameState} | {readonly refusal: RejectionReason};
