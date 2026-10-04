import {JOIN_QUERY_PARAMETER} from "@janggi/shared/janggi/online/friend-code/JoinLink";

/** The address with the `?join=` link taken off, and everything else in it as it was — so a reload is the kept code's job, not the link's. */
export function addressWithoutLink(href: string): string {
  const address = new URL(href);
  address.searchParams.delete(JOIN_QUERY_PARAMETER);

  return address.toString();
}
