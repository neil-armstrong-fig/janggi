/** The query that opens the game on the tutorial, as the guide links to it. */
export const TUTORIAL_QUERY_PARAMETER = "tutorial";

/** The address of the game opening on the tutorial. */
export function tutorialAddressOf(game: string): string {
  return `${game}?${TUTORIAL_QUERY_PARAMETER}=true`;
}
