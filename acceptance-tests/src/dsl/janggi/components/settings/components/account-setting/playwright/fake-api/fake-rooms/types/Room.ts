import type {FriendCode} from "@janggi/shared/janggi/online/friend-code/FriendCode";
import type {SeatedAction} from "@janggi/shared/janggi/online/messages/action/SeatedAction";
import type {Seat} from "@src/dsl/janggi/components/settings/components/account-setting/playwright/fake-api/fake-rooms/types/Seat";
import type {Side} from "@janggi/shared/janggi/pieces/Side";

/** A room for two friends: the code it was made under, the army its host asked for, who sits there, and what has been done. */
export interface Room {
  readonly code: FriendCode;
  readonly hostSide: Side;
  /** Whose room it is: the one account that may have it open at a time. */
  readonly host: object;
  /** Set once a player has resigned, which frees the host to make another room. */
  finished: boolean;
  readonly seats: Seat[];
  readonly history: SeatedAction[];
}
