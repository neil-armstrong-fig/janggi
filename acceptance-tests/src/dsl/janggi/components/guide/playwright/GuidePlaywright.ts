import {BasePage} from "@src/dsl/playwright/BasePage";
import type {Locator, Page} from "@playwright/test";
import type {GuidePieceStyleName} from "@src/dsl/janggi/components/guide/types/GuidePieceStyleName";
import type {PieceType} from "@janggi/shared/janggi/pieces/PieceType";

export class GuidePlaywright extends BasePage {
  private readonly install: Locator;
  private readonly pieces: Record<PieceType, Locator>;
  private readonly pieceStyles: Record<GuidePieceStyleName, Locator>;

  constructor(page: Page) {
    super(page);

    this.install = page.getByTestId("guide-install");
    this.pieces = {
      general: page.getByTestId("guide-piece-general"),
      guard: page.getByTestId("guide-piece-guard"),
      horse: page.getByTestId("guide-piece-horse"),
      elephant: page.getByTestId("guide-piece-elephant"),
      chariot: page.getByTestId("guide-piece-chariot"),
      cannon: page.getByTestId("guide-piece-cannon"),
      soldier: page.getByTestId("guide-piece-soldier"),
    };
    this.pieceStyles = {
      Traditional: page.getByTestId("guide-piece-style-traditional"),
      Hangul: page.getByTestId("guide-piece-style-hangul"),
      Modern: page.getByTestId("guide-piece-style-modern"),
    };
  }

  async visitGuide(): Promise<void> {
    await this.page.goto(new URL("learn.html", this.page.url()).href);
    await this.page
      .getByTestId("guide")
      .and(this.page.locator("[data-guide-ready='true']"))
      .waitFor({state: "visible"});
  }

  async offerInstallation(): Promise<void> {
    await this.page.evaluate(() => {
      const event = new Event("beforeinstallprompt", {cancelable: true});
      Object.defineProperties(event, {
        prompt: {
          value: () => {
            document.documentElement.dataset["installPrompted"] = "true";

            return Promise.resolve();
          },
        },
        userChoice: {value: Promise.resolve({outcome: "accepted", platform: "web"})},
      });
      globalThis.dispatchEvent(event);
    });
  }

  async chooseInstall(): Promise<void> {
    await this.install.click();
  }

  async openPiece(type: PieceType): Promise<void> {
    await this.pieces[type].locator("summary").click();
  }

  async setPieceStyleTo(name: GuidePieceStyleName): Promise<void> {
    await this.pieceStyles[name].click();
  }

  async getPageTitle(): Promise<string> {
    return await this.page.title();
  }

  async getCanonicalAddress(): Promise<string> {
    return (await this.page.locator("link[rel='canonical']").getAttribute("href")) ?? "";
  }

  async getMainHeading(): Promise<string> {
    return await this.page.getByTestId("guide").locator("h1").innerText();
  }

  async getSectionHeadings(): Promise<string[]> {
    return await this.page.getByTestId("guide-section").locator("h2").allTextContents();
  }

  async getContent(): Promise<string> {
    return (await this.page.getByTestId("guide").textContent()) ?? "";
  }

  async isPlayLinkForTheGame(): Promise<boolean> {
    const href = await this.page.getByTestId("guide-play").getAttribute("href");

    return href !== null && new URL(href, this.page.url()).href === new URL("./", this.page.url()).href;
  }

  async isInstallButtonShown(): Promise<boolean> {
    return await this.install.isVisible();
  }

  async wasInstallationPrompted(): Promise<boolean> {
    return (await this.page.locator("html").getAttribute("data-install-prompted")) === "true";
  }

  async isPieceOpen(type: PieceType): Promise<boolean> {
    return (await this.pieces[type].getAttribute("open")) !== null;
  }

  async getMovementDestinationCount(type: PieceType): Promise<number> {
    return await this.pieces[type].getByTestId("guide-movement-destination").count();
  }

  async getPieceMark(type: PieceType): Promise<string> {
    const piece = this.pieces[type].getByTestId("piece");
    const character = piece.locator("text");
    if ((await character.count()) > 0) return (await character.textContent()) ?? "";

    return (await piece.locator("path").count()) > 0 ? "drawing" : "";
  }

  async areGuideSourcesLinked(): Promise<boolean> {
    const rules = await this.page.getByTestId("guide-rules-source").getAttribute("href");
    const opponent = await this.page.getByTestId("guide-fairy-stockfish-source").getAttribute("href");

    return (
      rules === "https://github.com/neil-armstrong-fig/janggi/blob/main/docs/rules.md" &&
      opponent === "https://github.com/fairy-stockfish/Fairy-Stockfish"
    );
  }
}
