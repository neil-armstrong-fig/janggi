import {BotStrengthSetting} from "@src/react/pages/game/components/settings/tabs/game-pane/components/bot-settings/components/bot-strength-setting/BotStrengthSetting";
import {YourSideSetting} from "@src/react/pages/game/components/settings/tabs/game-pane/components/bot-settings/components/your-side-setting/YourSideSetting";
import {useAppSelector} from "@src/redux/Hooks";

/**
 * The two settings that are questions about the bot — how strongly it plays, and which army the
 * player takes against it — laid out only while the opponent is the bot.
 *
 * Against another person there is nothing for either to answer, and a sheet that opens with two rows
 * of greyed-out pickers is harder to use one-handed than one that leaves them out. **They stay in the
 * page, only hidden**, so what each is set to is still there to be read, and nothing is remounted when
 * the opponent is changed back — the same reason a tab's pane is hidden rather than removed.
 */
export function BotSettings(): React.JSX.Element {
  const isBot = useAppSelector(state => state.game.opponent.name === "Bot");

  return (
    <div hidden={!isBot} className="flex flex-col gap-3">
      <BotStrengthSetting />

      <YourSideSetting />
    </div>
  );
}
