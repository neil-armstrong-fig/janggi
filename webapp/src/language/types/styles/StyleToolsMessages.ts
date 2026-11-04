import type {CopyScope} from "@janggi/shared/janggi/styles/CopyScope";
import type {Side} from "@janggi/shared/janggi/pieces/Side";

/** The ways to start a style over: back to where it began, from another the player has, or from a key. */
export interface StyleToolsMessages {
  readonly summary: string;
  readonly resetTo: (name: string) => string;
  readonly loadOneYouHave: string;
  readonly styleToLoad: string;
  readonly howMuch: string;
  readonly scopes: Record<CopyScope, string>;
  readonly load: string;
  readonly loadFromKey: string;
  readonly loadKey: string;
  readonly keyPlaceholder: string;
  readonly loaded: (name: string) => string;
  readonly loadedArmy: (side: Side, name: string) => string;
  readonly boardKeyHere: string;
  readonly piecesKeyHere: string;
}
