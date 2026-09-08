import {BoardDsl} from "@src/dsl/janggi/components/board/BoardDsl";
import {DslError} from "@src/dsl/errors/DslError";
import type {JanggiPlaywright} from "@src/dsl/janggi/playwright/JanggiPlaywright";
import {SettingsDsl} from "@src/dsl/janggi/components/settings/SettingsDsl";

/**
 * The application under test, and the whole of what a spec is handed.
 *
 * Every object in the DSL is a pair: the `*Dsl` here, and the `*Playwright` beside it in
 * `playwright/` that actually drives the browser. This half holds no locators. Each method is a
 * call straight down into its own counterpart, wrapped in a `try`/`catch` that rethrows a
 * `DslError` naming the intention, so a failure reads as a sentence rather than as a raw timeout.
 * Most are one-to-one; occasionally one sequences two calls or decides something between them, and
 * that exception is why the layer is written by hand rather than generated.
 *
 * What sits here and what sits on a member is the one real design decision: **this level owns the
 * browser** — opening the app, and the window it is viewed through — and **each member answers for
 * its own part of the screen**. A window belongs to nothing on the board, so `resizeWindowTo` is
 * here; whether the board fits inside that window is a question about the board, so it is on
 * `board`.
 *
 * Further areas arrive as further members, which is what keeps a spec reading as
 * `janggi.settings.setBoardSettingTo("Neon")` rather than as a flat pile of methods that no longer
 * says what any of them is about.
 */
export class JanggiDsl {
  readonly board: BoardDsl;
  readonly settings: SettingsDsl;

  constructor(private readonly janggi: JanggiPlaywright) {
    this.board = new BoardDsl(janggi.board);
    this.settings = new SettingsDsl(janggi.settings);
  }

  async navigateToPage(): Promise<void> {
    try {
      await this.janggi.open();
    } catch (error) {
      throw new DslError("Failed to navigate to the game", error);
    }
  }

  /** Resizes the window, the way a user dragging the corner of a browser would. */
  async resizeWindowTo(width: number, height: number): Promise<void> {
    try {
      await this.janggi.resizeWindowTo(width, height);
    } catch (error) {
      throw new DslError(`Failed to resize the window to ${width}x${height}`, error);
    }
  }
}
