import type {GameMoment} from "@src/react/pages/game/types/GameMoment";
import type {PlayedGame} from "@src/game/record/types/PlayedGame";
import {cuesFor} from "@src/react/pages/game/hooks/utils/CuesFor";
import {useEffect, useRef} from "react";
import {vibrationFor} from "@src/react/pages/game/hooks/use-haptics/utils/VibrationFor";

/**
 * Lets a change to the game be felt, on a phone that can vibrate — what the sound would say, for a
 * player with the sound off or the phone on silent. `vibrationFor` decides the pattern.
 *
 * Only with effects in full: a buzz is motion as much as a flight is, and a player who has asked for
 * less of one has asked for less of the other. Each moment is felt once, however often the effect runs.
 */
export function useHaptics(played: PlayedGame, moment: GameMoment | undefined, enabled: boolean): void {
  const feltRef = useRef(0);
  const present = played.present;

  useEffect(() => {
    // A device with nothing to buzz has no use for a pattern, so it is asked first — before the cues are worked out.
    if (!enabled || !("vibrate" in navigator) || !moment || moment.id <= feltRef.current) return;
    feltRef.current = moment.id;

    const pattern = vibrationFor(cuesFor(moment, present));
    if (pattern) navigator.vibrate([...pattern]);
  }, [enabled, moment, present]);
}
