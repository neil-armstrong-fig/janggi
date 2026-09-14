import type {Layer} from "@src/audio/music/types/Layer";
import type {Step} from "@src/audio/music/types/Step";
import {janggu} from "@src/audio/instruments/Janggu";
import {percussionHitsAt} from "@src/audio/music/patterns/PercussionHitsAt";

/** The busy drumming of a fight at its height. What it strikes is `percussionHitsAt`'s to say. */
export function percussionLayer(context: BaseAudioContext): Layer {
  const output = context.createGain();
  output.gain.value = 0;

  return {
    output,
    play: (step: Step) => {
      for (const hit of percussionHitsAt(step.index, step.tension)) janggu(context, output, step.time, hit);
    },
    stop: () => output.disconnect(),
  };
}
