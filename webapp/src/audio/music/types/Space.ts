/** The room the music is played in. */
export interface Space {
  /** Whatever is played into this is heard both as it is and ringing round the room. */
  readonly input: GainNode;
  /** Lets go of the room, for good. */
  readonly stop: () => void;
}
