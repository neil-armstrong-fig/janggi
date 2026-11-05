import {parseFriendCode} from "@janggi/shared/janggi/online/friend-code/ParseFriendCode";
import type {FriendCode} from "@janggi/shared/janggi/online/friend-code/FriendCode";

/** The query parameter a shared link carries the code in: `https://…/?join=ABCDEFGH`. */
export const JOIN_QUERY_PARAMETER = "join";

/** The address that takes whoever opens it into the room, from the site's own address (any query it has is dropped). */
export function joinLinkFor(siteAddress: string, code: FriendCode): string {
  const link = new URL(siteAddress);
  link.search = "";
  link.hash = "";
  link.searchParams.set(JOIN_QUERY_PARAMETER, code);

  return link.toString();
}

/** The code a page's `location.search` carries, or undefined where it carries none or a bad one. */
export function friendCodeInSearch(search: string): FriendCode | undefined {
  const text = new URLSearchParams(search).get(JOIN_QUERY_PARAMETER) ?? undefined;
  if (text === undefined) return undefined;

  return parseFriendCode(text);
}
