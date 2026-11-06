import {useAppDispatch, useAppSelector} from "@src/redux/Hooks";
import {scriptedAnswerOf} from "@src/react/pages/game/hooks/use-scripted-opponent/answer/ScriptedAnswerOf";
import {useEffect} from "react";
import {useTutorialSituation} from "@src/react/pages/game/hooks/use-tutorial-situation/UseTutorialSituation";

/**
 * Plays the tutorial's answers for the other army, each after a pause, as the bot does (`useBotOpponent`), so the player's
 * piece has landed, or their offer been seen, before the answer comes: Han's moves and rests, and its acceptance of a draw
 * the player was asked to offer. The board is closed meanwhile (`Intersections`). Nothing outside the tutorial, and
 * nothing the rules would refuse from the board as it stands (`scriptedAnswerOf`).
 */
export function useScriptedOpponent(): void {
  const step = useTutorialSituation()?.step;
  const game = useAppSelector(state => state.game.played.present);
  const offerPending = useAppSelector(({game: {drawOffer}}) => drawOffer?.by === "cho" && !drawOffer.declined);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const answer = scriptedAnswerOf(step, game, offerPending);
    if (answer === undefined) return;

    const timer = setTimeout(() => {
      dispatch(answer);
    }, ANSWERS_AFTER_MS);

    return () => {
      clearTimeout(timer);
    };
  }, [step, game, offerPending, dispatch]);
}

/** As long as the bot takes at least, for the same reason. */
const ANSWERS_AFTER_MS = 500;
