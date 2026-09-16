/**
 * Where a sound is played: the context that schedules it, and the node it is routed into.
 *
 * The two travel together everywhere in here — an instrument needs the context to build its nodes and the
 * destination to connect them to — so they are one argument rather than two, and what is actually being
 * played stays the argument a reader looks for.
 */
export interface SoundOutput {
  readonly context: BaseAudioContext;
  readonly destination: AudioNode;
}
