import type {Layer} from "@src/audio/music/types/Layer";
import {PYEONGJO} from "@src/audio/modes/Pyeongjo";
import type {Step} from "@src/audio/music/types/Step";
import {bassNoteAt} from "@src/audio/music/patterns/BassNoteAt";
import {gayageum} from "@src/audio/instruments/Gayageum";
import {pitchOf} from "@src/audio/modes/PitchOf";

/**
 * The ground under the music: a low 가야금 string plucked twice a 장단 cycle, under the waiting theme
 * and the game's own music alike. What it plucks is `bassNoteAt`'s to say; this plays it.
 */
export function bassLayer(context: BaseAudioContext): Layer {
  const output = context.createGain();
  output.gain.value = 0;

  return {
    output,
    play: (step: Step) => {
      const note = bassNoteAt(step.index, step.underWay, step.rhythm);
      if (!note) return;

      gayageum({context, destination: output}, step.time, {
        frequency: pitchOf(ROOT, PYEONGJO, note.degree),
        weight: note.weight * WEIGHT,
        length: step.seconds * note.steps,
      });
    },
    stop: () => output.disconnect(),
  };
}

/** The key the whole score is in, in hertz — A, an octave below the melodies' root. */
const ROOT = 110;

const WEIGHT = 0.8;
