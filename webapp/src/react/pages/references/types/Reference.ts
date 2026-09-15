import type {ReferenceLink} from "@src/react/pages/references/types/ReferenceLink";

export interface Reference extends ReferenceLink {
  readonly description: string;
  readonly licence?: string;
  readonly related?: readonly ReferenceLink[];
}
