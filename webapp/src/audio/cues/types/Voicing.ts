import type {SoundOutput} from "@src/audio/types/SoundOutput";

/**
 * How one cue is played: scheduled on an output at a moment, struck as hard as its weight says.
 * Everything a voicing builds it starts and stops itself, so nothing is left behind to clean up.
 */
export type Voicing = (out: SoundOutput, when: number, weight: number) => void;
