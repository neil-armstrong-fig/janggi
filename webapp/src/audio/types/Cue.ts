import type {CueName} from "@src/audio/types/CueName";

/** One sound to play, and how hard — the same clack struck softly for a soldier and hard for a chariot. */
export interface Cue {
  readonly name: CueName;
  /** From nought to one: how loud and how heavy to strike it. */
  readonly weight: number;
}
