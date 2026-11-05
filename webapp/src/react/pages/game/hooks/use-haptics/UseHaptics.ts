import type {GameMoment} from "@src/react/pages/game/types/GameMoment";
import type {PlayedGame} from "@src/record/types/PlayedGame";
import {cuesFor} from "@src/react/pages/game/hooks/utils/CuesFor";
import {useEffect, useRef} from "react";
import {vibrationFor} from "@src/react/pages/game/hooks/use-haptics/utils/VibrationFor";

/** The game to be felt, the change to feel, the flags fallen so far (`useFlagFall`), and whether to buzz at all. */
export interface Haptics {
  readonly played: PlayedGame;
  readonly moment: GameMoment | undefined;
  readonly flagFall: number;
  readonly enabled: boolean;
}

/**
 * Lets a change to the game be felt, on a phone that can vibrate — what the sound would say, for a
 * player with the sound off or the phone on silent. `vibrationFor` decides the pattern.
 *
 * Only with effects in full: a buzz is motion as much as a flight is, and a player who has asked for
 * less of one has asked for less of the other. Each moment is felt once, however often the effect runs, and so is each
 * flag that falls (시간패), which is no change to the record and so comes as a count of its own.
 */
export function useHaptics({played, moment, flagFall, enabled}: Haptics): void {
  const feltRef = useRef(0);
  const flagsFeltRef = useRef(0);
  const present = played.present;

  useEffect(() => {
    // A device with nothing to buzz has no use for a pattern, so it is asked first — before the cues are worked out.
    if (!enabled || !("vibrate" in navigator) || !moment || moment.id <= feltRef.current) return;
    feltRef.current = moment.id;

    const pattern = vibrationFor(cuesFor(moment, present));
    if (pattern) navigator.vibrate([...pattern]);
  }, [enabled, moment, present]);

  useEffect(() => {
    if (!enabled || !("vibrate" in navigator) || flagFall <= flagsFeltRef.current) return;
    flagsFeltRef.current = flagFall;

    const pattern = vibrationFor([{name: "timeLost", weight: 1}]);
    if (pattern) navigator.vibrate([...pattern]);
  }, [enabled, flagFall]);
}
