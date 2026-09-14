import type {Layer} from "@src/audio/music/types/Layer";
import {PYEONGJO} from "@src/audio/modes/Pyeongjo";
import type {PhraseMemory} from "@src/audio/music/types/PhraseMemory";
import type {Step} from "@src/audio/music/types/Step";
import {leadNoteAt} from "@src/audio/music/patterns/LeadNoteAt";
import {pitchOf} from "@src/audio/modes/PitchOf";
import {piri} from "@src/audio/instruments/Piri";

/**
 * The lead of the game's own music: one long reed note to each beat of the cycle, in the manner of
 * 수제천's piri, there from the first move. Which note, and how it is shaped, is `leadNoteAt`'s to say;
 * this plays it, and leaves the note it ended on in `phrase` for the echo to take up.
 */
export function leadLayer(context: BaseAudioContext, phrase: PhraseMemory): Layer {
  const output = context.createGain();
  output.gain.value = 0;

  return {
    output,
    play: (step: Step) => {
      const note = leadNoteAt(step.index, phrase.degree, Math.random(), Math.random());
      if (!note) return;

      phrase.degree = note.degree;
      piri(context, output, step.time, {
        frequency: pitchOf(ROOT, PYEONGJO, note.degree),
        weight: WEIGHT,
        length: step.seconds * note.steps * HELD_FOR_BEAT,
        slide: note.slide,
      });
    },
    stop: () => output.disconnect(),
  };
}

/** The note the lead is counted from, in hertz. */
const ROOT = 220;

const WEIGHT = 0.7;

/** How much of its beat a note is held for, leaving the reed a breath before the next. */
const HELD_FOR_BEAT = 0.96;
