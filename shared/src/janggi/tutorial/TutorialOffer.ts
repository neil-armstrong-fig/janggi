/**
 * What the game offers a player of the guided tutorial, by how far they have come: to start it, to resume it from the
 * scene they reached, or to play it again once it is done. The You tab and the guide's link both carry it
 * (`data-offer`), so the acceptance tests read it against this list.
 */
export const TUTORIAL_OFFERS = ["start", "resume", "again"] as const;

export type TutorialOffer = (typeof TUTORIAL_OFFERS)[number];
