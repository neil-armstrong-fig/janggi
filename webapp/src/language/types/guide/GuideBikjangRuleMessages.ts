import type {MarkedText} from "@src/language/types/guide/MarkedText";

/** The rule about facing generals, which names the call in italics where the other rules name nothing. */
export interface GuideBikjangRuleMessages {
  readonly title: string;
  readonly body: MarkedText;
}
