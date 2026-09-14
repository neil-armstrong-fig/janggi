/**
 * How one cue is played: scheduled on a context at a moment, into wherever effects are routed, struck
 * as hard as its weight says. Everything a voicing builds it starts and stops itself, so nothing is
 * left behind to clean up.
 */
export type Voicing = (context: BaseAudioContext, destination: AudioNode, when: number, weight: number) => void;
