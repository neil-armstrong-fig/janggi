/** The two answers the welcome asks of music and of sound effects, which the settings sheet keeps as a volume. */
export const SOUND_CHOICE_NAMES = ["On", "Off"] as const;

export type SoundChoiceName = (typeof SOUND_CHOICE_NAMES)[number];
