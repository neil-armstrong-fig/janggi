import {FULL_VOLUME, MUTED_VOLUME} from "@janggi/shared/janggi/settings/Volume";
import {SpeakerIcon} from "@src/react/pages/game/components/settings/tabs/sound-pane/components/volume-slider/components/speaker-icon/SpeakerIcon";
import type {Volume} from "@janggi/shared/janggi/settings/Volume";
import {clsx} from "clsx";
import {useState} from "react";

/**
 * How loud one kind of sound is: a slider from muted to full, with a speaker beside it that mutes
 * and unmutes.
 *
 * **Muted is a volume of nothing, not a second setting.** Sliding to the bottom and pressing the
 * speaker land in the same place, and either is shown the same way — the speaker struck through in
 * the danger colour, the slider dimmed, and "Muted" where the volume is read out. The speaker's
 * `aria-pressed` is that state, and is what the acceptance tests read.
 *
 * The speaker remembers the volume it silenced, so pressing it again brings the sound back where it
 * was. That memory is only the speaker's — a slider dragged to nothing was put there on purpose, so
 * unmuting it comes back at full — and it is local state rather than `GamePage`'s, because nothing
 * but this control has any use for it.
 */
interface Props {
  /** Prefixes the `data-testid` of the slider and of its mute. */
  readonly id: string;
  readonly label: string;
  readonly volume: Volume;
  readonly onChange: (volume: Volume) => void;
}

export function VolumeSlider({id, label, volume, onChange}: Props): React.JSX.Element {
  const [unmuteTo, setUnmuteTo] = useState<Volume>(FULL_VOLUME);
  const muted = volume === MUTED_VOLUME;

  const toggleMute = (): void => {
    if (muted) {
      onChange(unmuteTo);
      return;
    }

    setUnmuteTo(volume);
    onChange(MUTED_VOLUME);
  };

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-baseline justify-between">
        <label htmlFor={`${id}-volume`} className="text-xs font-medium text-white/60">
          {label}
        </label>

        <span aria-hidden className={clsx("text-xs tabular-nums", muted && "text-danger", !muted && "text-white/40")}>
          {muted ? "Muted" : `${volume}%`}
        </span>
      </div>

      <div className="flex items-center gap-2 rounded-xl bg-black/25 p-1 pr-3">
        <button
          type="button"
          data-testid={`${id}-mute`}
          aria-label={`Mute ${label.toLowerCase()}`}
          aria-pressed={muted}
          onClick={toggleMute}
          className={clsx(
            "flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-lg transition-colors duration-150 hover:bg-white/10 motion-reduce:transition-none",
            muted && "text-danger",
            !muted && "text-white/70",
          )}
        >
          <SpeakerIcon volume={volume} />
        </button>

        <input
          id={`${id}-volume`}
          data-testid={`${id}-volume`}
          type="range"
          min={MUTED_VOLUME}
          max={FULL_VOLUME}
          step={1}
          value={volume}
          onChange={event => onChange(Number(event.target.value))}
          className={clsx(
            "h-10 min-w-0 flex-1 cursor-pointer accent-wood transition-opacity duration-150 motion-reduce:transition-none",
            muted && "opacity-40",
          )}
        />
      </div>
    </div>
  );
}
