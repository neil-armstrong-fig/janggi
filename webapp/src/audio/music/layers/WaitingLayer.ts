import type {Layer} from "@src/audio/music/types/Layer";
import {PYEONGJO} from "@src/audio/modes/Pyeongjo";
import type {Step} from "@src/audio/music/types/Step";
import {gayageum} from "@src/audio/instruments/Gayageum";
import {pitchOf} from "@src/audio/modes/PitchOf";
import {waitingNoteAt} from "@src/audio/music/patterns/WaitingNoteAt";

/**
 * The music before a game is under way: a plucked 가야금 over a soft bass while a player sets the game
 * up. What it plucks is `waitingNoteAt`'s to say; this plays it, softly, and leaves each string ringing
 * for as many steps as the theme gives it.
 */
export function waitingLayer(context: BaseAudioContext): Layer {
  const output = context.createGain();
  output.gain.value = 0;

  const trebleSoftener = context.createBiquadFilter();
  trebleSoftener.type = "lowpass";
  trebleSoftener.frequency.value = TREBLE_CUTOFF_HZ;
  trebleSoftener.Q.value = 0.7;
  trebleSoftener.connect(output);

  return {
    output,
    play: (step: Step) => {
      const note = waitingNoteAt(step.index, Math.random());
      if (!note) return;

      gayageum({context, destination: trebleSoftener}, step.time, {
        frequency: pitchOf(ROOT, PYEONGJO, note.degree),
        weight: note.weight * WEIGHT,
        length: step.seconds * note.steps,
      });
    },
    stop: () => {
      trebleSoftener.disconnect();
      output.disconnect();
    },
  };
}

/** The plucked line's root, in hertz — an octave above the bass's. */
const ROOT = 220;

/** Softer than the pluck a check is sounded with, since this plays over and over. */
const WEIGHT = 0.6;

/** Keeps the waiting theme's upper edge gentle without dulling its plucked attack. */
const TREBLE_CUTOFF_HZ = 3_200;
