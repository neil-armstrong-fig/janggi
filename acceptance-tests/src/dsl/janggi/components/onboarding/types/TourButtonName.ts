/** The buttons that move the tour along, as a screen reader is told them — whatever they draw. */
export const TOUR_BUTTON_NAMES = ["Back", "Next", "Finish"] as const;

export type TourButtonName = (typeof TOUR_BUTTON_NAMES)[number];
