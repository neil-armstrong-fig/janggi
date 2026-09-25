import type {AudioChannels} from "@src/audio/types/AudioChannels";
import type {AudioDirector} from "@src/audio/types/AudioDirector";
import {CUE_VOICINGS} from "@src/audio/cues/CueVoicings";
import type {Conductor} from "@src/audio/music/types/Conductor";
import type {Cue} from "@src/audio/types/Cue";
import type {Mood} from "@src/audio/types/Mood";
import {channelGainFor} from "@src/audio/utils/ChannelGainFor";
import {createConductor} from "@src/audio/music/CreateConductor";
import {softClipCurve} from "@src/audio/soft-clip/SoftClipCurve";

/** The audio device, and the two channels everything is routed through on the way to it. */
interface Graph {
  readonly context: AudioContext;
  readonly effects: GainNode;
  readonly music: GainNode;
}

/**
 * The one object the page holds to make sound: it hears what changed and how the game feels, and plays
 * the sound effects and the music.
 *
 * **Nothing is made until the first gesture.** Browsers refuse to start audio a player has not asked
 * for, so the audio device is opened by `unlock`, which the page calls on the first tap. Before that
 * every sound asked for is simply not heard — which is right: the game has not been touched yet. Its
 * fades and conductor start only once the browser confirms that the device is running, so the first
 * note cannot arrive ahead of the automation meant to bring it in.
 *
 * **Two channels, faded rather than cut.** Sound effects and music each go through their own level into
 * a soft clip, so a capture landing on a loud bar of music is rounded off rather than clipped. It is a
 * fixed curve and not a compressor, so it never reacts to what came before: a compressor here took short
 * effects down by some 12 dB in Firefox, and reshaped them, while Chrome's left them alone. A change of volume fades
 * to its new level — slowly when the music first starts, so it fades in rather than arriving, and only
 * once: a later tap does not hurry it. Turning the music all the way down stops the conductor once the fade has finished,
 * so it is not left scheduling notes nobody can hear.
 *
 * **Each change is heard once.** A change carries the id of the moment it came from, and an id already
 * heard is ignored, so React rendering twice or re-running an effect never doubles a sound. When one
 * change makes several sounds — a piece set down, and the check it gave — they follow one another a
 * beat apart rather than landing on top of each other.
 *
 * **Nothing plays off screen.** While the page says it is put away the audio device is suspended rather
 * than let go, which stops its clock: the music, and every note already booked, carries on from exactly
 * where it was when the page comes back. A phone that will not start it again without a gesture is
 * woken by the next tap, as it was the first time.
 */
export function createAudioDirector(): AudioDirector {
  let graph: Graph | undefined;
  let conductor: Conductor | undefined;
  let channels: AudioChannels = {effects: 1, music: 1};
  let mood: Mood = CALM;
  let onScreen = true;
  let lastHeard = 0;
  let ready = false;
  let quieting: ReturnType<typeof setTimeout> | undefined;

  return {
    unlock: () => {
      if (!graph) graph = buildGraph(new AudioContext({latencyHint: LATENCY_HINT}));

      start();
    },

    play: (cues: readonly Cue[], id: number) => {
      if (id <= lastHeard) return;
      lastHeard = id;

      if (!graph || channels.effects === 0 || graph.context.state !== "running") return;

      const {context, effects} = graph;
      const when = context.currentTime + LATENCY_S;
      const soundOutput = {context, destination: effects};

      cues.forEach((cue, index) => {
        CUE_VOICINGS[cue.name](soundOutput, when + index * BETWEEN_CUES_S, cue.weight);
      });
    },

    sound: (cue: Cue) => {
      if (!graph || channels.effects === 0 || graph.context.state !== "running") return;

      const {context, effects} = graph;
      CUE_VOICINGS[cue.name]({context, destination: effects}, context.currentTime + LATENCY_S, cue.weight);
    },

    setMood: (next: Mood) => {
      mood = next;
      conductor?.setMood(next);
    },

    setChannels: (next: AudioChannels) => {
      channels = next;
      if (ready) follow(next);
    },

    setOnScreen: (next: boolean) => {
      onScreen = next;
      if (!graph) return;

      if (next) start();
      else void graph.context.suspend();
    },

    dispose: () => {
      clearTimeout(quieting);
      conductor?.stop();
      conductor = undefined;
      void graph?.context.close();
      graph = undefined;
      ready = false;
    },
  };

  /** Opens the device before any fades or notes are scheduled against its clock. */
  function start(): void {
    if (!graph || !onScreen) return;

    const context = graph.context;
    if (ready) {
      void wake(context);
      return;
    }

    void wake(context).then(running => {
      if (!running || graph?.context !== context || ready) return;

      ready = true;
      follow(channels);
    });
  }

  function follow(wanted: AudioChannels): void {
    if (!graph) return;

    const {context, effects, music} = graph;
    const now = context.currentTime;
    const starting = wanted.music > 0 && !conductor;

    effects.gain.setTargetAtTime(channelGainFor(wanted.effects, EFFECTS_LEVEL), now, CHANNEL_FADE_S);
    music.gain.setTargetAtTime(
      channelGainFor(wanted.music, MUSIC_LEVEL),
      now,
      starting ? MUSIC_START_FADE_S : CHANNEL_FADE_S,
    );

    clearTimeout(quieting);

    if (wanted.music > 0 && !conductor) {
      conductor = createConductor(context, music);
      conductor.setMood(mood);
    }

    if (wanted.music === 0 && conductor) {
      quieting = setTimeout(() => {
        conductor?.stop();
        conductor = undefined;
      }, STOP_AFTER_FADE_MS);
    }
  }
}

/** Starts the audio device playing again, whether the page held it or the phone interrupted it. */
async function wake(context: AudioContext): Promise<boolean> {
  if (context.state === "closed") return false;

  if (context.state !== "running") {
    try {
      await context.resume();
    } catch {
      return false;
    }
  }

  return context.state === "running";
}

function buildGraph(context: AudioContext): Graph {
  const softClip = context.createWaveShaper();
  softClip.curve = softClipCurve();
  // Without oversampling the clip's new harmonics fold back as aliasing, which is heard as harshness.
  softClip.oversample = "2x";

  const effects = context.createGain();
  effects.gain.value = EFFECTS_LEVEL;

  // The music fades up from silence the first time rather than starting at full.
  const music = context.createGain();
  music.gain.value = 0;

  effects.connect(softClip);
  music.connect(softClip);
  softClip.connect(context.destination);

  return {context, effects, music};
}

const CALM: Mood = {tension: 0, inCheck: false, ending: "none", underWay: false};

/**
 * Prefer sustained playback over output latency. A phone's audio thread shares the device with the
 * page and the bot; a larger buffer keeps it from running dry and making the music crackle or stutter.
 * Sound effects use this context too, so they may arrive a little later in exchange.
 */
const LATENCY_HINT: AudioContextLatencyCategory = "playback";

/**
 * Each channel at full volume: sound effects over the music, which is well underneath them — it is
 * there to be felt, not listened to.
 *
 * The effects are set so the hardest strike, a heavy piece slammed down, peaks a little under full scale
 * on its own (about 0.85, measured); at 0.9 it went past it, and only a compressor kept it from clipping.
 */
const EFFECTS_LEVEL = 0.55;
const MUSIC_LEVEL = 0.35;

/** How quickly a channel fades to a new volume, as a time constant in seconds. */
const CHANNEL_FADE_S = 0.4;

/** How slowly the music channel fades up when the music starts, so it gathers rather than arrives. */
const MUSIC_START_FADE_S = 2;

/** Long enough for the music to have faded to nothing before its conductor is stopped. */
const STOP_AFTER_FADE_MS = 2_000;

/** A sliver of time ahead, so a sound is never booked for a moment the audio clock has already passed. */
const LATENCY_S = 0.005;

/** How far apart the sounds of one change follow each other. */
const BETWEEN_CUES_S = 0.12;
