import type {Layer} from "@src/audio/music/types/Layer";
import {PYEONGJO} from "@src/audio/modes/Pyeongjo";
import type {PhraseMemory} from "@src/audio/music/types/PhraseMemory";
import type {Step} from "@src/audio/music/types/Step";
import {daegeum} from "@src/audio/instruments/Daegeum";
import {echoNoteAt} from "@src/audio/music/patterns/EchoNoteAt";
import {pitchOf} from "@src/audio/modes/PitchOf";

/**
 * The flute that answers the lead on the last beat of every cycle, while the reed rests — joining once
 * the game has opened up. What it answers with is `echoNoteAt`'s to say, from the note the lead left in
 * `phrase`; this plays it on the 대금.
 */
export function echoLayer(context: BaseAudioContext, phrase: PhraseMemory): Layer {
  const output = context.createGain();
  output.gain.value = 0;

  return {
    output,
    play: (step: Step) => {
      const note = echoNoteAt(step.index, phrase.degree, Math.random());
      if (!note) return;

      daegeum(context, output, step.time, {
        frequency: pitchOf(ROOT, PYEONGJO, note.degree),
        weight: WEIGHT,
        length: step.seconds * note.steps * HELD_FOR_BEAT,
      });
    },
    stop: () => output.disconnect(),
  };
}

/** The same root as the lead, so the answer is in the lead's own voice range. */
const ROOT = 220;

const WEIGHT = 0.6;

const HELD_FOR_BEAT = 0.95;
