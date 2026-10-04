import {inFriendRoom} from "@src/redux/online/selecting/InFriendRoom";
import {OpponentLookSwitch} from "@src/react/pages/game/components/settings/tabs/look-pane/components/opponent-look-setting/components/opponent-look-switch/OpponentLookSwitch";
import {useAppSelector} from "@src/redux/Hooks";

type OpponentLookSettingView = React.JSX.Element | null;

/**
 * Whether a friend's game is drawn in the board and pieces they play on, and this player's own sent to
 * them. A preference about how a game looks, so it sits in Look, not under the button that starts one.
 */
export function OpponentLookSetting(): OpponentLookSettingView {
  const inOnlineGame = useAppSelector(state => inFriendRoom(state.friend));
  if (!inOnlineGame) return null;

  return <OpponentLookSwitch />;
}
