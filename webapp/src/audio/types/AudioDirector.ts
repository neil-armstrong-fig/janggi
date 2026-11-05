import type {AudioChannels} from "@src/audio/types/AudioChannels";
import type {Countdown} from "@src/audio/types/Countdown";
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
  /**
   * Ticks out the last seconds before a deadline, a tick on each of them, each struck harder than the last — or stops,
   * given nothing. Seconds already gone by are not ticked, so a countdown handed over late joins it where it is.
   */
  readonly setCountdown: (countdown: Countdown | undefined) => void;
  /** Tells the music how the game feels now. */
  readonly setMood: (mood: Mood) => void;
  /** Sets how loud the sound effects and the music are, each fading to its new level. */
  readonly setChannels: (channels: AudioChannels) => void;
  /**
   * Holds every sound while the page is off screen — the app put away, the phone locked — and lets it
   * carry on from where it was when the page is back.
   */
  readonly setOnScreen: (onScreen: boolean) => void;
  /** Stops every sound and lets the audio device go. */
  readonly dispose: () => void;
}
