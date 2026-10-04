import type {AccountStatus} from "@src/redux/account/types/AccountStatus";
import type {FriendArrival} from "@src/react/pages/game/hooks/use-friend-room/types/FriendArrival";
import {friendCodeInSearch} from "@janggi/shared/janggi/online/friend-code/JoinLink";

interface Arriving {
  readonly status: AccountStatus;
  /** The address's query string, `?join=CODE` where a friend sent a link. */
  readonly search: string;
  /** The code of the room the device kept, if it kept one. */
  readonly keptCode: string | undefined;
}

/**
 * Which room, if any, a player arrives at as the page opens. **Only a signed-in player arrives anywhere** — a signed-out one
 * is left alone, whatever the address says, so nothing is asked of the API (the opt-in the account feature stands on). A link
 * outranks the kept code: it is what the player has just chosen to do.
 */
export function friendArrivalFor({status, search, keptCode}: Arriving): FriendArrival | undefined {
  if (status !== "signed-in") {
    return undefined;
  }

  const linked = friendCodeInSearch(search);
  if (linked !== undefined) {
    return {kind: "link", code: linked};
  }

  if (keptCode === undefined) {
    return undefined;
  }

  return {kind: "kept", code: keptCode};
}
