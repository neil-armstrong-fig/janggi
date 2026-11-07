import {SettingsSection} from "@src/react/pages/game/components/settings/components/settings-section/SettingsSection";
import type {YouGroupName} from "@janggi/shared/janggi/settings/YouGroupName";
import {TOUR_STEP_NAMES} from "@janggi/shared/janggi/onboarding/TourStepName";
import {useAppSelector} from "@src/redux/Hooks";
import {useState} from "react";
import {AccountGroup} from "@src/react/pages/game/components/settings/tabs/you-pane/components/account-group/AccountGroup";
import {AppVersion} from "@src/react/pages/game/components/settings/tabs/you-pane/components/app-version/AppVersion";
import {DeveloperWebsiteLink} from "@src/react/pages/game/components/settings/tabs/you-pane/components/developer-website-link/DeveloperWebsiteLink";
import {GuideLink} from "@src/react/pages/game/components/settings/tabs/you-pane/components/guide-link/GuideLink";
import {InstallButton} from "@src/react/pages/game/components/settings/tabs/you-pane/components/install-button/InstallButton";
import {LanguageSetting} from "@src/react/pages/game/components/settings/tabs/you-pane/components/language-setting/LanguageSetting";
import {Progress} from "@src/react/pages/game/components/settings/tabs/you-pane/components/progress/Progress";
import {ReferencesLink} from "@src/react/pages/game/components/settings/tabs/you-pane/components/references-link/ReferencesLink";
import {ReplayTourButton} from "@src/react/pages/game/components/settings/tabs/you-pane/components/replay-tour-button/ReplayTourButton";
import {RepositoryLink} from "@src/react/pages/game/components/settings/tabs/you-pane/components/repository-link/RepositoryLink";
import {SaveTransfer} from "@src/react/pages/game/components/settings/tabs/you-pane/components/save-transfer/SaveTransfer";
import {TutorialButton} from "@src/react/pages/game/components/settings/tabs/you-pane/components/tutorial-button/TutorialButton";
import {SettingsPane} from "@src/react/pages/game/components/settings/components/settings-pane/SettingsPane";
import {useMessages} from "@src/react/pages/game/hooks/use-messages/UseMessages";

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
  const {you} = useMessages();
  const highlighted = useAppSelector(state => state.settings.accountHighlighted);
  const onAccountStep = useAppSelector(
    state => state.onboarding.stage === "tour" && TOUR_STEP_NAMES[state.onboarding.tourStep] === "account",
  );
  const reveal = highlighted || onAccountStep;
  const [open, setOpen] = useState<YouGroupName | undefined>(undefined);
  const [followed, setFollowed] = useState(false);

  if (followed !== reveal) {
    setFollowed(reveal);
    if (reveal) setOpen("Account");
  }

  const toggle = (name: YouGroupName): void => {
    if (open === name) {
      setOpen(undefined);
    } else {
      setOpen(name);
    }
  };

  return (
    <SettingsPane name="You" selected={selected}>
      <LanguageSetting />

      <SettingsSection>
        <Progress />
      </SettingsSection>

      <AccountGroup open={open === "Account"} onToggle={() => toggle("Account")} />

      <div className="flex flex-col gap-2" data-testid="app-help">
        <p className="text-xs font-medium text-white/60">{you.links.heading}</p>

        <InstallButton />

        <GuideLink />

        <ReplayTourButton />

        <TutorialButton />

        <ReferencesLink />

        <DeveloperWebsiteLink />

        <RepositoryLink />
      </div>

      <SaveTransfer open={open === "SaveTransfer"} onToggle={() => toggle("SaveTransfer")} />

      <AppVersion />
    </SettingsPane>
  );
}
