import type {SettingsTabName} from "@janggi/shared/janggi/settings/SettingsTabName";
import {EyeIcon} from "@src/react/pages/game/components/svg-icon/icons/eye/EyeIcon";
import {PersonIcon} from "@src/react/pages/game/components/svg-icon/icons/person/PersonIcon";
import {PlayIcon} from "@src/react/pages/game/components/svg-icon/icons/play/PlayIcon";
import {SoundIcon} from "@src/react/pages/game/components/svg-icon/icons/sound/SoundIcon";

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
      {GLYPHS[name]}
    </span>
  );
}

/** A play triangle, an eye, a speaker's cone with a wave, and a head and shoulders. */
const GLYPHS: Record<SettingsTabName, React.JSX.Element> = {
  Play: <PlayIcon className="h-4 w-4" />,
  Look: <EyeIcon className="h-4 w-4" />,
  Sound: <SoundIcon className="h-4 w-4" />,
  You: <PersonIcon className="h-4 w-4" />,
};
