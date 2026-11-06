import {BasePage} from "@src/dsl/playwright/BasePage";
import type {Locator, Page} from "@playwright/test";
import type {GuidePieceStyleName} from "@src/dsl/janggi/components/guide/types/GuidePieceStyleName";
import type {PieceType} from "@janggi/shared/janggi/pieces/PieceType";

type Bounds = NonNullable<Awaited<ReturnType<Locator["boundingBox"]>>>;

export class GuidePlaywright extends BasePage {
  private readonly install: Locator;
  private readonly translationNotice: Locator;
  private readonly englishGuide: Locator;
  private readonly play: Locator;
  private readonly pieces: Record<PieceType, Locator>;
  private readonly pieceStyles: Record<GuidePieceStyleName, Locator>;

  constructor(page: Page) {
    super(page);

    this.install = page.getByTestId("guide-install");
    this.translationNotice = page.getByTestId("translation-notice");
    this.englishGuide = page.getByTestId("translation-notice-original");
    this.play = page.getByTestId("guide-play");
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
    await this.waitUntilReady();
  }

  /** Goes to the guide's Korean page, and waits as `visitGuide` does. */
  async visitKoreanGuide(): Promise<void> {
    await this.page.goto(new URL("ko/learn.html", this.page.url()).href);
    await this.waitUntilReady();
  }

  private async waitUntilReady(): Promise<void> {
    await this.page
      .getByTestId("guide")
      .and(this.page.locator("[data-guide-ready='true']"))
      .waitFor({state: "visible"});
  }

  /** What the page says of being machine translated, or an empty string where it says nothing. */
  async getTranslationNotice(): Promise<string> {
    if ((await this.translationNotice.count()) === 0) return "";

    return ((await this.translationNotice.textContent()) ?? "").trim();
  }

  /** Where the notice's link to the English guide goes, as written in the page. */
  async getEnglishGuideAddress(): Promise<string> {
    return (await this.englishGuide.getAttribute("href")) ?? "";
  }

  /** Where the footer's link to the references goes, as written in the page. */
  async getReferencesAddress(): Promise<string> {
    return (await this.page.getByTestId("guide-references").getAttribute("href")) ?? "";
  }

  /** Where the link into the game goes, as written in the page. */
  async getPlayLinkAddress(): Promise<string> {
    return (await this.play.getAttribute("href")) ?? "";
  }

  async getPieceName(type: PieceType): Promise<string> {
    return ((await this.pieces[type].getByTestId("guide-piece-name").textContent()) ?? "").trim();
  }

  async chooseInstall(): Promise<void> {
    await this.install.click();
  }

  async openPiece(type: PieceType): Promise<void> {
    await this.pieces[type].locator("summary").click();
  }

  async closePiece(type: PieceType): Promise<void> {
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
    const href = (await this.page.getByTestId("guide-play").getAttribute("href")) ?? undefined;

    return href !== undefined && new URL(href, this.page.url()).href === new URL("./", this.page.url()).href;
  }

  /** On the title's row, and reaching the header's right edge. */
  async isLanguageSwitchBesideTheTitle(): Promise<boolean> {
    const title = await this.boundsOf(this.page.getByTestId("guide-header-title"));
    const languageSwitch = await this.boundsOf(this.page.getByTestId("page-language-en").locator(".."));
    const header = await this.boundsOf(this.page.getByTestId("guide-header"));

    return (
      this.shareARow(title, languageSwitch) &&
      languageSwitch.x >= title.x + title.width &&
      Math.abs(languageSwitch.x + languageSwitch.width - (header.x + header.width)) <= 1
    );
  }

  /** Under the title, and as wide as the header. */
  async isPlayButtonFullWidthBelowTheTitle(): Promise<boolean> {
    const title = await this.boundsOf(this.page.getByTestId("guide-header-title"));
    const play = await this.boundsOf(this.page.getByTestId("guide-header-play"));
    const header = await this.boundsOf(this.page.getByTestId("guide-header"));

    return play.y >= title.y + title.height && Math.abs(play.width - header.width) <= 1;
  }

  async isPlayButtonBesideTheLanguageSwitch(): Promise<boolean> {
    const play = await this.boundsOf(this.page.getByTestId("guide-header-play"));
    const languageSwitch = await this.boundsOf(this.page.getByTestId("page-language-en").locator(".."));

    return this.shareARow(play, languageSwitch) && play.x >= languageSwitch.x + languageSwitch.width;
  }

  private shareARow(first: Bounds, second: Bounds): boolean {
    return first.y < second.y + second.height && second.y < first.y + first.height;
  }

  private async boundsOf(locator: Locator): Promise<Bounds> {
    const bounds = (await locator.boundingBox()) ?? undefined;
    if (!bounds) throw new Error("The guide's header is missing something it should show");

    return bounds;
  }

  async isInstallButtonShown(): Promise<boolean> {
    return await this.install.isVisible();
  }

  async isPieceOpen(type: PieceType): Promise<boolean> {
    return ((await this.pieces[type].getAttribute("open")) ?? undefined) !== undefined;
  }

  /** Closed and drawn no taller than its summary, rather than stretched to the height of an open card beside it. */
  async isPieceFolded(type: PieceType): Promise<boolean> {
    const card = await this.pieces[type].boundingBox();
    const summary = await this.pieces[type].locator("summary").boundingBox();
    if (!card || !summary) return false;

    // The card's own border, top and bottom, is all it may add to its summary.
    return !(await this.isPieceOpen(type)) && card.height - summary.height <= 3;
  }

  async getMovementDestinationCount(type: PieceType): Promise<number> {
    return await this.pieces[type].getByTestId("guide-movement-destination").count();
  }

  async getMovementBlockerCount(type: PieceType): Promise<number> {
    return await this.countDrawn(this.pieces[type].getByTestId("guide-movement-blocker"));
  }

  async getCutOffDestinationCount(type: PieceType): Promise<number> {
    return await this.countDrawn(this.pieces[type].getByTestId("guide-movement-cut-off"));
  }

  /**
   * Only those drawn at all: Playwright counts an element at opacity 0 as visible, and the example's pieces and crosses
   * come and go by opacity. The specs run with motion reduced, where each stands still at what the example settles on.
   */
  private async countDrawn(marks: Locator): Promise<number> {
    return await marks.evaluateAll(elements => {
      return elements.filter(element => getComputedStyle(element).opacity !== "0").length;
    });
  }

  async getPieceMark(type: PieceType): Promise<string> {
    const piece = this.pieces[type].getByTestId("guide-movement-piece").getByTestId("piece");
    const character = piece.locator("text");
    if ((await character.count()) > 0) return (await character.textContent()) ?? "";

    if ((await piece.locator("path").count()) > 0) {
      return "drawing";
    }

    return "";
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
