import {WelcomeChoices} from "@src/react/pages/game/components/onboarding/components/welcome/components/welcome-choices/WelcomeChoices";
import {WelcomeIntro} from "@src/react/pages/game/components/onboarding/components/welcome/components/welcome-intro/WelcomeIntro";
import {onboardingSkipped, tourStarted} from "@src/redux/onboarding/OnboardingSlice";
import {useAppDispatch} from "@src/redux/Hooks";
import {useEscapeKey} from "@src/react/pages/game/components/onboarding/hooks/use-escape-key/UseEscapeKey";
import {useState} from "react";

/**
 * The first thing a new player sees, over a board they have not yet touched: what Janggi is, and then how
 * they would like it to sound and move. A modal, since nothing behind it is worth acting on until it is
 * read — but it is never a wall. **Skip is on every screen and so is Escape**, and neither is punished:
 * the welcome is not shown again.

 */
export function Welcome(): React.JSX.Element {
  const dispatch = useAppDispatch();
  const [choosing, setChoosing] = useState(false);
  const skip = (): void => {
    dispatch(onboardingSkipped());
  };
  useEscapeKey(skip);

  return (
    <div className="fixed inset-0 z-30 flex items-end justify-center bg-black/60 p-3 sm:items-center">
      <section
        data-testid="welcome"
        role="dialog"
        aria-modal
        aria-labelledby="welcome-title"
        className="flex max-h-full w-full max-w-md flex-col gap-4 overflow-y-auto rounded-2xl bg-ground-raised p-5 shadow-2xl shadow-black"
      >
        {!choosing && <WelcomeIntro onContinue={() => setChoosing(true)} />}

        {choosing && <WelcomeChoices onStartTour={() => dispatch(tourStarted())} />}

        <button
          type="button"
          data-testid="welcome-skip"
          onClick={skip}
          className="cursor-pointer self-center rounded-lg px-3 py-2 text-sm text-white/60 underline hover:text-white"
        >
          Skip, just play
        </button>
      </section>
    </div>
  );
}
