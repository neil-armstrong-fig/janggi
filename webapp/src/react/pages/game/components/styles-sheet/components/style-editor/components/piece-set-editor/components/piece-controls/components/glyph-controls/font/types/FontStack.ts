import type {FontStackName} from "@janggi/shared/janggi/styles/FontStackName";

/** A face a piece's writing may be set in, named for how it looks. */
export interface FontStack {
  readonly name: FontStackName;
  /** A full CSS font stack, ending in a generic family, since nothing is bundled. */
  readonly css: string;
}
