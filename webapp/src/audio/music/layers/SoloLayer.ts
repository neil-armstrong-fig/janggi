import {STEPS_PER_PHRASE, soloNotesAt} from "@src/audio/music/patterns/SoloNotesAt";
import type {Layer} from "@src/audio/music/types/Layer";
import {PYEONGJO} from "@src/audio/modes/Pyeongjo";
import type {Step} from "@src/audio/music/types/Step";
import {gayageum} from "@src/audio/instruments/Gayageum";
import {phrasePlanFor} from "@src/audio/music/patterns/PhrasePlanFor";
import {pitchOf} from "@src/audio/modes/PitchOf";

/**
 * The soloist of the game's music: a 가야금 playing in the manner of 산조 over the 장구. What it plays is
 * `soloNotesAt`'s to say; this rolls a fresh plan of motifs as each phrase begins, and plucks each note
 * at its place in the step, ringing a little past its length the way a plucked string does.
 */
export function soloLayer(context: BaseAudioContext): Layer {
  const output = context.createGain();
  output.gain.value = 0;

  let plan = phrasePlanFor(Math.random(), Math.random());

  return {
    output,
    play: (step: Step) => {
      if (step.index % STEPS_PER_PHRASE === 0) plan = phrasePlanFor(Math.random(), Math.random());

      for (const note of soloNotesAt(step.index, step.rhythm, plan)) {
        gayageum({context, destination: output}, step.time + note.offset * step.seconds, {
          frequency: pitchOf(ROOT, PYEONGJO, note.degree),
          weight: note.weight * WEIGHT,
          length: step.seconds * note.steps * RINGS_ON,
        });
      }
    },
    stop: () => output.disconnect(),
  };
}

/** The soloist's root, in hertz — the same as the waiting theme's. */
const ROOT = 220;

const WEIGHT = 0.75;

/** How far past its written length a plucked note is left to ring. */
const RINGS_ON = 1.3;
