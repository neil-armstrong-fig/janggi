import {clsx} from "clsx";
import {Button} from "@src/react/pages/game/components/button/Button";
import {TUTORIAL_SCENES} from "@src/react/pages/game/tutorial/TutorialScenes";
import {canStartTheTutorial} from "@src/redux/slices/tutorial/selecting/CanStartTheTutorial";
import {sheetClosed} from "@src/redux/slices/settings/SettingsSlice";
import {startTheTutorial} from "@src/redux/slices/tutorial/actions/StartTheTutorial";
import {tutorialEntryOf} from "@src/react/pages/game/tutorial/entry/TutorialEntryOf";
import {tutorialOfferOf} from "@src/redux/slices/tutorial/progress/TutorialOfferOf";
import {useAppDispatch, useAppSelector} from "@src/redux/Hooks";
import {useMessages} from "@src/react/pages/game/hooks/use-messages/UseMessages";

interface Props {
  readonly testId: string;
  readonly compact?: boolean;
  readonly primary?: boolean;
  readonly startOver?: boolean;
}

/**
 * Starts the guided tutorial, putting the sheet away, since the tutorial is played on the board
 * the sheet stands over. For a player who came part way, it resumes from the furthest scene they reached, and Start over
 * beside it begins again from the whole game; once it is done, it offers to play it again. Not offered while a rated
 * game or a friend room has the board, which the tutorial would set aside.
 */
export function GuidedGameButton({
  testId,
  compact = false,
  primary = false,
  startOver = false,
}: Props): React.JSX.Element {
  const dispatch = useAppDispatch();
  const {you: offerMessages} = useMessages().tutorial;
  const startable = useAppSelector(canStartTheTutorial);
  const progress = useAppSelector(state => state.tutorial.progress);
  const offer = tutorialOfferOf(progress);

  return (
    <div className="flex flex-col gap-2">
      <button
        type="button"
        data-testid={testId}
        data-offer={offer}
        disabled={!startable}
        aria-label={offerMessages.offers[offer]}
        title={(!startable && offerMessages.afterYourGame) || undefined}
        aria-description={(!startable && offerMessages.afterYourGame) || undefined}
        onClick={() => {
          dispatch(sheetClosed());
          dispatch(startTheTutorial(tutorialEntryOf(progress)));
        }}
        className={clsx(
          "flex cursor-pointer items-center gap-3 rounded-lg border disabled:cursor-not-allowed disabled:opacity-50",
          compact && "min-h-9 whitespace-nowrap px-2 py-1 text-xs",
          !compact && !primary && "min-h-11 px-3 py-2 text-sm",
          primary &&
            "flex-col justify-center border-gold bg-gold px-4 py-3 text-center text-base font-semibold text-ink enabled:hover:bg-gold/90",
          !primary && "justify-between border-wood/20 text-wood enabled:hover:bg-wood/10",
        )}
      >
        <span>
          {compact && offerMessages.name}
          {!compact && offerMessages.offers[offer]}
        </span>

        {!compact && !primary && startable && offer !== "resume" && (
          <span className="text-xs text-wood/70">{offerMessages.aGuidedGame}</span>
        )}

        {!compact && startable && offer === "resume" && (
          <span className={clsx("text-xs", primary && "text-ink/70", !primary && "text-wood/70")}>
            {offerMessages.sceneOf(progress.reached + 1, TUTORIAL_SCENES.length)}
          </span>
        )}

        {!compact && !startable && <span className="text-xs text-wood/70">{offerMessages.afterYourGame}</span>}
      </button>

      {startOver && offer === "resume" && (
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
