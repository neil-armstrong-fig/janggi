import {TUTORIAL_QUERY_PARAMETER} from "@src/react/pages/tutorial-link/TutorialLink";

/** The address with the `?tutorial=` link taken off and everything else as it was, so a reload opens the player's own game. */
export function addressWithoutTutorial(href: string): string {
  const address = new URL(href);
  address.searchParams.delete(TUTORIAL_QUERY_PARAMETER);

  return address.toString();
}
