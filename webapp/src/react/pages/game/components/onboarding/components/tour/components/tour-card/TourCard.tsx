import {clsx} from "clsx";
import type {TourStep} from "@src/react/pages/game/components/onboarding/components/tour/types/TourStep";

interface Props {
  readonly step: TourStep;
  /** Which step this is, counting from one as the card says it. */
  readonly number: number;
  readonly count: number;
  /** Which edge of the screen it stands against — the one away from what it points at. */
  readonly dock: "top" | "bottom";
  readonly onBack: () => void;
  readonly onNext: () => void;
  readonly onSkip: () => void;
}

/**
 * The card a tour step is told on: where the player is, what this step says, and Back, Next and Skip.
 * It never takes the page — nothing behind it is dimmed out of reach — and Skip is on every step. On the
 * last, Next is Finish.
 */
export function TourCard({step, number, count, dock, onBack, onNext, onSkip}: Props): React.JSX.Element {
  const last = number === count;

  return (
    <section
      data-testid="tour"
      role="region"
      aria-label="Quick tour"
      aria-live="polite"
      className={clsx(
        "fixed inset-x-3 z-30 mx-auto flex max-w-md flex-col gap-3 rounded-2xl bg-ground-raised p-4 shadow-2xl shadow-black ring-1 ring-gold/40 sm:right-4 sm:left-auto sm:mx-0 sm:w-80",
        dock === "bottom" && "bottom-3",
        dock === "top" && "top-3",
      )}
    >
      <p
        data-testid="tour-step"
        data-step={number}
        data-step-count={count}
        className="text-xs tracking-wide text-white/60 uppercase"
      >
        Step {number} of {count}
      </p>

      <h2 data-testid="tour-title" className="text-lg font-semibold text-wood">
        {step.title}
      </h2>

      <p data-testid="tour-body" className="text-sm text-white/80">
        {step.body}
      </p>

      {step.offersTheGuide && (
        <a
          data-testid="tour-open-guide"
          href={`${import.meta.env.BASE_URL}learn.html`}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-lg bg-gold px-4 py-3 text-center font-semibold text-ink"
        >
          Open the guide
        </a>
      )}

      <div className="flex items-center justify-between gap-2">
        <button
          type="button"
          data-testid="tour-skip"
          onClick={onSkip}
          className="cursor-pointer rounded-lg px-2 py-2 text-sm text-white/60 underline hover:text-white"
        >
          Skip tour
        </button>

        <div className="flex gap-2">
          <button
            type="button"
            data-testid="tour-back"
            disabled={number === 1}
            onClick={onBack}
            className="cursor-pointer rounded-lg bg-white/10 px-3 py-2 text-sm text-white/80 hover:bg-white/20 disabled:cursor-default disabled:opacity-40"
          >
            Back
          </button>

          {!last && (
            <button
              type="button"
              data-testid="tour-next"
              onClick={onNext}
              className="cursor-pointer rounded-lg bg-gold px-4 py-2 text-sm font-semibold text-ink"
            >
              Next
            </button>
          )}

          {last && (
            <button
              type="button"
              data-testid="tour-finish"
              onClick={onNext}
              className="cursor-pointer rounded-lg bg-gold px-4 py-2 text-sm font-semibold text-ink"
            >
              Finish
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
