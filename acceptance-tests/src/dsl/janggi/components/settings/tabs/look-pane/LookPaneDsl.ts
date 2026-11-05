import {BoardSettingDsl} from "@src/dsl/janggi/components/settings/tabs/look-pane/components/board-setting/BoardSettingDsl";
import {PieceSetSettingDsl} from "@src/dsl/janggi/components/settings/tabs/look-pane/components/piece-set-setting/PieceSetSettingDsl";
import {MovableHighlightSettingDsl} from "@src/dsl/janggi/components/settings/tabs/look-pane/components/movable-highlight-setting/MovableHighlightSettingDsl";
import {BikjangHintSettingDsl} from "@src/dsl/janggi/components/settings/tabs/look-pane/components/bikjang-hint-setting/BikjangHintSettingDsl";
import {OpponentLookSettingDsl} from "@src/dsl/janggi/components/settings/tabs/look-pane/components/opponent-look-setting/OpponentLookSettingDsl";
import {OpacitySettingDsl} from "@src/dsl/janggi/components/settings/tabs/look-pane/components/opacity-setting/OpacitySettingDsl";
import {EffectsSettingDsl} from "@src/dsl/janggi/components/settings/tabs/look-pane/components/effects-setting/EffectsSettingDsl";
import type {Page} from "@playwright/test";

/**
 * The Look tab of the settings sheet, reached as `janggi.settings.look`: one member per setting the app draws in it
 * (`webapp/src/react/pages/game/components/settings/tabs/look-pane/`).
 */
export class LookPaneDsl {
  readonly board: BoardSettingDsl;
  readonly pieceSet: PieceSetSettingDsl;
  readonly movableHighlight: MovableHighlightSettingDsl;
  readonly bikjangHint: BikjangHintSettingDsl;
  readonly opponentLook: OpponentLookSettingDsl;
  readonly opacity: OpacitySettingDsl;
  readonly effects: EffectsSettingDsl;

  constructor(page: Page) {
    this.board = new BoardSettingDsl(page);
    this.pieceSet = new PieceSetSettingDsl(page);
    this.movableHighlight = new MovableHighlightSettingDsl(page);
    this.bikjangHint = new BikjangHintSettingDsl(page);
    this.opponentLook = new OpponentLookSettingDsl(page);
    this.opacity = new OpacitySettingDsl(page);
    this.effects = new EffectsSettingDsl(page);
  }
}
