import type {Layer} from "@src/audio/music/types/Layer";
import {PYEONGJO} from "@src/audio/modes/Pyeongjo";
import type {Step} from "@src/audio/music/types/Step";
import {answerNoteAt} from "@src/audio/music/patterns/AnswerNoteAt";
import {daegeum} from "@src/audio/instruments/Daegeum";
import {pitchOf} from "@src/audio/modes/PitchOf";

/**
 * The 대금 that breathes long notes under the soloist where its phrases turn and close, joining once the
 * fight has opened. What it holds is `answerNoteAt`'s to say; this plays it.
 */
export function answerLayer(context: BaseAudioContext): Layer {
  const output = context.createGain();
  output.gain.value = 0;

  return {
    output,
    play: (step: Step) => {
      const note = answerNoteAt(step.index);
      if (!note) return;

      daegeum(context, output, step.time, {
        frequency: pitchOf(ROOT, PYEONGJO, note.degree),
        weight: WEIGHT,
        length: step.seconds * note.steps * HELD_FOR,
      });
    },
    stop: () => output.disconnect(),
  };
}

/** The flute's root, in hertz — an octave above the soloist's, so it sings over the plucked strings. */
const ROOT = 440;

const WEIGHT = 0.5;

const HELD_FOR = 0.95;
