import {clsx} from "clsx";
import {SvgIcon} from "@src/react/pages/game/components/svg-icon/SvgIcon";
import type {TourStepWords} from "@src/language/types/TourStepWords";
import type {TourStep} from "@src/react/pages/game/components/onboarding/components/tour/types/TourStep";
import {useMessages} from "@src/react/pages/game/hooks/use-messages/UseMessages";

interface Props {
  readonly step: TourStep;
  /** What the step says, in the language the game is read in. */
  readonly words: TourStepWords;
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
 * last, Next is Finish. Back, Next and Finish are drawn as arrows and a tick, which read the same in any
 * language, and named in words for a screen reader.
 */
export function TourCard({step, words, number, count, dock, onBack, onNext, onSkip}: Props): React.JSX.Element {
  const {tour} = useMessages();
  const last = number === count;

  return (
    <section
      data-testid="tour"
      role="region"
      aria-label={tour.card}
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
        {tour.stepOf(number, count)}
      </p>

      <h2 data-testid="tour-title" className="text-lg font-semibold text-wood">
        {words.title}
      </h2>

      <p data-testid="tour-body" className="text-sm text-white/80">
        {words.body}
      </p>

      {step.offersTheGuide && (
        <a
          data-testid="tour-open-guide"
          href={`${import.meta.env.BASE_URL}learn.html`}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-lg bg-gold px-4 py-3 text-center font-semibold text-ink"
        >
          {tour.openTheGuide}
        </a>
      )}

      <div className="flex items-center justify-between gap-2">
        <button
          type="button"
          data-testid="tour-skip"
          onClick={onSkip}
          className="cursor-pointer rounded-lg px-2 py-2 text-sm text-white/60 underline hover:text-white"
        >
          {tour.skip}
        </button>

        <div className="flex gap-2">
          <button
            type="button"
            data-testid="tour-back"
            aria-label={tour.back}
            disabled={number === 1}
            onClick={onBack}
            className="cursor-pointer rounded-lg bg-white/10 px-3 py-2 text-white/80 hover:bg-white/20 disabled:cursor-default disabled:opacity-40"
          >
            <SvgIcon>
              <path d="M15 6l-6 6 6 6" />
            </SvgIcon>
          </button>

          {!last && (
            <button
              type="button"
              data-testid="tour-next"
              aria-label={tour.next}
              onClick={onNext}
              className="cursor-pointer rounded-lg bg-gold px-4 py-2 font-semibold text-ink"
            >
              <SvgIcon>
                <path d="M9 6l6 6-6 6" />
              </SvgIcon>
            </button>
          )}

          {last && (
            <button
              type="button"
              data-testid="tour-finish"
              aria-label={tour.finish}
              onClick={onNext}
              className="cursor-pointer rounded-lg bg-gold px-4 py-2 font-semibold text-ink"
            >
              <SvgIcon>
                <path d="m5 12.5 4.5 4.5L19 7.5" />
              </SvgIcon>
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
