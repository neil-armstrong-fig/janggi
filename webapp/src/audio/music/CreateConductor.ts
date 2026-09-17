import {STEPS_PER_ROUND} from "@src/audio/music/rhythm/rhythms/Rhythms";
import type {Conductor} from "@src/audio/music/types/Conductor";
import {LAYER_NAMES} from "@src/audio/music/types/LayerName";
import type {Layer} from "@src/audio/music/types/Layer";
import type {LayerGains} from "@src/audio/music/types/LayerGains";
import type {LayerName} from "@src/audio/music/types/LayerName";
import type {Mood} from "@src/audio/types/Mood";
import type {Rhythm} from "@src/audio/music/rhythm/types/Rhythm";
import {answerLayer} from "@src/audio/music/layers/AnswerLayer";
import {bassLayer} from "@src/audio/music/layers/BassLayer";
import {checkThemeLayer} from "@src/audio/music/layers/CheckThemeLayer";
import {createSpace} from "@src/audio/music/space/CreateSpace";
import {grooveOffsetAt} from "@src/audio/music/groove/GrooveOffsetAt";
import {jangguLayer} from "@src/audio/music/layers/JangguLayer";
import {layerGainsFor} from "@src/audio/music/mood/LayerGainsFor";
import {rhythmFor} from "@src/audio/music/rhythm/RhythmFor";
import {secondsPerStep} from "@src/audio/music/mood/SecondsPerStep";
import {soloLayer} from "@src/audio/music/layers/SoloLayer";
import {stepInBar} from "@src/audio/music/bars/StepInBar";
import {waitingLayer} from "@src/audio/music/layers/WaitingLayer";

/**
 * Starts the music, into `destination`, and keeps it following the game.
 *
 * **Every layer plays on one clock.** A timer wakes every few milliseconds and schedules, on the audio
 * context's own sample-accurate clock, whatever falls in the next few tenths of a second — the lookahead
 * scheduler from Chris Wilson's "A Tale of Two Clocks". The timer can be late; the notes cannot, because
 * each is booked against the audio clock rather than played when the timer fires. Every layer is handed
 * the same steps, so they stay locked together however the tempo moves. A timer held up for longer than
 * that — a busy phone, a page put away — lets the steps it missed go and carries on from the next one,
 * rather than booking them all for a moment already past, where they would pile up and land at once.
 *
 * **The game's music changes 장단 at the start of a round** (`rhythmFor`), never mid-cycle, and every
 * layer is told the 장단 it is in and the one the next round will be in, so the drum can fill into a
 * change. **Tempo changes wait for a bar line** — every round starts on one — so the music never lurches
 * mid-phrase. **Loudness never jumps.** A new mood sets each layer easing towards its new level along an
 * exponential curve — slowly for the game's own layers, so tension is heard swelling over several
 * seconds; for the waiting theme quickly out, so the first move hands the music over to the game; and
 * for the check theme quickly in and slowly out: a check lands at once, and the dread lingers after it
 * has been answered.
 *
 * **It comes in gradually.** For its first few seconds each layer waits its turn (`ENTERING`) and rises
 * slowly, so starting the music — or restoring a game already under way — is heard as the music
 * gathering, never as everything landing at once.
 *
 * **The music is played in a room** (`createSpace`) **and in a groove** (`grooveOffsetAt`, one offset
 * a step for every layer so they swing together, and only where the 장단 swings) — all but the check
 * theme, which is heard dry, close and on the grid exactly as it was written.
 *
 * A layer that is silent and meant to stay so starts unplugged and is not asked to play, so the browser
 * stops working its nodes — the check theme's string sounds for as long as the music plays — and a
 * quiet opening costs no more than what is heard. It is plugged in the moment a mood wants it, before
 * it starts to rise.
 */
export function createConductor(context: BaseAudioContext, destination: AudioNode): Conductor {
  const space = createSpace(context, destination);
  const layers: Record<LayerName, Layer> = {
    waiting: waitingLayer(context),
    bass: bassLayer(context),
    solo: soloLayer(context),
    janggu: jangguLayer(context),
    answer: answerLayer(context),
    checkTheme: checkThemeLayer(context),
  };
  const plugged = new Set<LayerName>();

  let mood: Mood = CALM;
  let targets: LayerGains = layerGainsFor(CALM);
  let step = 0;
  let rhythm: Rhythm = rhythmFor(CALM.tension);
  let stepStartsAt = context.currentTime + FIRST_STEP_DELAY_S;
  let stepSeconds = secondsPerStep(CALM, rhythm);
  const startedAt = context.currentTime;

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
      space.stop();
    },
  };

  function schedule(): void {
    if (stepStartsAt < context.currentTime) stepStartsAt = context.currentTime + FIRST_STEP_DELAY_S;

    for (const name of LAYER_NAMES) {
      if (isSilent(layers[name], targets[name])) unplug(name);
    }

    while (stepStartsAt < context.currentTime + HORIZON_S) {
      if (step % STEPS_PER_ROUND === 0) rhythm = rhythmFor(mood.tension);
      if (stepInBar(step) === 0) stepSeconds = secondsPerStep(mood, rhythm);

      const swings = !mood.underWay || rhythm.meter === "duple";
      const grooved = stepStartsAt + grooveOffsetAt(step, Math.random(), swings) * stepSeconds;
      const nextRhythm = rhythmFor(mood.tension);

      for (const name of LAYER_NAMES) {
        if (!plugged.has(name)) continue;

        layers[name].play({
          index: step,
          time: IN_THE_GROOVE[name] ? grooved : stepStartsAt,
          seconds: stepSeconds,
          tension: mood.tension,
          underWay: mood.underWay,
          rhythm,
          nextRhythm,
        });
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
      const rising = target > gain.value;
      const entering = rising && now < startedAt + OPENING_S;
      const from = entering ? Math.max(now, startedAt + ENTERING[name].after) : now;

      if (target > 0) plug(name);

      gain.cancelScheduledValues(now);
      gain.setValueAtTime(gain.value, now);
      gain.setTargetAtTime(target, from, curveFor(name, rising, entering));
    }
  }

  function plug(name: LayerName): void {
    if (plugged.has(name)) return;

    layers[name].output.connect(IN_THE_ROOM[name] ? space.input : destination);
    plugged.add(name);
  }

  function unplug(name: LayerName): void {
    if (!plugged.has(name)) return;

    layers[name].output.disconnect();
    plugged.delete(name);
  }
}

/** How slowly a layer eases: gently and one after another as the music first starts, and then as mixed. */
function curveFor(name: LayerName, rising: boolean, entering: boolean): number {
  if (entering) return ENTERING[name].rise;

  return rising ? RISE_S[name] : FALL_S[name];
}

/**
 * Whether a layer is silent now and meant to stay that way, so there is no point booking it notes or
 * keeping it plugged in.
 */
function isSilent(layer: Layer, target: number): boolean {
  return target === 0 && layer.output.gain.value < AUDIBLE;
}

const CALM: Mood = {tension: 0, inCheck: false, ending: "none", underWay: false};

/**
 * How often the scheduler wakes, and how far ahead it books notes each time. Far enough ahead that a
 * phone busy drawing the board or thinking for the bot does not hold the timer past the notes it has
 * booked; nothing a player hears changes sooner than that, since loudness eases on its own curve and
 * tempo and 장단 wait for a bar line.
 */
const LOOKAHEAD_MS = 50;
const HORIZON_S = 0.3;

/** A moment's grace before the first note, so the first step is never booked in the past. */
const FIRST_STEP_DELAY_S = 0.1;

/**
 * Whether each layer is played into the room or straight out. The check theme is left dry: it was liked
 * exactly as it sounded before there was a room, and a general under attack should sound close.
 */
const IN_THE_ROOM: Record<LayerName, boolean> = {
  waiting: true,
  bass: true,
  solo: true,
  janggu: true,
  answer: true,
  checkTheme: false,
};

/**
 * Whether each layer plays in the groove (`grooveOffsetAt`) or dead on the grid. The check theme keeps
 * to the grid, as it was written — its heartbeat is meant to be relentless, not to swing.
 */
const IN_THE_GROOVE: Record<LayerName, boolean> = {
  waiting: true,
  bass: true,
  solo: true,
  janggu: true,
  answer: true,
  checkTheme: false,
};

/** How loud each layer is at full, against the others. */
const MIX: Record<LayerName, number> = {
  waiting: 0.5,
  bass: 0.3,
  solo: 0.5,
  janggu: 0.5,
  answer: 0.35,
  checkTheme: 0.6,
};

/**
 * How quickly each layer eases up and down, as the time constant of the curve — it covers about two
 * thirds of the way in that many seconds, and is all but there in three times as long.
 */
const RISE_S: Record<LayerName, number> = {
  waiting: 1.2,
  bass: 1.2,
  solo: 1.5,
  janggu: 1.5,
  answer: 1.8,
  checkTheme: 0.5,
};

const FALL_S: Record<LayerName, number> = {
  waiting: 0.8,
  bass: 1.5,
  solo: 1.5,
  janggu: 1.2,
  answer: 1.5,
  checkTheme: 1.3,
};

/**
 * How the music first comes in, a layer at a time: how many seconds after it starts each layer may
 * begin to rise, and how slowly it does. Only the check theme is let straight in — a check lands at once.
 */
const ENTERING: Record<LayerName, {readonly after: number; readonly rise: number}> = {
  waiting: {after: 0, rise: 2.5},
  solo: {after: 0, rise: 2.5},
  bass: {after: 4, rise: 3},
  janggu: {after: 6, rise: 3},
  answer: {after: 9, rise: 3},
  checkTheme: {after: 0, rise: 0.5},
};

/** How long after starting the music is still coming in, by which point every layer has begun to rise. */
const OPENING_S = 14;

/** Below this a layer is not heard, and not worth booking notes for. */
const AUDIBLE = 0.001;
