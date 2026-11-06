import {Button} from "@src/react/pages/game/components/button/Button";
import {TUTORIAL_SCENES} from "@src/react/pages/game/tutorial/TutorialScenes";
import {canStartTheTutorial} from "@src/redux/tutorial/selecting/CanStartTheTutorial";
import {sheetClosed} from "@src/redux/settings/SettingsSlice";
import {startTheTutorial} from "@src/redux/tutorial/actions/StartTheTutorial";
import {tutorialEntryOf} from "@src/react/pages/game/tutorial/entry/TutorialEntryOf";
import {tutorialOfferOf} from "@src/redux/tutorial/progress/TutorialOfferOf";
import {useAppDispatch, useAppSelector} from "@src/redux/Hooks";
import {useMessages} from "@src/react/pages/game/hooks/use-messages/UseMessages";

/**
 * Starts the guided tutorial, putting the sheet away, since the tutorial is played on the board
 * the sheet stands over. For a player who came part way, it resumes from the furthest scene they reached, and Start over
 * beside it begins again from the whole game; once it is done, it offers to play it again. Not offered while a rated
 * game or a friend room has the board, which the tutorial would set aside.
 */
export function TutorialButton(): React.JSX.Element {
  const dispatch = useAppDispatch();
  const {you: offerMessages} = useMessages().tutorial;
  const startable = useAppSelector(canStartTheTutorial);
  const progress = useAppSelector(state => state.tutorial.progress);
  const offer = tutorialOfferOf(progress);

  return (
    <div className="flex flex-col gap-2">
      <Button
        variant="outline"
        data-testid="tutorial-start"
        data-offer={offer}
        disabled={!startable}
        onClick={() => {
          dispatch(sheetClosed());
          dispatch(startTheTutorial(tutorialEntryOf(progress)));
        }}
        className="items-center justify-between gap-4"
      >
        <span>{offerMessages.offers[offer]}</span>

        {startable && offer !== "resume" && <span className="text-xs text-wood/70">{offerMessages.aGuidedGame}</span>}

        {startable && offer === "resume" && (
          <span className="text-xs text-wood/70">
            {offerMessages.sceneOf(progress.reached + 1, TUTORIAL_SCENES.length)}
          </span>
        )}

        {!startable && <span className="text-xs text-wood/70">{offerMessages.afterYourGame}</span>}
      </Button>

      {offer === "resume" && (
        <Button
          variant="outline"
          data-testid="tutorial-start-over"
          disabled={!startable}
          onClick={() => {
            dispatch(sheetClosed());
            dispatch(startTheTutorial());
          }}
        >
          {offerMessages.startOver}
        </Button>
      )}
    </div>
  );
}
