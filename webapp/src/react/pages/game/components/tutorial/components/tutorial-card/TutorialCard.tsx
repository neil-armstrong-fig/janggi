import {clsx} from "clsx";
import {useRef, useState} from "react";
import type {TargetRect} from "@src/react/pages/game/hooks/use-target-rect/UseTargetRect";
import {
  bottomEdgeOf,
  CARD_INSET,
} from "@src/react/pages/game/components/tutorial/components/tutorial-card/bottom-edge/BottomEdgeOf";
import type {BoardEdge} from "@src/react/pages/game/components/tutorial/card-dock/types/BoardEdge";
import {cardDockOf} from "@src/react/pages/game/components/tutorial/card-dock/CardDockOf";
import {useElementRect} from "@src/react/pages/game/components/tutorial/components/tutorial-card/hooks/use-element-rect/UseElementRect";
import type {TutorialTarget} from "@src/react/pages/game/components/tutorial/asked-target/AskedTargetOf";
import type {TutorialNarrationWords} from "@src/language/tutorial/types/TutorialNarrationWords";
import {useMessages} from "@src/react/pages/game/hooks/use-messages/UseMessages";

/** Hide and Show, the one control that stays on the card when it is tucked away. */
const TOGGLE = "shrink-0 cursor-pointer rounded-lg px-2 py-1 text-sm text-white/60 underline hover:text-white";

/** Lets the card set `--controls-clearance` inline without an unnamed cast at the call site. */
interface CardStyle extends React.CSSProperties {
  "--controls-clearance": string;
}

interface Props {
  /** What the scene on the board is called. */
  readonly sceneName: string;
  /** Which scene it is, counting from one. */
  readonly sceneNumber: number;
  /** Which step this is, counting from one. */
  readonly number: number;
  /** How many steps the scene has. */
  readonly steps: number;
  readonly narration: TutorialNarrationWords;
  /** Whether the step is the other army's, which the script is about to play. */
  readonly replying: boolean;
  /** What the step asks the player to tap, or undefined where it asks nothing of them. */
  readonly askingFor: TutorialTarget | undefined;
  /** Whether the tutorial's game has ended in the player's 외통. */
  readonly won: boolean;
  /** What the ring is round, which the card stands clear of; undefined where the step rings nothing. */
  readonly ring: TargetRect | undefined;
  /** Where the board is, which the card covers as little of as it can (`cardDockOf`). */
  readonly board: TargetRect | undefined;
  /** The edge of the board the step's words are about, which the card stands away from where it can. */
  readonly lookingAt: BoardEdge | undefined;
  /** How far up from the bottom of the screen the row of controls reaches, which a wide screen's card, or a tucked one, stands above. */
  readonly controlsClearance: number;
  /** Whether this is the closing card, after the last scene: no step, and Finish in place of Leave. */
  readonly closing: boolean;
  /** What comes after this scene — the next scene, or the closing card — once this one is over; undefined otherwise. */
  readonly nextSceneName: string | undefined;
  /** Goes on to what `nextSceneName` names. */
  readonly onNext?: () => void;
  readonly onLeave: () => void;
}

/**
 * The card a tutorial step is told on, in the tour card's shape: which scene and step, what it teaches, and Leave, which
 * puts the player's own game back. Once a scene is over it says how it ended, and offers Next, for the scene after it
 * (or, after the last, the closing card, whose Finish puts the player's own game back as Leave does). It never takes
 * the page, so the board behind it is there to be played.
 *
 * Hide tucks it down to its step and title, for a board it stands over — a phone's above all, which has no room beside
 * the board for it — and stays tucked from step to step, the title still saying what each asks, until Show brings the
 * words back. Tucked at the bottom, it stands above the row of controls on any screen, so Settings is in reach.
 * It stands on the sheets' layer (`z-20`), over the board and under any sheet opened over it, by coming before the
 * sheets in the page, as the result banner does.
 * On a phone it is set a little tighter, so it fits over Han's side above the board when a control is ringed below it,
 * with an opaque background above the spotlight so its instructions stay readable.
 */
export function TutorialCard({
  sceneName,
  sceneNumber,
  number,
  steps,
  narration,
  replying,
  askingFor,
  won,
  ring,
  board,
  lookingAt,
  controlsClearance,
  closing,
  nextSceneName,
  onNext,
  onLeave,
}: Props): React.JSX.Element {
  const {card: cardMessages} = useMessages().tutorial;
  const [collapsed, setCollapsed] = useState(false);
  const cardRef = useRef<HTMLElement>(null);
  const card = useElementRect(cardRef);
  const dock = cardDockOf({
    ring,
    board,
    card,
    lookingAt,
    viewportHeight: window.innerHeight,
    topEdge: CARD_INSET,
    bottomEdge: bottomEdgeOf({controlsClearance, viewportHeight: window.innerHeight}),
    lowestEdge: window.innerHeight - CARD_INSET,
  });

  return (
    <section
      ref={cardRef}
      data-testid="tutorial"
      data-step={number}
      data-steps={steps}
      data-replying={replying}
      data-scene={sceneNumber}
      data-asking-for={askingFor}
      data-won={won}
      data-closing={closing}
      data-dock={dock}
      role="region"
      aria-label={cardMessages.label}
      aria-live="polite"
      style={{"--controls-clearance": `${controlsClearance}px`} as CardStyle}
      className={clsx(
        "fixed inset-x-3 z-20 mx-auto flex max-w-md flex-col rounded-2xl bg-ground-raised p-3 shadow-2xl shadow-black ring-1 ring-gold/40 sm:right-4 sm:left-auto sm:mx-0 sm:w-80 sm:p-4",
        !collapsed && "gap-2 sm:gap-3",
        collapsed && "gap-1 py-3",
        dock === "bottom" && "bottom-[calc(var(--controls-clearance)+0.75rem)]",
        dock === "lowest" && "bottom-3",
        dock === "top" && "top-3",
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 flex-col gap-1">
          {(askingFor !== undefined || replying) && (
            <p className="text-xs tracking-wide text-white/60 uppercase">{cardMessages.stepOf(sceneName, number)}</p>
          )}

          {askingFor === undefined && !replying && !closing && (
            <p className="text-xs tracking-wide text-white/60 uppercase">{cardMessages.over(sceneName)}</p>
          )}

          {closing && <p className="text-xs tracking-wide text-white/60 uppercase">{sceneName}</p>}

          <h2 data-testid="tutorial-title" className="text-base font-semibold text-wood sm:text-lg">
            {narration.title}
          </h2>
        </div>

        {!collapsed && (
          <button
            type="button"
            data-testid="tutorial-collapse"
            aria-expanded="true"
            onClick={() => setCollapsed(true)}
            className={TOGGLE}
          >
            {cardMessages.hide}
          </button>
        )}

        {collapsed && (
          <button
            type="button"
            data-testid="tutorial-expand"
            aria-expanded="false"
            onClick={() => setCollapsed(false)}
            className={TOGGLE}
          >
            {cardMessages.show}
          </button>
        )}
      </div>

      {!collapsed && (
        <p data-testid="tutorial-narration" className="text-sm text-white/80">
          {narration.body}
        </p>
      )}

      {!collapsed && (
        <div className="flex items-center justify-between gap-2">
          {!closing && (
            <button
              type="button"
              data-testid="tutorial-leave"
              onClick={onLeave}
              className="cursor-pointer rounded-lg px-2 py-1 text-sm text-white/60 underline hover:text-white sm:py-2"
            >
              {cardMessages.leave}
            </button>
          )}

          {closing && (
            <button
              type="button"
              data-testid="tutorial-finish"
              onClick={onLeave}
              className="ml-auto cursor-pointer rounded-lg bg-wood px-3 py-1.5 text-sm font-semibold text-ink hover:bg-wood/90"
            >
              {cardMessages.finish}
            </button>
          )}

          {replying && <p className="text-sm text-white/60">{cardMessages.answering}</p>}

          {nextSceneName !== undefined && (
            <button
              type="button"
              data-testid="tutorial-next"
              onClick={onNext}
              className="cursor-pointer rounded-lg bg-wood px-3 py-1.5 text-sm font-semibold text-ink hover:bg-wood/90"
            >
              {cardMessages.next(nextSceneName)}
            </button>
          )}
        </div>
      )}
    </section>
  );
}
