/** How far a player has come through the tutorial, kept on the device so it can be resumed and its XP earned once. */
export interface TutorialProgress {
  /** The furthest scene started since it was last completed, counting from nought: where Resume picks up. */
  readonly reached: number;
  /** Whether it has been played through to its closing card, which is what earns its XP. */
  readonly completed: boolean;
}
