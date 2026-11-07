import type {TutorialOffer} from "@janggi/shared/janggi/tutorial/TutorialOffer";

export interface GuidedGameWords {
  readonly name: string;
  readonly offers: Record<TutorialOffer, string>;
}
