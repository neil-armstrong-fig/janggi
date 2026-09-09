import {BoardSettingPlaywright} from "@src/dsl/janggi/components/settings/components/board-setting/playwright/BoardSettingPlaywright";
import {ChoSetupSettingPlaywright} from "@src/dsl/janggi/components/settings/components/cho-setup-setting/playwright/ChoSetupSettingPlaywright";
import {HanSetupSettingPlaywright} from "@src/dsl/janggi/components/settings/components/han-setup-setting/playwright/HanSetupSettingPlaywright";
import {MatchFormatSettingPlaywright} from "@src/dsl/janggi/components/settings/components/match-format-setting/playwright/MatchFormatSettingPlaywright";
import {MovableHighlightSettingPlaywright} from "@src/dsl/janggi/components/settings/components/movable-highlight-setting/playwright/MovableHighlightSettingPlaywright";
import type {Page} from "@playwright/test";
import {PieceSetSettingPlaywright} from "@src/dsl/janggi/components/settings/components/piece-set-setting/playwright/PieceSetSettingPlaywright";
import {BaseComponent} from "@src/dsl/playwright/BaseComponent";

/**
 * The controls under the board. Each picker is its own component, so each one names its own test
 * ids and its own option type and nothing has to be looked up in a helper to read either.
 *
 * The two armies get a picker each because they arrange their back ranks separately.
 */
export class SettingsPlaywright extends BaseComponent {
  readonly board: BoardSettingPlaywright;
  readonly pieceSet: PieceSetSettingPlaywright;
  readonly hanSetup: HanSetupSettingPlaywright;
  readonly choSetup: ChoSetupSettingPlaywright;
  readonly movableHighlight: MovableHighlightSettingPlaywright;
  readonly matchFormat: MatchFormatSettingPlaywright;

  constructor(page: Page) {
    super(page);

    this.board = new BoardSettingPlaywright(page);
    this.pieceSet = new PieceSetSettingPlaywright(page);
    this.hanSetup = new HanSetupSettingPlaywright(page);
    this.choSetup = new ChoSetupSettingPlaywright(page);
    this.movableHighlight = new MovableHighlightSettingPlaywright(page);
    this.matchFormat = new MatchFormatSettingPlaywright(page);
  }
}
