import type {Conductor} from "@src/audio/music/types/Conductor";
import {LAYER_NAMES} from "@src/audio/music/types/LayerName";
import type {Layer} from "@src/audio/music/types/Layer";
import type {LayerGains} from "@src/audio/music/types/LayerGains";
import type {LayerName} from "@src/audio/music/types/LayerName";
import type {Mood} from "@src/audio/types/Mood";
import type {PhraseMemory} from "@src/audio/music/types/PhraseMemory";
import {checkThemeLayer} from "@src/audio/music/layers/CheckThemeLayer";
import {droneLayer} from "@src/audio/music/layers/DroneLayer";
import {echoLayer} from "@src/audio/music/layers/EchoLayer";
import {layerGainsFor} from "@src/audio/music/mood/LayerGainsFor";
import {leadLayer} from "@src/audio/music/layers/LeadLayer";
import {percussionLayer} from "@src/audio/music/layers/PercussionLayer";
import {pulseLayer} from "@src/audio/music/layers/PulseLayer";
import {secondsPerStep} from "@src/audio/music/mood/SecondsPerStep";
import {stepInBar} from "@src/audio/music/bars/StepInBar";

/**
 * Starts the music, into `destination`, and keeps it following the game.
 *
 * **Every layer plays on one clock.** A timer wakes every few milliseconds and schedules, on the audio
 * context's own sample-accurate clock, whatever falls in the next tenth of a second — the lookahead
 * scheduler from Chris Wilson's "A Tale of Two Clocks". The timer can be late; the notes cannot, because
 * each is booked against the audio clock rather than played when the timer fires. All six layers are
 * handed the same steps, so they stay locked together however the tempo moves — and the lead and the
 * echo share a `PhraseMemory`, so the echo takes up the very note the lead was left on.
 *
 * **Tempo changes wait for a bar line**, so the music never lurches mid-phrase. **Loudness never jumps.**
 * A new mood sets each layer easing towards its new level along an exponential curve — slowly for the
 * game's own layers, so tension is heard swelling over several seconds, and for the check theme quickly
 * in and slowly out: a check lands at once, and the dread lingers after it has been answered.
 *
 * A layer that is silent and meant to stay so is not asked to play, so a quiet opening costs no more
 * than the drone.
 */
export function createConductor(context: BaseAudioContext, destination: AudioNode): Conductor {
  const phrase: PhraseMemory = {degree: FIRST_LEAD_DEGREE};
  const layers: Record<LayerName, Layer> = {
    drone: droneLayer(context),
    lead: leadLayer(context, phrase),
    pulse: pulseLayer(context),
    echo: echoLayer(context, phrase),
    percussion: percussionLayer(context),
    checkTheme: checkThemeLayer(context),
  };
  for (const name of LAYER_NAMES) layers[name].output.connect(destination);

  let mood: Mood = CALM;
  let targets: LayerGains = layerGainsFor(CALM);
  let step = 0;
  let stepStartsAt = context.currentTime + FIRST_STEP_DELAY_S;
  let stepSeconds = secondsPerStep(CALM.tension, CALM.inCheck);

  const timer = setInterval(schedule, LOOKAHEAD_MS);
  ease(targets);

  return {
    setMood: (next: Mood) => {
      mood = next;
      targets = layerGainsFor(next);
      ease(targets);
    },
    stop: () => {
      clearInterval(timer);
      for (const name of LAYER_NAMES) layers[name].stop();
    },
  };

  function schedule(): void {
    while (stepStartsAt < context.currentTime + HORIZON_S) {
      if (stepInBar(step) === 0) stepSeconds = secondsPerStep(mood.tension, mood.inCheck);

      for (const name of LAYER_NAMES) {
        if (isSilent(layers[name], targets[name])) continue;

        layers[name].play({index: step, time: stepStartsAt, seconds: stepSeconds, tension: mood.tension});
      }

      stepStartsAt += stepSeconds;
      step += 1;
    }
  }

  function ease(gains: LayerGains): void {
    const now = context.currentTime;

    for (const name of LAYER_NAMES) {
      const gain = layers[name].output.gain;
      const target = gains[name] * MIX[name];

      gain.cancelScheduledValues(now);
      gain.setValueAtTime(gain.value, now);
      gain.setTargetAtTime(target, now, target > gain.value ? RISE_S[name] : FALL_S[name]);
    }
  }
}

/** Whether a layer is silent now and meant to stay that way, so there is no point booking it notes. */
function isSilent(layer: Layer, target: number): boolean {
  return target === 0 && layer.output.gain.value < AUDIBLE;
}

const CALM: Mood = {tension: 0, inCheck: false, ending: "none"};

/** The note the lead begins on, in the middle of its range. */
const FIRST_LEAD_DEGREE = 6;

/** How often the scheduler wakes, and how far ahead it books notes each time. */
const LOOKAHEAD_MS = 25;
const HORIZON_S = 0.12;

/** A moment's grace before the first note, so the first step is never booked in the past. */
const FIRST_STEP_DELAY_S = 0.1;

/** How loud each layer is at full, against the others. */
const MIX: Record<LayerName, number> = {
  drone: 0.5,
  lead: 0.55,
  pulse: 0.6,
  echo: 0.4,
  percussion: 0.45,
  checkTheme: 0.6,
};

/**
 * How quickly each layer eases up and down, as the time constant of the curve — it covers about two
 * thirds of the way in that many seconds, and is all but there in three times as long.
 */
const RISE_S: Record<LayerName, number> = {
  drone: 1.2,
  lead: 1.5,
  pulse: 1.5,
  echo: 1.8,
  percussion: 1.5,
  checkTheme: 0.5,
};

const FALL_S: Record<LayerName, number> = {
  drone: 1.5,
  lead: 1.5,
  pulse: 1.5,
  echo: 1.5,
  percussion: 1.2,
  checkTheme: 1.3,
};

/** Below this a layer is not heard, and not worth booking notes for. */
const AUDIBLE = 0.001;
