import {SettingsGroup} from "@src/react/pages/game/components/settings/components/settings-group/SettingsGroup";
import {Account} from "@src/react/pages/game/components/settings/tabs/you-pane/components/account-group/components/account/Account";
import {accountSummary} from "@src/react/pages/game/components/settings/tabs/you-pane/components/account-group/summary/AccountSummary";
import {useAppSelector} from "@src/redux/Hooks";
import {useMessages} from "@src/react/pages/game/hooks/use-messages/UseMessages";

interface Props {
  readonly open: boolean;
  readonly onToggle: () => void;
}

export function AccountGroup({open, onToggle}: Props): React.JSX.Element {
  const accountSliceState = useAppSelector(state => state.account);
  const {you} = useMessages();

  return (
    <SettingsGroup
      name="Account"
      label={you.account.label}
      summary={accountSummary(accountSliceState, you)}
      open={open}
      onToggle={onToggle}
    >
      <Account />
    </SettingsGroup>
  );
}
