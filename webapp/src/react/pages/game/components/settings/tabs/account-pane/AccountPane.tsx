import {Account} from "@src/react/pages/game/components/settings/tabs/account-pane/components/account/Account";
import {GuideLink} from "@src/react/pages/game/components/settings/tabs/account-pane/components/guide-link/GuideLink";
import {InstallButton} from "@src/react/pages/game/components/settings/tabs/account-pane/components/install-button/InstallButton";
import {PlayAFriendEntry} from "@src/react/pages/game/components/settings/tabs/account-pane/components/play-a-friend-entry/PlayAFriendEntry";
import {ReferencesLink} from "@src/react/pages/game/components/settings/tabs/account-pane/components/references-link/ReferencesLink";
import {ReplayTourButton} from "@src/react/pages/game/components/settings/tabs/account-pane/components/replay-tour-button/ReplayTourButton";
import {SettingsPane} from "@src/react/pages/game/components/settings/components/settings-pane/SettingsPane";

/**
 * The Account tab: optional Google sign-in, followed by the app, help and reading links that belong
 * to the player rather than to a game setting. The pane scrolls as one column on a phone.
 */
interface Props {
  readonly selected: boolean;
}

export function AccountPane({selected}: Props): React.JSX.Element {
  return (
    <SettingsPane name="Account" selected={selected}>
      <Account />

      <PlayAFriendEntry />

      <div className="flex flex-col gap-2">
        <p className="text-xs font-medium text-white/60">App &amp; help</p>

        <InstallButton />

        <GuideLink />

        <ReplayTourButton />
      </div>

      <div className="flex flex-col gap-2">
        <p className="text-xs font-medium text-white/60">About</p>

        <ReferencesLink />
      </div>
    </SettingsPane>
  );
}
