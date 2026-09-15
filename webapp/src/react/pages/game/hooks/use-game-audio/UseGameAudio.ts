import type {GameMoment} from "@src/react/pages/game/types/GameMoment";
import type {PlayedGame} from "@src/game/record/types/PlayedGame";
import {FULL_VOLUME} from "@janggi/shared/janggi/settings/Volume";
import type {Volume} from "@janggi/shared/janggi/settings/Volume";
import {createAudioDirector} from "@src/audio/CreateAudioDirector";
import {cuesFor} from "@src/react/pages/game/hooks/utils/CuesFor";
import type {CueName} from "@src/audio/types/CueName";
import {moodOf} from "@src/react/pages/game/hooks/use-game-audio/utils/MoodOf";
import {playHasBegun} from "@src/react/pages/game/utils/PlayHasBegun";
import {useCallback, useEffect, useState} from "react";

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
 * Sound is played from an effect, after the change has been drawn, which is where a side effect
 * belongs. The moment's id is handed along with it, so the sound is heard once however many times the
 * effect runs.
 *
 * What comes back plays one sound at once, for what a player's hand does that is not a change to the
 * game at all — picking a piece up, pressing a control — and so has no moment to wait for.
 */
export function useGameAudio(
  played: PlayedGame,
  moment: GameMoment | undefined,
  soundEffectsVolume: Volume,
  musicVolume: Volume,
): (name: CueName) => void {
  const [director] = useState(createAudioDirector);
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
    director.setMood(moodOf(present, begun));
  }, [director, present, begun]);

  useEffect(() => {
    if (moment) director.play(cuesFor(moment, present), moment.id);
  }, [director, moment, present]);

  return useCallback((name: CueName) => director.sound({name, weight: 1}), [director]);
}
