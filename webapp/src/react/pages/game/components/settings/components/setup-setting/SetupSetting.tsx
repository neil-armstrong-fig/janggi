import {choSetupChosen, hanSetupChosen} from "@src/redux/game/GameSlice";
import {useAppDispatch, useAppSelector} from "@src/redux/Hooks";
import {OptionPicker} from "@src/react/pages/game/components/settings/components/option-picker/OptionPicker";
import {SETUPS} from "@src/game/setups/Setups";
import type {Side} from "@janggi/shared/janggi/pieces/Side";
import {canPlace} from "@src/game/setups/CanPlace";
import {opponentOf} from "@src/game/utils/OpponentOf";
import {playHasBegun} from "@src/react/pages/game/utils/PlayHasBegun";
import {sideName} from "@src/react/pages/game/utils/SideNames";

/**
 * One army's opening arrangement. The two armies get a picker each because they genuinely choose
 * separately: Han lays out first, Cho answers, and whether the elephants end up on the same wing or facing
 * each other across the board is the result of those two choices rather than of one setting. See
 * `Setups.ts`, and `ElephantPairingLine`, which names that pairing where the game has a name for it.
 *
 * In a **scored** game that order is a rule — `docs/rules.md` §6.6 — so the two pickers open empty, Cho's
 * waits for Han, and Han's closes the moment it is used. In a **casual** game none of that applies: the
 * pieces are simply dealt on the common arrangement and either army may be re-chosen until the first move.
 * The rule itself is `canPlace`. Against the bot, the bot's own army lays itself out, so its picker is
 * closed to the player.
 *
 * Handed which army it is for, and reads the rest for itself.
 */
interface Props {
  readonly side: Side;
}

export function SetupSetting({side}: Props): React.JSX.Element {
  const {played, phase, opponent} = useAppSelector(state => state.game);
  const dispatch = useAppDispatch();

  const laysOutItself =
    opponent.name === "Bot" && phase.format === "Scored" && opponentOf(opponent.playerSide) === side;

  return (
    <OptionPicker
      id={`${side}-setup`}
      disabled={playHasBegun(played) || laysOutItself || !canPlace(phase, side)}
      label={`${sideName(side)}'s setup`}
      ariaLabel={`${sideName(side)}'s opening setup`}
      options={SETUPS}
      selected={side === "han" ? phase.hanSetup : phase.choSetup}
      onSelect={setup => dispatch(side === "han" ? hanSetupChosen(setup) : choSetupChosen(setup))}
    />
  );
}
