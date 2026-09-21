import {FULL_VOLUME, MUTED_VOLUME} from "@janggi/shared/janggi/settings/Volume";
import type {Volume} from "@janggi/shared/janggi/settings/Volume";

/**
 * A speaker that shows how loud it is: struck through when muted, one wave when quiet, two when loud.
 * Drawn from strokes, like the close button's cross, so it needs no icon set.
 */
interface Props {
  readonly volume: Volume;
}

export function SpeakerIcon({volume}: Props): React.JSX.Element {
  const muted = volume === MUTED_VOLUME;

  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M11 5 6 9H3v6h3l5 4z" fill="currentColor" />

      {muted && <path d="m16 9 6 6m0-6-6 6" />}

      {!muted && <path d="M15.5 8.5a5 5 0 0 1 0 7" />}

      {volume > LOUD_FROM && <path d="M18.5 5.5a9 9 0 0 1 0 13" />}
    </svg>
  );
}

/** Above half-way, the speaker draws its second wave. */
const LOUD_FROM: Volume = FULL_VOLUME / 2;
