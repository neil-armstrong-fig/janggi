import type {GameMoment} from "@src/react/pages/game/types/GameMoment";
import type {PlayedGame} from "@src/record/types/PlayedGame";
import type {Side} from "@janggi/shared/janggi/pieces/Side";
import {FULL_VOLUME} from "@janggi/shared/janggi/settings/Volume";
import type {Volume} from "@janggi/shared/janggi/settings/Volume";
import {createAudioDirector} from "@src/audio/CreateAudioDirector";
import {countdownOf} from "@src/react/pages/game/hooks/use-game-audio/utils/CountdownOf";
import {cuesFor} from "@src/react/pages/game/hooks/utils/CuesFor";
import type {CueName} from "@src/audio/types/CueName";
import {moodOf} from "@src/react/pages/game/hooks/use-game-audio/utils/MoodOf";
import {playHasBegun} from "@src/react/pages/game/utils/PlayHasBegun";
import {useCallback, useEffect, useRef, useState} from "react";

/** The game to be heard, the change to sound, how the clock ended it, and how loud its effects and its music are. */
export interface GameAudio {
  readonly played: PlayedGame;
  readonly moment: GameMoment | undefined;
  /** The army that has lost on time (시간패), if one has, which the position alone cannot say. */
  readonly outOfTime: Side | undefined;
  /** How many flags have fallen while the page has been up — `useFlagFall` — each sounded once. */
  readonly flagFall: number;
  /** When the army to move's time runs out, while a clock is running — `flagDueAt`. */
  readonly flagDueAt: number | undefined;
  /** Whether the player wants the last ten seconds before it ticked out. */
  readonly countdown: boolean;
  readonly soundEffectsVolume: Volume;
  readonly musicVolume: Volume;
}

/**
 * Lets the game be heard: the sound of every change to it, and music that follows how it feels.
 *
 * **The page decides what is heard; `src/audio/` only plays it.** Which sounds a change makes is
 * `cuesFor`, and how a position feels is `moodOf` — told whether play has begun by `playHasBegun`, the
 * same question that locks the setup pickers — both beside this hook and both read off the game
 * state the page already holds — the director is handed their answers and knows nothing of janggi.
 * The rest is plumbing: one director for as long as the page is up, woken by the first tap anywhere,
 * and told of each change, each mood and each volume as they come — a slider's volume handed on as a
 * share of full — and of the page being put away and brought back, so nothing plays off screen.
 *
 * A flag falling is no change to the record, so it comes as `flagFall`, a count that goes up once for each one, and
 * is sounded as the end of the game it is.
 *
 * The last ten seconds before a flag tick out, as the clock reads low — `countdownOf`. The director is handed the
 * deadline rather than told each second, so the ticks are booked on the audio clock and stay in time.
 *
 * Sound is played from an effect, after the change has been drawn, which is where a side effect
 * belongs. The moment's id is handed along with it, so the sound is heard once however many times the
 * effect runs.
 *
 * What comes back plays one sound at once, for what a player's hand does that is not a change to the
 * game at all — picking a piece up, pressing a control — and so has no moment to wait for.
 */
export function useGameAudio({
  played,
  moment,
  outOfTime,
  flagFall,
  flagDueAt,
  countdown,
  soundEffectsVolume,
  musicVolume,
}: GameAudio): (name: CueName) => void {
  const [director] = useState(createAudioDirector);
  const flagsHeardRef = useRef(0);
  const present = played.present;
  const begun = playHasBegun(played);

  useEffect(() => {
    const unlock = (): void => director.unlock();
    window.addEventListener("pointerdown", unlock);

    return () => {
      window.removeEventListener("pointerdown", unlock);
      director.dispose();
    };
  }, [director]);

  useEffect(() => {
    const follow = (): void => director.setOnScreen(document.visibilityState === "visible");
    follow();
    document.addEventListener("visibilitychange", follow);

    return () => document.removeEventListener("visibilitychange", follow);
  }, [director]);

  useEffect(() => {
    director.setChannels({effects: soundEffectsVolume / FULL_VOLUME, music: musicVolume / FULL_VOLUME});
  }, [director, soundEffectsVolume, musicVolume]);

  useEffect(() => {
    director.setMood(moodOf(present, begun, outOfTime));
  }, [director, present, begun, outOfTime]);

  useEffect(() => {
    if (moment) director.play(cuesFor(moment, present), moment.id);
  }, [director, moment, present]);

  useEffect(() => {
    if (flagFall <= flagsHeardRef.current) return;
    flagsHeardRef.current = flagFall;

    director.sound({name: "timeLost", weight: 1});
  }, [director, flagFall]);

  useEffect(() => {
    director.setCountdown(countdownOf({flagDueAt, outOfTime, wanted: countdown}));
  }, [director, flagDueAt, outOfTime, countdown]);

  return useCallback((name: CueName) => director.sound({name, weight: 1}), [director]);
}
