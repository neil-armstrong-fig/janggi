import type {Slide} from "@src/audio/instruments/types/Slide";

/** One long note of the lead: which degree of the mode, how many steps it is held, and how it is shaped. */
export interface LeadNote {
  readonly degree: number;
  readonly steps: number;
  readonly slide: Slide;
}
