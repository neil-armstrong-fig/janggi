import type {GuideBikjangRuleMessages} from "@src/language/types/guide/GuideBikjangRuleMessages";
import type {GuideRuleMessages} from "@src/language/types/guide/GuideRuleMessages";
import type {SentenceWithTwoLinks} from "@src/language/types/guide/SentenceWithTwoLinks";

export interface GuideRulesMessages {
  readonly eyebrow: string;
  readonly heading: string;
  readonly noRiver: GuideRuleMessages;
  readonly cannons: GuideRuleMessages;
  readonly palaces: GuideRuleMessages;
  readonly openings: GuideRuleMessages;
  readonly passing: GuideRuleMessages;
  readonly bikjang: GuideBikjangRuleMessages;
  /** Where each rule is researched, linking the rules and match sources and the opening research. */
  readonly sources: SentenceWithTwoLinks;
}
