/**
 * A second of white noise for a context, made once and kept — the raw material every percussive
 * sound here is cut from, by filtering it and shaping how loud it is.
 *
 * Kept in a `WeakMap` against its context rather than rebuilt per sound: a quick run of captures would
 * otherwise fill a fresh buffer with 48,000 random numbers each time, and a closed context lets its
 * buffer go with it.
 */
export function noiseBuffer(context: BaseAudioContext): AudioBuffer {
  const cached = BUFFERS.get(context);
  if (cached) return cached;

  const buffer = context.createBuffer(1, context.sampleRate, context.sampleRate);
  const samples = buffer.getChannelData(0);
  for (let index = 0; index < samples.length; index += 1) samples[index] = Math.random() * 2 - 1;

  BUFFERS.set(context, buffer);

  return buffer;
}

const BUFFERS = new WeakMap<BaseAudioContext, AudioBuffer>();
