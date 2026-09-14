import type {GameMoment} from "@src/react/pages/game/types/GameMoment";
import type {RatingEvent} from "@src/react/pages/game/hooks/use-rated-game/types/RatingEvent";
import type {UnknownAction} from "@reduxjs/toolkit";
import {ratedGameAbandoned, ratedGameFinished, ratedGameStarted} from "@src/redux/ratings/RatingsSlice";
import {ratingEventFor} from "@src/react/pages/game/hooks/use-rated-game/utils/RatingEventFor";
import {useAppDispatch, useAppSelector} from "@src/redux/Hooks";
import {useEffect, useRef} from "react";

/**
 * Keeps the player's rating in step with the game against the bot: starts a rated game on its first
 * turn, rates it when it is decided, and rates one dealt over as abandoned.
 *
 * It keys off the page's one moment, as the sound and the motion do, and remembers the last id it
 * answered — so a change is rated once however often the page renders, and never twice under React's
 * doubled effects in development. What a change *means* for the rating is `ratingEventFor`'s to say.
 */
export function useRatedGame(moment: GameMoment | undefined): void {
  const {played, opponent} = useAppSelector(state => state.game);
  const inProgress = useAppSelector(state => state.ratings.inProgress !== undefined);
  const dispatch = useAppDispatch();
  const answeredRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    if (!moment || answeredRef.current === moment.id) return;
    answeredRef.current = moment.id;

    const event = ratingEventFor(moment, played, opponent, inProgress);
    if (event) dispatch(actionFor(event, new Date().toISOString()));
  }, [moment, played, opponent, inProgress, dispatch]);
}

function actionFor(event: RatingEvent, now: string): UnknownAction {
  switch (event.kind) {
    case "started":
      return ratedGameStarted({
        format: event.format,
        botElo: event.botElo,
        playerSide: event.playerSide,
        startedAt: now,
      });
    case "finished":
      return ratedGameFinished({result: event.result, ending: event.ending, finishedAt: now});
    case "abandoned":
      return ratedGameAbandoned(now);
  }
}
