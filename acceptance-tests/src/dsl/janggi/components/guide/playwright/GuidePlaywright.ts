import type {Bounds} from "@src/dsl/janggi/components/guide/playwright/types/Bounds";
import {BasePage} from "@src/dsl/playwright/BasePage";
import {ISOLATION_TIMEOUT_MS} from "@src/dsl/playwright/IsolationTimeout";
import type {Locator, Page} from "@playwright/test";
import type {GuidePieceStyleName} from "@src/dsl/janggi/components/guide/types/GuidePieceStyleName";
import type {PieceType} from "@janggi/shared/janggi/pieces/PieceType";
import {TUTORIAL_OFFERS} from "@janggi/shared/janggi/tutorial/TutorialOffer";
import type {TutorialOffer} from "@janggi/shared/janggi/tutorial/TutorialOffer";

export class GuidePlaywright extends BasePage {
  private readonly install: Locator;
  private readonly translationNotice: Locator;
  private readonly englishGuide: Locator;
  private readonly play: Locator;
  private readonly tutorialLink: Locator;
  private readonly pieces: Record<PieceType, Locator>;
  private readonly pieceStyles: Record<GuidePieceStyleName, Locator>;
  private readonly guide: Locator;
  private readonly readyMarker: Locator;
  private readonly guideReferences: Locator;
  private readonly canonical: Locator;
  private readonly heading: Locator;
  private readonly sectionHeadings: Locator;
  private readonly guideHeaderTitle: Locator;
  private readonly languageSwitch: Locator;
  private readonly guideHeader: Locator;
  private readonly guideHeaderPlay: Locator;
  private readonly guideRulesSource: Locator;
  private readonly guideFairyStockfishSource: Locator;
  private readonly readyGuide: Locator;

  constructor(page: Page) {
    super(page);

    this.install = page.getByTestId("guide-install");
    this.translationNotice = page.getByTestId("translation-notice");
    this.englishGuide = page.getByTestId("translation-notice-original");
    this.play = page.getByTestId("guide-play");
    this.tutorialLink = page.getByTestId("guide-tutorial");
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

    this.guide = this.page.getByTestId("guide");
    this.readyMarker = this.page.locator("[data-guide-ready='true']");
    this.guideReferences = this.page.getByTestId("guide-references");
    this.canonical = this.page.locator("link[rel='canonical']");
    this.heading = this.page.getByTestId("guide").locator("h1");
    this.sectionHeadings = this.page.getByTestId("guide-section").locator("h2");

    this.guideHeaderTitle = this.page.getByTestId("guide-header-title");
    this.languageSwitch = this.page.getByTestId("page-language-en").locator("..");
    this.guideHeader = this.page.getByTestId("guide-header");
    this.guideHeaderPlay = this.page.getByTestId("guide-header-play");
    this.guideRulesSource = this.page.getByTestId("guide-rules-source");
    this.guideFairyStockfishSource = this.page.getByTestId("guide-fairy-stockfish-source");

    this.readyGuide = this.guide.and(this.readyMarker);
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
    await this.readyGuide.waitFor({state: "visible"});
  }

  /** Follows the guide's link to the tutorial, and waits for the game as `JanggiPlaywright.open` does. */
  async playTheTutorial(): Promise<void> {
    await this.tutorialLink.click();
    await this.page.waitForURL(url => !url.pathname.endsWith("learn.html"));
    await this.page.waitForFunction(() => globalThis.crossOriginIsolated, undefined, {timeout: ISOLATION_TIMEOUT_MS});
  }

  /** What the guide's link to the tutorial offers, read off its `data-offer`. */
  async getTutorialOffer(): Promise<TutorialOffer> {
    await this.tutorialLink.waitFor({state: "visible"});
    const offer = await this.tutorialLink.getAttribute("data-offer");

    const found = TUTORIAL_OFFERS.find(candidate => candidate === offer);
    if (found === undefined) throw new Error(`The guide's link to the tutorial offers "${String(offer)}"`);

    return found;
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
    return (await this.guideReferences.getAttribute("href")) ?? "";
  }

  /** Where the link into the game goes, as written in the page. */
  async getPlayLinkAddress(): Promise<string> {
    return (await this.play.getAttribute("href")) ?? "";
  }

  async getPieceName(type: PieceType): Promise<string> {
    return ((await this.guidePieceNameAt(type).textContent()) ?? "").trim();
  }

  private guidePieceNameAt(type: PieceType): Locator {
    return this.pieces[type].getByTestId("guide-piece-name");
  }

  async chooseInstall(): Promise<void> {
    await this.install.click();
  }

  async openPiece(type: PieceType): Promise<void> {
    await this.summaryAt(type).click();
  }

  async closePiece(type: PieceType): Promise<void> {
    await this.summaryAt(type).click();
  }

  async setPieceStyleTo(name: GuidePieceStyleName): Promise<void> {
    await this.pieceStyles[name].click();
  }

  async getPageTitle(): Promise<string> {
    return await this.page.title();
  }

  async getCanonicalAddress(): Promise<string> {
    return (await this.canonical.getAttribute("href")) ?? "";
  }

  async getMainHeading(): Promise<string> {
    return await this.heading.innerText();
  }

  async getSectionHeadings(): Promise<string[]> {
    return await this.sectionHeadings.allTextContents();
  }

  async getContent(): Promise<string> {
    return (await this.guide.textContent()) ?? "";
  }

  async isPlayLinkForTheGame(): Promise<boolean> {
    const href = (await this.play.getAttribute("href")) ?? undefined;

    return href !== undefined && new URL(href, this.page.url()).href === new URL("./", this.page.url()).href;
  }

  /** On the title's row, and reaching the header's right edge. */
  async isLanguageSwitchBesideTheTitle(): Promise<boolean> {
    const title = await this.boundsOf(this.guideHeaderTitle);
    const languageSwitch = await this.boundsOf(this.languageSwitch);
    const header = await this.boundsOf(this.guideHeader);

    return (
      this.shareARow(title, languageSwitch) &&
      languageSwitch.x >= title.x + title.width &&
      Math.abs(languageSwitch.x + languageSwitch.width - (header.x + header.width)) <= 1
    );
  }

  /** Under the title, and as wide as the header. */
  async isPlayButtonFullWidthBelowTheTitle(): Promise<boolean> {
    const title = await this.boundsOf(this.guideHeaderTitle);
    const play = await this.boundsOf(this.guideHeaderPlay);
    const header = await this.boundsOf(this.guideHeader);

    return play.y >= title.y + title.height && Math.abs(play.width - header.width) <= 1;
  }

  async isPlayButtonBesideTheLanguageSwitch(): Promise<boolean> {
    const play = await this.boundsOf(this.guideHeaderPlay);
    const languageSwitch = await this.boundsOf(this.languageSwitch);

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
    const summary = await this.summaryAt(type).boundingBox();
    if (!card || !summary) return false;

    // The card's own border, top and bottom, is all it may add to its summary.
    return !(await this.isPieceOpen(type)) && card.height - summary.height <= 3;
  }

  private summaryAt(type: PieceType): Locator {
    return this.pieces[type].locator("summary");
  }

  async getMovementDestinationCount(type: PieceType): Promise<number> {
    return await this.guideMovementDestinationAt(type).count();
  }

  private guideMovementDestinationAt(type: PieceType): Locator {
    return this.pieces[type].getByTestId("guide-movement-destination");
  }

  async getMovementBlockerCount(type: PieceType): Promise<number> {
    return await this.countDrawn(this.guideMovementBlockerAt(type));
  }

  private guideMovementBlockerAt(type: PieceType): Locator {
    return this.pieces[type].getByTestId("guide-movement-blocker");
  }

  async getCutOffDestinationCount(type: PieceType): Promise<number> {
    return await this.countDrawn(this.guideMovementCutOffAt(type));
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

  private guideMovementCutOffAt(type: PieceType): Locator {
    return this.pieces[type].getByTestId("guide-movement-cut-off");
  }

  async getPieceMark(type: PieceType): Promise<string> {
    const piece = this.guideMovementPieceAt(type).getByTestId("piece");
    const character = piece.locator("text");
    if ((await character.count()) > 0) return (await character.textContent()) ?? "";

    if ((await piece.locator("path").count()) > 0) {
      return "drawing";
    }

    return "";
  }

  private guideMovementPieceAt(type: PieceType): Locator {
    return this.pieces[type].getByTestId("guide-movement-piece");
  }

  async areGuideSourcesLinked(): Promise<boolean> {
    const rules = await this.guideRulesSource.getAttribute("href");
    const opponent = await this.guideFairyStockfishSource.getAttribute("href");

    return (
      rules === "https://github.com/neil-armstrong-fig/janggi/blob/main/docs/rules.md" &&
      opponent === "https://github.com/fairy-stockfish/Fairy-Stockfish"
    );
  }
}
