import type {Mood} from "@src/audio/types/Mood";

/** The music, playing: told how the game feels, and stopped for good when it is no longer wanted. */
export interface Conductor {
  readonly setMood: (mood: Mood) => void;
  readonly stop: () => void;
}
