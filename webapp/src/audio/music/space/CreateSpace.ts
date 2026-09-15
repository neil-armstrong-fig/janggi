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
      samples[index] = (Math.random() * 2 - 1) * (1 - index / length) ** DECAY;
    }
  }

  return tail;
}

/** How long the room rings for, in seconds, and how steeply it dies away across that time. */
const TAIL_S = 2.8;
const DECAY = 3;

/** How loud the ringing is under the music itself. */
const WET = 0.35;

/** A real room swallows the top of a sound first; above this the ringing is let go. */
const DAMPING_HZ = 3_500;
