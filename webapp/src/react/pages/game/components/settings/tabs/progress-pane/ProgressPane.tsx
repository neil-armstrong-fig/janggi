import {GuideLink} from "@src/react/pages/game/components/settings/tabs/progress-pane/components/guide-link/GuideLink";
import {InstallButton} from "@src/react/pages/game/components/settings/tabs/progress-pane/components/install-button/InstallButton";
import {Progress} from "@src/react/pages/game/components/settings/tabs/progress-pane/components/progress/Progress";
import {ReferencesLink} from "@src/react/pages/game/components/settings/tabs/progress-pane/components/references-link/ReferencesLink";
import {SettingsPane} from "@src/react/pages/game/components/settings/components/settings-pane/SettingsPane";

/**
 * The Progress tab: the XP, what it opens next, and the save key that carries it to another device —
 * then the links out of the game: installing it, how to play, and the credits.
 *
 * The links sit here, at the foot of the scroll, because they belong to no other tab and are the least
 * often wanted; installing is only offered where the browser offers it, on a phone. Handed only whether
 * its tab is showing.
 */
interface Props {
  readonly selected: boolean;
}

export function ProgressPane({selected}: Props): React.JSX.Element {
  return (
    <SettingsPane name="Progress" selected={selected}>
      <Progress />

      <div className="flex flex-col gap-2">
        <InstallButton />

        <GuideLink />

        <ReferencesLink />
      </div>
    </SettingsPane>
  );
}
