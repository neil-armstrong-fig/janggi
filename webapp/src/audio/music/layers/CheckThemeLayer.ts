import {GYEMYEONJO} from "@src/audio/modes/Gyemyeonjo";
import type {Layer} from "@src/audio/music/types/Layer";
import {STEPS_PER_BAR} from "@src/audio/music/bars/steps-per-bar/StepsPerBar";
import type {Step} from "@src/audio/music/types/Step";
import {heartbeatHitsAt} from "@src/audio/music/patterns/HeartbeatHitsAt";
import {janggu} from "@src/audio/instruments/Janggu";
import {pitchOf} from "@src/audio/modes/PitchOf";
import {stepInBar} from "@src/audio/music/bars/StepInBar";

/**
 * The music of a general under attack, standing apart from the game's own: a low bowed string in the
 * manner of the 아쟁, trembling, in the dark mode, over a racing heartbeat.
 *
 * The string never stops while the music plays — it sounds silently underneath until the conductor
 * brings the layer up — so when a check lands the theme swells in mid-phrase rather than starting from
 * its first note, and fades out mid-phrase when the check is answered. It moves to a new note at each
 * bar line, a slow worrying figure that never settles on the root for long.
 */
export function checkThemeLayer(context: BaseAudioContext): Layer {
  const output = context.createGain();
  output.gain.value = 0;

  const string = context.createOscillator();
  string.type = "sawtooth";
  string.frequency.value = pitchOf(ROOT, GYEMYEONJO, FIGURE[0] ?? 0);

  const body = context.createBiquadFilter();
  body.type = "bandpass";
  body.frequency.value = 700;
  body.Q.value = 1.2;

  const tremolo = context.createGain();
  tremolo.gain.value = TREMOLO_CENTRE;

  const bow = context.createOscillator();
  bow.type = "sine";
  bow.frequency.value = TREMOLO_HZ;

  const bowDepth = context.createGain();
  bowDepth.gain.value = TREMOLO_DEPTH;

  const stringLevel = context.createGain();
  stringLevel.gain.value = 0.3;

  string.connect(body).connect(tremolo).connect(stringLevel).connect(output);
  bow.connect(bowDepth).connect(tremolo.gain);

  const sounding = [string, bow];
  sounding.forEach(oscillator => oscillator.start());

  return {
    output,
    play: (step: Step) => {
      if (stepInBar(step.index) === 0) {
        const bar = Math.floor(step.index / STEPS_PER_BAR);
        const degree = FIGURE[bar % FIGURE.length] ?? 0;

        string.frequency.setTargetAtTime(pitchOf(ROOT, GYEMYEONJO, degree), step.time, GLIDE_S);
      }

      for (const hit of heartbeatHitsAt(step.index)) {
        janggu({context, destination: output}, step.time, hit);
      }
    },
    stop: () => {
      sounding.forEach(oscillator => oscillator.stop());
      output.disconnect();
    },
  };
}

/** The low root the string is counted from, in hertz. */
const ROOT = 110;

/** The degrees the string moves between, one a bar — up and back, and up further, never resting. */
const FIGURE: readonly number[] = [0, 1, 0, 2];

/** How fast the string trembles, and how deep. */
const TREMOLO_HZ = 6.5;
const TREMOLO_CENTRE = 0.55;
const TREMOLO_DEPTH = 0.45;

/** How quickly the string slides to its next note, in seconds. */
const GLIDE_S = 0.08;
