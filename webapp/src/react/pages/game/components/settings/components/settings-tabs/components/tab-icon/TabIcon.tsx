import type {SettingsTabName} from "@janggi/shared/janggi/settings/SettingsTabName";
import {SvgIcon} from "@src/react/pages/game/components/svg-icon/SvgIcon";

/**
 * The picture a settings tab wears above its name, so the four can be told apart without reading them —
 * which is what a player who does not read English needs from a row of words.
 *
 * Typed against every tab name, so a tab added to `@janggi/shared` without a picture does not compile.
 */
interface Props {
  readonly name: SettingsTabName;
}

export function TabIcon({name}: Props): React.JSX.Element {
  return (
    <span data-testid="settings-tab-icon" className="flex">
      <SvgIcon className="h-4 w-4">{GLYPHS[name]}</SvgIcon>
    </span>
  );
}

/** A play triangle, an eye, a speaker's cone with a wave, and a head and shoulders. */
const GLYPHS: Record<SettingsTabName, React.ReactNode> = {
  Play: <path d="M7 4.5v15l12-7.5z" />,
  Look: (
    <>
      <path d="M2 12s3.5-6.5 10-6.5S22 12 22 12s-3.5 6.5-10 6.5S2 12 2 12z" />

      <circle cx="12" cy="12" r="2.8" />
    </>
  ),
  Sound: (
    <>
      <path d="M11 5 6 9H3v6h3l5 4z" />

      <path d="M15.5 8.5a5 5 0 0 1 0 7M18.5 5.5a9 9 0 0 1 0 13" />
    </>
  ),
  You: (
    <>
      <circle cx="12" cy="8" r="3.5" />

      <path d="M5 20c0-3.9 3.1-6 7-6s7 2.1 7 6" />
    </>
  ),
};
