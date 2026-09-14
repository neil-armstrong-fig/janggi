import type {Layer} from "@src/audio/music/types/Layer";

/**
 * The held ground the rest of the music sits on: a low root and a quiet fifth above it, warmed by a
 * filter that sways open and closed so slowly it is felt rather than heard.
 *
 * It is the one layer that plays nothing step by step. It sounds from the moment the music starts
 * until the music stops, and is the last thing left once a game has ended.
 */
export function droneLayer(context: BaseAudioContext): Layer {
  const output = context.createGain();
  output.gain.value = 0;

  const ground = context.createOscillator();
  ground.type = "sine";
  ground.frequency.value = ROOT;

  const fifth = context.createOscillator();
  fifth.type = "triangle";
  fifth.frequency.value = ROOT * 1.5;

  const fifthLevel = context.createGain();
  fifthLevel.gain.value = 0.25;

  const warmth = context.createBiquadFilter();
  warmth.type = "lowpass";
  warmth.frequency.value = 700;
  warmth.Q.value = 0.5;

  const sway = context.createOscillator();
  sway.type = "sine";
  sway.frequency.value = SWAY_HZ;

  const swayDepth = context.createGain();
  swayDepth.gain.value = 180;

  const level = context.createGain();
  level.gain.value = 0.6;

  ground.connect(warmth);
  fifth.connect(fifthLevel).connect(warmth);
  sway.connect(swayDepth).connect(warmth.frequency);
  warmth.connect(level).connect(output);

  const sounding = [ground, fifth, sway];
  sounding.forEach(oscillator => oscillator.start());

  return {
    output,
    play: () => undefined,
    stop: () => {
      sounding.forEach(oscillator => oscillator.stop());
      output.disconnect();
    },
  };
}

/** The key the whole score is in, in hertz — A an octave below the plucked line's root. */
const ROOT = 110;

/** How often the filter sways open and shut: once every fourteen seconds or so. */
const SWAY_HZ = 0.07;
