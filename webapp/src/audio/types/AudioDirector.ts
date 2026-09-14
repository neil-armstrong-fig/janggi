import type {AudioChannels} from "@src/audio/types/AudioChannels";
import type {Cue} from "@src/audio/types/Cue";
import type {Mood} from "@src/audio/types/Mood";

/** Everything the page may ask of the sound. */
export interface AudioDirector {
  /**
   * Lets sound start, which a browser allows only in answer to a gesture. Safe to call on every tap;
   * nothing is heard until it has been called once.
   */
  readonly unlock: () => void;
  /** Plays the sounds of one change to the game — once, however many times it is asked with that id. */
  readonly play: (cues: readonly Cue[], id: number) => void;
  /**
   * Plays one sound straight away, every time it is asked — for what a player's own hand does that
   * changes nothing in the game: picking a piece up, pressing a control.
   */
  readonly sound: (cue: Cue) => void;
  /** Tells the music how the game feels now. */
  readonly setMood: (mood: Mood) => void;
  /** Sets how loud the sound effects and the music are, each fading to its new level. */
  readonly setChannels: (channels: AudioChannels) => void;
  /** Stops every sound and lets the audio device go. */
  readonly dispose: () => void;
}
