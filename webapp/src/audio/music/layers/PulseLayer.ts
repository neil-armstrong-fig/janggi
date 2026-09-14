import type {Layer} from "@src/audio/music/types/Layer";
import type {Step} from "@src/audio/music/types/Step";
import {janggu} from "@src/audio/instruments/Janggu";
import {pulseHitsAt} from "@src/audio/music/patterns/PulseHitsAt";

/** The slow drum pulse that joins as the first pieces come off. What it strikes is `pulseHitsAt`'s to say. */
export function pulseLayer(context: BaseAudioContext): Layer {
  const output = context.createGain();
  output.gain.value = 0;

  return {
    output,
    play: (step: Step) => {
      for (const hit of pulseHitsAt(step.index, step.tension)) janggu(context, output, step.time, hit);
    },
    stop: () => output.disconnect(),
  };
}
