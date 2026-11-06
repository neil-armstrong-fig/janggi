import type {TutorialOffer} from "@janggi/shared/janggi/tutorial/TutorialOffer";

export interface GuideHeroMessages {
  readonly eyebrow: string;
  readonly heading: string;
  readonly summary: string;
  readonly play: string;
  readonly install: string;
  readonly startWithRules: string;
  /** The link to the guided tutorial, by what it offers this device. */
  readonly tutorial: Record<TutorialOffer, string>;
  readonly accountNote: string;
  readonly factsLabel: string;
  /** Board, players, pieces and goal, in that order. */
  readonly facts: readonly GuideFactMessages[];
}

/** One row of the quick facts beside the heading: what it is about, and what is true of it. */
interface GuideFactMessages {
  readonly label: string;
  readonly value: string;
}
