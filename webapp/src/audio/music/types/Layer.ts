import type {Step} from "@src/audio/music/types/Step";

/** One layer of the music. */
export interface Layer {
  /** Everything the layer plays goes through this, and the conductor turns it up and down. */
  readonly output: GainNode;
  /** Schedules whatever the layer plays on one step. */
  readonly play: (step: Step) => void;
  /** Silences and lets go of anything the layer keeps sounding, for good. */
  readonly stop: () => void;
}
