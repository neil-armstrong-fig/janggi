import type {Layer} from "@src/audio/music/types/Layer";
import type {Step} from "@src/audio/music/types/Step";
import {janggu} from "@src/audio/instruments/Janggu";
import {jangguHitsAt} from "@src/audio/music/patterns/JangguHitsAt";

/**
 * The 장구 under the soloist, drumming the 장단 the music is in. What it strikes is `jangguHitsAt`'s to
 * say — including the fill it plays when the next round is to be in another 장단.
 */
export function jangguLayer(context: BaseAudioContext): Layer {
  const output = context.createGain();
  output.gain.value = 0;

  return {
    output,
    play: (step: Step) => {
      const turning = step.nextRhythm.name !== step.rhythm.name;

      for (const hit of jangguHitsAt(step.index, step.rhythm, step.tension, turning)) {
        janggu(context, output, step.time, hit);
      }
    },
    stop: () => output.disconnect(),
  };
}
