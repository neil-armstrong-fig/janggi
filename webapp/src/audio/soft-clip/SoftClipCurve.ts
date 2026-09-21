/**
 * The shape a `WaveShaperNode` gives the last stage of the output: straight, so quiet sound passes
 * unchanged, and then easing over into a ceiling just below full scale, so a peak that would have
 * clipped at the device is rounded instead.
 *
 * **It has no memory.** Whatever comes in at one instant goes out the same way at the next, so unlike a
 * compressor it can never pump the music under a sound effect, and it sounds the same in every browser.
 * That is why it stands where a compressor did: Firefox's took a short sound effect down by some 12 dB
 * and reshaped it, and Chrome's left it alone.
 *
 * The table answers inputs from −1 to +1; anything past either end is held at the ceiling.
 */
export function softClipCurve(): Float32Array<ArrayBuffer> {
  const curve = new Float32Array(CURVE_POINTS);

  for (let index = 0; index < CURVE_POINTS; index += 1) {
    curve[index] = softClip(-1 + (2 * index) / (CURVE_POINTS - 1));
  }

  return curve;
}

/** Straight up to the knee; from there a curve bending flat, so the slope never rises above one. */
function softClip(input: number): number {
  const magnitude = Math.abs(input);
  if (magnitude <= KNEE) return input;

  const past = magnitude - KNEE;
  const clipped = KNEE + past - (past * past) / (2 * (1 - KNEE));

  return Math.sign(input) * clipped;
}

/**
 * Odd, so the table has a point at exactly nought and both halves of the wave are treated alike, and
 * fine enough that the linear interpolation between points cannot be heard.
 */
const CURVE_POINTS = 2049;

/** Below this a sound is left alone. The ceiling this gives is `1 − (1 − KNEE) / 2`: −1.2 dB below full scale. */
const KNEE = 0.75;
