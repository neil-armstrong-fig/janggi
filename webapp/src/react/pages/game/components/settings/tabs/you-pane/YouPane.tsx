import {Account} from "@src/react/pages/game/components/settings/tabs/you-pane/components/account/Account";
import {DeveloperWebsiteLink} from "@src/react/pages/game/components/settings/tabs/you-pane/components/developer-website-link/DeveloperWebsiteLink";
import {GuideLink} from "@src/react/pages/game/components/settings/tabs/you-pane/components/guide-link/GuideLink";
import {InstallButton} from "@src/react/pages/game/components/settings/tabs/you-pane/components/install-button/InstallButton";
import {LanguageSetting} from "@src/react/pages/game/components/settings/tabs/you-pane/components/language-setting/LanguageSetting";
import {Progress} from "@src/react/pages/game/components/settings/tabs/you-pane/components/progress/Progress";
import {ReferencesLink} from "@src/react/pages/game/components/settings/tabs/you-pane/components/references-link/ReferencesLink";
import {ReplayTourButton} from "@src/react/pages/game/components/settings/tabs/you-pane/components/replay-tour-button/ReplayTourButton";
import {RepositoryLink} from "@src/react/pages/game/components/settings/tabs/you-pane/components/repository-link/RepositoryLink";
import {SaveTransfer} from "@src/react/pages/game/components/settings/tabs/you-pane/components/save-transfer/SaveTransfer";
import {SettingsPane} from "@src/react/pages/game/components/settings/components/settings-pane/SettingsPane";

/**
 * The You tab: the player rather than a game — the language they read it in, their XP and next unlock, optional Google sign-in, the
 * app, help and reading links, then — folded away, being rarely wanted — the save key that carries progress to another
 * device without an account. The pane scrolls as one column on a phone.
 *
 * Playing a friend is in Play and the player's own styles in Look, since each is about a game or how
 * one is drawn, not about who is playing.
 */
interface Props {
  readonly selected: boolean;
}

export function YouPane({selected}: Props): React.JSX.Element {
  return (
    <SettingsPane name="You" selected={selected}>
      <LanguageSetting />

      <Progress />

      <Account />

      <div className="flex flex-col gap-2">
        <p className="text-xs font-medium text-white/60">App &amp; help</p>

        <InstallButton />

        <GuideLink />

        <ReplayTourButton />

        <ReferencesLink />

        <DeveloperWebsiteLink />

        <RepositoryLink />
      </div>

      <SaveTransfer />
    </SettingsPane>
  );
}
