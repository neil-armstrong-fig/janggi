import {TUTORIAL_QUERY_PARAMETER} from "@src/react/pages/tutorial-link/TutorialLink";

/** Whether the address asks for the game to open on the tutorial (`?tutorial=true`). */
export function tutorialAskedFor(search: string): boolean {
  return new URLSearchParams(search).get(TUTORIAL_QUERY_PARAMETER) === "true";
}
