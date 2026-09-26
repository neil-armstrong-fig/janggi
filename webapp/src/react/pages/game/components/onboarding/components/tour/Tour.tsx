import {settingsTabSelected, sheetClosed, sheetOpened} from "@src/redux/settings/SettingsSlice";
import {TOUR_STEPS} from "@src/react/pages/game/components/onboarding/components/tour/tour-steps/TourSteps";
import {TOUR_STEP_NAMES} from "@src/redux/onboarding/touring/TourStepName";
import {TourCard} from "@src/react/pages/game/components/onboarding/components/tour/components/tour-card/TourCard";
import {TourSpotlight} from "@src/react/pages/game/components/onboarding/components/tour/components/tour-spotlight/TourSpotlight";
import type {TourSheet} from "@src/react/pages/game/components/onboarding/components/tour/types/TourStep";
import {onboardingSkipped, tourSteppedBack, tourSteppedForward} from "@src/redux/onboarding/OnboardingSlice";
import {useAdvanceOnMove} from "@src/react/pages/game/components/onboarding/hooks/use-advance-on-move/UseAdvanceOnMove";
import {useAdvanceOnTap} from "@src/react/pages/game/components/onboarding/hooks/use-advance-on-tap/UseAdvanceOnTap";
import {useAppDispatch, useAppSelector} from "@src/redux/Hooks";
import {useEffectEvent, useLayoutEffect} from "react";
import {useEscapeKey} from "@src/react/pages/game/components/onboarding/hooks/use-escape-key/UseEscapeKey";
import {useTargetRect} from "@src/react/pages/game/components/onboarding/hooks/use-target-rect/UseTargetRect";

/**
 * The tour over the real page, one card at a time. Which step is up is the store's, kept on the device,
 * so a reload comes back to the same one. Skipping — the button or Escape — ends it for good, and so does
 * going on from the last step.
 *
 * A step may move on by itself when the player does what it asked (`advance`), and puts the settings
 * sheet where it needs it as it comes up — once, on arriving, so the player is never held to it. The card
 * stands on the side of the screen away from what it points at, so it is never in the way of it.
 */
export function Tour(): React.JSX.Element {
  const dispatch = useAppDispatch();
  const tourStep = useAppSelector(state => state.onboarding.tourStep);
  const moveCount = useAppSelector(state => state.game.played.past.length);
  const stepName = TOUR_STEP_NAMES[tourStep];
  const step = stepName && TOUR_STEPS[stepName];
  const forward = (): void => {
    dispatch(tourSteppedForward());
  };
  const skip = (): void => {
    dispatch(sheetClosed());
    dispatch(onboardingSkipped());
  };

  useEscapeKey(skip);
  useAdvanceOnTap(step?.advance === "tap" ? step.target : undefined, forward);
  useAdvanceOnMove(step?.advance === "move", moveCount, forward);
  const rect = useTargetRect(step?.target);

  const putSheet = useEffectEvent((sheet: TourSheet): void => {
    if (sheet === "closed") {
      dispatch(sheetClosed());
    } else {
      dispatch(settingsTabSelected(sheet));
      dispatch(sheetOpened("settings"));
    }
  });
  // Before the browser paints, so the sheet is where the step needs it in the very commit that shows the step.
  useLayoutEffect(() => {
    if (step) putSheet(step.sheet);
  }, [step]);

  // The store keeps the step within the tour, so this is only for the type: there is no step to draw.
  if (step === undefined) return <></>;

  return (
    <>
      {step.target && rect && <TourSpotlight target={step.target} rect={rect} />}

      <TourCard
        step={step}
        number={tourStep + 1}
        count={TOUR_STEP_NAMES.length}
        dock={rect !== undefined && rect.top + rect.height / 2 > window.innerHeight / 2 ? "top" : "bottom"}
        onBack={() => dispatch(tourSteppedBack())}
        onNext={forward}
        onSkip={skip}
      />
    </>
  );
}
