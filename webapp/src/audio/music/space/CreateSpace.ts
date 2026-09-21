import type {Space} from "@src/audio/music/types/Space";

/**
 * A room for the music to ring in, out to `destination`.
 *
 * Synthesised notes played straight out sound as if they were in a box, and that more than their tone
 * is what makes a long held line tiring to sit under. Heard in a room, the same notes bloom and soften
 * at their ends. What goes in is passed on as it is, and a quieter, darkened copy of it is sent round
 * a reverb underneath.
 *
 * **The room is made, not recorded**, like every sound here: a convolver is handed noise dying away
 * along a curve, a little differently in each ear, which it hears as the tail of a hall.
 */
export function createSpace(context: BaseAudioContext, destination: AudioNode): Space {
  const input = context.createGain();

  const room = context.createConvolver();
  room.buffer = tailOf(context);

  const damping = context.createBiquadFilter();
  damping.type = "lowpass";
  damping.frequency.value = DAMPING_HZ;

  const wet = context.createGain();
  wet.gain.value = WET;

  input.connect(destination);
  input.connect(room).connect(damping).connect(wet).connect(destination);

  return {
    input,
    stop: () => {
      input.disconnect();
      wet.disconnect();
    },
  };
}

/** A room's answer to a single click: noise in each ear, independently, dying away along a curve. */
function tailOf(context: BaseAudioContext): AudioBuffer {
  const length = Math.floor(context.sampleRate * TAIL_S);
  const tail = context.createBuffer(2, length, context.sampleRate);

  for (let channel = 0; channel < tail.numberOfChannels; channel += 1) {
    const samples = tail.getChannelData(channel);

    for (let index = 0; index < length; index += 1) {
      const seconds = index / context.sampleRate;
      const dyingAway = (1 - seconds / FULL_TAIL_S) ** DECAY;
      const tapered = Math.min(1, (TAIL_S - seconds) / TAPER_S);

      samples[index] = (Math.random() * 2 - 1) * dyingAway * tapered;
    }
  }

  return tail;
}

/**
 * How long the room rings for, in seconds, and how steeply it dies away across that time.
 *
 * The room is cut short and not steepened: it dies along the curve of a 2.8 second room, `DECAY` and all,
 * and is let go at 1.6, where that curve is under −20 dB, the last stretch tapering to nothing. The
 * convolver is the dearest node the music has and its cost goes with the length of the tail, so the
 * seconds nobody hears under the music are not paid for.
 */
const TAIL_S = 1.6;
const FULL_TAIL_S = 2.8;
const DECAY = 3;

/** The end of the tail is faded over this long, so cutting it short leaves no click. */
const TAPER_S = 0.25;

/** How loud the ringing is under the music itself. */
const WET = 0.35;

/** A real room swallows the top of a sound first; above this the ringing is let go. */
const DAMPING_HZ = 3_500;
