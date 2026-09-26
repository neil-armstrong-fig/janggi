import type {TargetRect} from "@src/react/pages/game/components/onboarding/hooks/use-target-rect/UseTargetRect";
import type {TourTargetName} from "@janggi/shared/janggi/onboarding/TourTargetName";

interface Props {
  readonly target: TourTargetName;
  readonly rect: TargetRect;
}

/**
 * A ring round what the tour is pointing at, and the rest of the page dimmed away from it. It is a hole
 * in a shadow rather than a layer laid over the page, and it takes no taps — so what it rings is still
 * there to be tapped, and so is everything else.
 */
export function TourSpotlight({target, rect}: Props): React.JSX.Element {
  return (
    <div
      aria-hidden
      data-testid="tour-spotlight"
      data-target={target}
      className="pointer-events-none fixed z-30 rounded-xl shadow-[0_0_0_100vmax_rgb(0_0_0/0.55)] ring-2 ring-gold"
      style={{
        top: rect.top - AROUND,
        left: rect.left - AROUND,
        width: rect.width + AROUND * 2,
        height: rect.height + AROUND * 2,
      }}
    />
  );
}

/** How far the ring stands off what it goes round, in pixels. */
const AROUND = 4;
