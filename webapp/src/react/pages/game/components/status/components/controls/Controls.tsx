import {BikjangButton} from "@src/react/pages/game/components/status/components/controls/components/bikjang-button/BikjangButton";
import {PassButton} from "@src/react/pages/game/components/status/components/controls/components/pass-button/PassButton";
import type {PlayedGame} from "@src/game/record/types/PlayedGame";
import {RedoButton} from "@src/react/pages/game/components/status/components/controls/components/redo-button/RedoButton";
import {SettingsButton} from "@src/react/pages/game/components/status/components/controls/components/settings-button/SettingsButton";
import {UndoButton} from "@src/react/pages/game/components/status/components/controls/components/undo-button/UndoButton";
import {canCallBikjang} from "@src/game/bikjang/CanCallBikjang";
import {canPass} from "@src/game/passing/CanPass";
import {canRedo} from "@src/game/record/CanRedo";
import {canUndo} from "@src/game/record/CanUndo";

/**
 * The row under Cho's plaque, nearest the thumb: every control a player reaches for that is not a move.
 *
 * Resting a turn and calling a bikjang are controls rather than taps on the board because they are
 * the two things a player does that touch no intersection. Resting is also the one way out of a
 * position with nothing to play, janggi having no stalemate.
 *
 * Undo and Redo are the only two controls here **not** gated on the game still being undecided —
 * taking back the turn that ended a game is the ordinary reason to reach for one. Against the bot they
 * are off altogether, because that game is rated and a rating that can be taken back is not one.
 *
 * While the game waits on the bot, Pass and Bikjang are off too: the turn is not the player's to rest,
 * nor the call theirs to make.
 *
 * Starting a new game is not in the row. It lives in the settings sheet, beside the format and the
 * setups it deals from, where a stray thumb cannot abandon a game half played — and on the announcement
 * of a result, where there is no game left to abandon.
 */
interface Props {
  readonly played: PlayedGame;
  /**
   * Whether both armies have laid out. A scored board is still being laid out until both have chosen,
   * and until then there is no game to rest a turn in or call a bikjang on — the pieces on screen are
   * only what `boardShownFor` is painting.
   */
  readonly laidOut: boolean;
  readonly againstBot: boolean;
  readonly botsTurn: boolean;
  readonly onUndo: () => void;
  readonly onRedo: () => void;
  readonly onPass: () => void;
  readonly onCallBikjang: () => void;
  readonly onOpenSettings: () => void;
}

export function Controls({
  played,
  laidOut,
  againstBot,
  botsTurn,
  onUndo,
  onRedo,
  onPass,
  onCallBikjang,
  onOpenSettings,
}: Props): React.JSX.Element {
  const game = played.present;
  const playersTurn = laidOut && !botsTurn;

  return (
    <div className="flex shrink-0 gap-1.5">
      <UndoButton enabled={!againstBot && canUndo(played)} onUndo={onUndo} />

      <RedoButton enabled={!againstBot && canRedo(played)} onRedo={onRedo} />

      <PassButton enabled={playersTurn && canPass(game)} onPass={onPass} />

      <BikjangButton enabled={playersTurn && canCallBikjang(game)} onCall={onCallBikjang} />

      <SettingsButton onOpen={onOpenSettings} />
    </div>
  );
}
