import type {BeatenLadders} from "@src/redux/progress/types/ProgressSliceState";
import type {BoardStyle} from "@src/styles/types/BoardStyle";
import type {BotElo} from "@janggi/shared/janggi/settings/BotElo";
import type {MatchFormat} from "@janggi/shared/janggi/settings/MatchFormat";
import type {PieceSetStyle} from "@src/styles/types/PieceSetStyle";
import type {Save} from "@src/redux/saves/types/Save";
import type {CustomStylesSliceState} from "@src/redux/custom-styles/types/CustomStylesSliceState";
import {LATEST_SAVE_VERSION} from "@janggi/shared/janggi/progress/SaveKeyJson";
import type {SaveKeyJson} from "@janggi/shared/janggi/progress/SaveKeyJson";
import type {Side} from "@janggi/shared/janggi/pieces/Side";
import {encodeKey} from "@janggi/shared/janggi/share-keys/EncodeKey";
import {freshProgress} from "@src/redux/progress/fresh-progress/FreshProgress";
import {noCustomStyles} from "@src/redux/custom-styles/no-custom-styles/NoCustomStyles";

/**
 * A save, built a field at a time, and the key that carries it.
 *
 * **The key's JSON is assembled in one place, against a named shape** — `SaveKeyJson` — rather than
 * written as a literal wherever a key is wanted. A field renamed on the state a save comes from is then a
 * compile error here, instead of a key that quietly loads as a player who has never played. What it
 * writes is still plain JSON, because a player decoding one and editing it is the point.
 *
 * **Every step returns a new builder**, leaving the one it came from alone, so a save can be branched from
 * more than once — which is what a test asking "and the same again, but one rung higher" wants.
 *
 * A builder rather than a function of many arguments because a save is mostly defaults: the two things
 * anybody sets are the XP and a ladder or two, and naming those alone is the readable way to say it.
 */
export class SaveBuilder {
  private readonly save: Save;

  private constructor(save: Save) {
    this.save = save;
  }

  /** A player who has nothing yet: no XP, no bot beaten, no styles of their own. */
  static empty(): SaveBuilder {
    return new SaveBuilder({progress: freshProgress(), customStyles: noCustomStyles()});
  }

  /** The save this device would write now. */
  static of(save: Save): SaveBuilder {
    return new SaveBuilder(save);
  }

  withXp(xp: number): SaveBuilder {
    return new SaveBuilder({...this.save, progress: {...this.save.progress, xp}});
  }

  /** Strengths beaten on one ladder — one army, in one format — added to whatever that ladder holds. */
  beating(format: MatchFormat, side: Side, ...elos: readonly BotElo[]): SaveBuilder {
    const ladders = this.save.progress.beaten;
    const beaten: BeatenLadders = {
      ...ladders,
      [format]: {...ladders[format], [side]: [...new Set([...ladders[format][side], ...elos])]},
    };

    return new SaveBuilder({...this.save, progress: {...this.save.progress, beaten}});
  }

  withBoardStyle(style: BoardStyle): SaveBuilder {
    const boards = [...this.save.customStyles.boards, style];

    return new SaveBuilder({...this.save, customStyles: {...this.save.customStyles, boards}});
  }

  withPieceSet(set: PieceSetStyle): SaveBuilder {
    const pieceSets = [...this.save.customStyles.pieceSets, set];

    return new SaveBuilder({...this.save, customStyles: {...this.save.customStyles, pieceSets}});
  }

  build(): Save {
    return this.save;
  }

  /** The key a player copies: the save as JSON, in base64url. */
  key(): string {
    const written: SaveKeyJson<CustomStylesSliceState> = {
      v: LATEST_SAVE_VERSION,
      xp: this.save.progress.xp,
      beaten: this.save.progress.beaten,
      customStyles: this.save.customStyles,
    };

    return encodeKey("save", written);
  }
}
