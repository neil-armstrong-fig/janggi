import type {SettingsSectionName} from "@janggi/shared/janggi/settings/SettingsSectionName";
import {clsx} from "clsx";
import {useId, useState} from "react";

/**
 * A titled section of the settings sheet — "This game", "Appearance", "Sound & effects" — so a player
 * looking for the piece set does not have to read past the opening setups to find it.
 *
 * **It folds.** The sheet grew longer than a phone shows at once, so the heading is a button that folds
 * the section's settings away beneath it. Folded, they are `hidden` rather than unmounted: every
 * picker's pressed and disabled state is still in the page to be read, and nothing is remounted when
 * the section is opened again. Whether it is open is this component's own state — nothing else wants
 * to know, and it is forgotten with the page, as whether the sheet itself is open is.
 */
interface Props {
  readonly title: SettingsSectionName;
  /** Whether the section starts laid out rather than folded away. */
  readonly initiallyOpen?: boolean;
  readonly children: React.ReactNode;
}

export function SettingsGroup({title, initiallyOpen = false, children}: Props): React.JSX.Element {
  const [open, setOpen] = useState(initiallyOpen);
  const contentId = useId();

  return (
    <section data-testid="settings-section" data-section={title} aria-label={title} className="flex flex-col gap-3">
      <h3>
        <button
          type="button"
          data-testid="settings-section-toggle"
          aria-expanded={open}
          aria-controls={contentId}
          onClick={() => setOpen(wasOpen => !wasOpen)}
          className="flex w-full cursor-pointer items-center justify-between border-b border-white/10 pb-1 text-xs font-semibold tracking-wide text-white/40 uppercase transition-colors hover:text-white/70 motion-reduce:transition-none"
        >
          {title}

          <svg
            viewBox="0 0 24 24"
            aria-hidden
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            className={clsx(
              "h-4 w-4 transition-transform duration-200 motion-reduce:transition-none",
              open && "rotate-180",
            )}
          >
            <path d="m6 9 6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </h3>

      <div id={contentId} hidden={!open} className="flex flex-col gap-3">
        {children}
      </div>
    </section>
  );
}
