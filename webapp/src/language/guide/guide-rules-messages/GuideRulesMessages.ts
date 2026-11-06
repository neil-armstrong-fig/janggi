import type {SentenceWithTwoLinks} from "@src/language/types/SentenceWithTwoLinks";
import type {MarkedText} from "@src/language/guide/types/MarkedText";

export interface GuideRulesMessages {
  readonly eyebrow: string;
  readonly heading: string;
  readonly noRiver: GuideRuleMessages;
  readonly cannons: GuideRuleMessages;
  readonly palaces: GuideRuleMessages;
  readonly openings: GuideRuleMessages;
  readonly passing: GuideRuleMessages;
  readonly bikjang: GuideBikjangRuleMessages;
  /** That the move repeating a position a third time is refused, unlike chess's draw, and what happens under 30 points. */
  readonly repetition: GuideRuleMessages;
  /** Where each rule is researched, linking the rules and match sources and the opening research. */
  readonly sources: SentenceWithTwoLinks;
}

/** The rule about facing generals, which names the call in italics where the other rules name nothing. */
interface GuideBikjangRuleMessages {
  readonly title: string;
  readonly body: MarkedText;
}

/** One of the rules that set janggi apart: what to call it, and what it says. */
interface GuideRuleMessages {
  readonly title: string;
  readonly body: string;
}
