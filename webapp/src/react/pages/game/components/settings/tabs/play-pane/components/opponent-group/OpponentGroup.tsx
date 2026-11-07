import {ClockSetting} from "@src/react/pages/game/components/settings/tabs/play-pane/components/opponent-group/components/clock-setting/ClockSetting";
import {useWithAFriend} from "@src/react/pages/game/components/settings/tabs/play-pane/hooks/use-with-a-friend/UseWithAFriend";
import type {PlayMessages} from "@src/language/settings/play-messages/PlayMessages";
import {BotSettings} from "@src/react/pages/game/components/settings/tabs/play-pane/components/opponent-group/components/bot-settings/BotSettings";
import {FlipBoardSetting} from "@src/react/pages/game/components/settings/tabs/play-pane/components/opponent-group/components/flip-board-setting/FlipBoardSetting";
import {OpponentSetting} from "@src/react/pages/game/components/settings/tabs/play-pane/components/opponent-group/components/opponent-setting/OpponentSetting";
import {SettingsGroup} from "@src/react/pages/game/components/settings/components/settings-group/SettingsGroup";
import {useMessages} from "@src/react/pages/game/hooks/use-messages/UseMessages";
import type {Opponent} from "@src/redux/game/types/Opponent";
import {useAppSelector} from "@src/redux/Hooks";

/**
 * Who the other army is: a person at the same device, with whether the board turns for them, or the bot, with how
 * strongly it plays and which army the player takes. Its line names the opponent, and against the bot its strength and
 * the player's army too, since those are what a player checks before a game.
 */
interface Props {
  readonly open: boolean;
  readonly onToggle: () => void;
}

export function OpponentGroup({open, onToggle}: Props): React.JSX.Element {
  const opponent = useAppSelector(state => state.game.opponent);
  const {play, clock} = useMessages();
  const name = useAppSelector(state => state.clock.name);
  const withAFriend = useWithAFriend();
  const summary = summaryOf(opponent, play);
  const showClock = opponent.name === "Human" && !withAFriend && name !== "Off";

  return (
    <SettingsGroup
      name="Opponent"
      label={play.opponent}
      summary={
        <span>
          {summary}
          {showClock && <span> · {clock.formats[name]}</span>}
        </span>
      }
      open={open}
      onToggle={onToggle}
    >
      <OpponentSetting />

      <FlipBoardSetting />

      <BotSettings />

      <ClockSetting />
    </SettingsGroup>
  );
}

function summaryOf(opponent: Opponent, play: PlayMessages): string {
  if (opponent.name === "Human") return play.opponentNames.Human;

  return [play.opponentNames.Bot, String(opponent.botElo), play.sideChoiceNames[opponent.sideChoice]].join(" · ");
}
