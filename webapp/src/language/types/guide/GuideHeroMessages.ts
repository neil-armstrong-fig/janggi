import type {GuideFactMessages} from "@src/language/types/guide/GuideFactMessages";

export interface GuideHeroMessages {
  readonly eyebrow: string;
  readonly heading: string;
  readonly summary: string;
  readonly play: string;
  readonly install: string;
  readonly startWithRules: string;
  readonly accountNote: string;
  readonly factsLabel: string;
  /** Board, players, pieces and goal, in that order. */
  readonly facts: readonly GuideFactMessages[];
}
