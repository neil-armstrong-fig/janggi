import type {AudioChannels} from "@src/audio/types/AudioChannels";
import type {AudioDirector} from "@src/audio/types/AudioDirector";
import {CUE_VOICINGS} from "@src/audio/cues/CueVoicings";
import type {Conductor} from "@src/audio/music/types/Conductor";
import type {Cue} from "@src/audio/types/Cue";
import type {Mood} from "@src/audio/types/Mood";
import {channelGainFor} from "@src/audio/utils/ChannelGainFor";
import {createConductor} from "@src/audio/music/CreateConductor";

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
 * every sound asked for is simply not heard — which is right: the game has not been touched yet.
 *
 * **Two channels, faded rather than cut.** Sound effects and music each go through their own level into
 * a gentle limiter, so a capture landing on a loud bar of music does not clip. A change of volume fades
 * to its new level — slowly when the music first starts, so it fades in rather than arriving, and only
 * once: a later tap does not hurry it. Turning the music all the way down stops the conductor once the fade has finished,
 * so it is not left scheduling notes nobody can hear.
 *
 * **Each change is heard once.** A change carries the id of the moment it came from, and an id already
 * heard is ignored, so React rendering twice or re-running an effect never doubles a sound. When one
 * change makes several sounds — a piece set down, and the check it gave — they follow one another a
 * beat apart rather than landing on top of each other.
 */
export function createAudioDirector(): AudioDirector {
  let graph: Graph | undefined;
  let conductor: Conductor | undefined;
  let channels: AudioChannels = {effects: 1, music: 1};
  let mood: Mood = CALM;
  let lastHeard = 0;
  let quieting: ReturnType<typeof setTimeout> | undefined;

  return {
    unlock: () => {
      if (!graph) {
        graph = buildGraph(new AudioContext());
        follow(channels);
      }

      if (graph.context.state === "suspended") void graph.context.resume();
    },

    play: (cues: readonly Cue[], id: number) => {
      if (id <= lastHeard) return;
      lastHeard = id;

      if (!graph || channels.effects === 0 || graph.context.state !== "running") return;

      const {context, effects} = graph;
      const when = context.currentTime + LATENCY_S;

      cues.forEach((cue, index) => {
        CUE_VOICINGS[cue.name](context, effects, when + index * BETWEEN_CUES_S, cue.weight);
      });
    },

    sound: (cue: Cue) => {
      if (!graph || channels.effects === 0 || graph.context.state !== "running") return;

      const {context, effects} = graph;
      CUE_VOICINGS[cue.name](context, effects, context.currentTime + LATENCY_S, cue.weight);
    },

    setMood: (next: Mood) => {
      mood = next;
      conductor?.setMood(next);
    },

    setChannels: (next: AudioChannels) => {
      channels = next;
      follow(next);
    },

    dispose: () => {
      clearTimeout(quieting);
      conductor?.stop();
      conductor = undefined;
      void graph?.context.close();
      graph = undefined;
    },
  };

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

function buildGraph(context: AudioContext): Graph {
  const limiter = context.createDynamicsCompressor();
  limiter.threshold.value = -12;
  limiter.ratio.value = 6;

  const effects = context.createGain();
  effects.gain.value = EFFECTS_LEVEL;

  // The music fades up from silence the first time rather than starting at full.
  const music = context.createGain();
  music.gain.value = 0;

  effects.connect(limiter);
  music.connect(limiter);
  limiter.connect(context.destination);

  return {context, effects, music};
}

const CALM: Mood = {tension: 0, inCheck: false, ending: "none", underWay: false};

/**
 * Each channel at full volume: sound effects at nearly full, and music well underneath them — it is
 * there to be felt, not listened to.
 */
const EFFECTS_LEVEL = 0.9;
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
