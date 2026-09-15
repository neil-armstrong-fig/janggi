import type {Reference} from "@src/react/pages/references/types/Reference";

export interface ReferenceSection {
  readonly id: string;
  readonly title: string;
  readonly introduction: string;
  readonly references: readonly Reference[];
}
