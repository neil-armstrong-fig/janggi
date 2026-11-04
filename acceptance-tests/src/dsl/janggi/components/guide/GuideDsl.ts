import {DslError} from "@src/dsl/errors/DslError";
import {GuidePlaywright} from "@src/dsl/janggi/components/guide/playwright/GuidePlaywright";
import type {GuidePieceStyleName} from "@src/dsl/janggi/components/guide/types/GuidePieceStyleName";
import {LanguageSwitchDsl} from "@src/dsl/janggi/components/language-switch/LanguageSwitchDsl";
import type {Page} from "@playwright/test";
import type {PieceType} from "@janggi/shared/janggi/pieces/PieceType";

export class GuideDsl {
  private readonly guide: GuidePlaywright;

  readonly languageSwitch: LanguageSwitchDsl;

  constructor(page: Page) {
    this.guide = new GuidePlaywright(page);

    this.languageSwitch = new LanguageSwitchDsl(page);
  }

  async visitGuide(): Promise<void> {
    try {
      await this.guide.visitGuide();
    } catch (error) {
      throw new DslError("Failed to visit the Janggi guide", error);
    }
  }

  async visitKoreanGuide(): Promise<void> {
    try {
      await this.guide.visitKoreanGuide();
    } catch (error) {
      throw new DslError("Failed to visit the Janggi guide's Korean page", error);
    }
  }

  async getTranslationNotice(): Promise<string> {
    try {
      return await this.guide.getTranslationNotice();
    } catch (error) {
      throw new DslError("Failed to read the guide's machine translation notice", error);
    }
  }

  async getEnglishGuideAddress(): Promise<string> {
    try {
      return await this.guide.getEnglishGuideAddress();
    } catch (error) {
      throw new DslError("Failed to read where the notice's link to the English guide goes", error);
    }
  }

  async getReferencesAddress(): Promise<string> {
    try {
      return await this.guide.getReferencesAddress();
    } catch (error) {
      throw new DslError("Failed to read where the guide's link to the references goes", error);
    }
  }

  async getPlayLinkAddress(): Promise<string> {
    try {
      return await this.guide.getPlayLinkAddress();
    } catch (error) {
      throw new DslError("Failed to read where the guide's link into the game goes", error);
    }
  }

  async getPieceName(type: PieceType): Promise<string> {
    try {
      return await this.guide.getPieceName(type);
    } catch (error) {
      throw new DslError(`Failed to read the name the guide gives the ${type}`, error);
    }
  }

  async chooseInstall(): Promise<void> {
    try {
      await this.guide.chooseInstall();
    } catch (error) {
      throw new DslError("Failed to choose to save Janggi to this device", error);
    }
  }

  async openPiece(type: PieceType): Promise<void> {
    try {
      await this.guide.openPiece(type);
    } catch (error) {
      throw new DslError(`Failed to open the ${type} movement example`, error);
    }
  }

  async setPieceStyleTo(name: GuidePieceStyleName): Promise<void> {
    try {
      await this.guide.setPieceStyleTo(name);
    } catch (error) {
      throw new DslError(`Failed to set the guide's pieces to "${name}"`, error);
    }
  }

  async getPageTitle(): Promise<string> {
    try {
      return await this.guide.getPageTitle();
    } catch (error) {
      throw new DslError("Failed to read the Janggi guide's page title", error);
    }
  }

  async getCanonicalAddress(): Promise<string> {
    try {
      return await this.guide.getCanonicalAddress();
    } catch (error) {
      throw new DslError("Failed to read the Janggi guide's canonical address", error);
    }
  }

  async getMainHeading(): Promise<string> {
    try {
      return await this.guide.getMainHeading();
    } catch (error) {
      throw new DslError("Failed to read the Janggi guide's main heading", error);
    }
  }

  async getSectionHeadings(): Promise<string[]> {
    try {
      return await this.guide.getSectionHeadings();
    } catch (error) {
      throw new DslError("Failed to read the sections in the Janggi guide", error);
    }
  }

  async getContent(): Promise<string> {
    try {
      return await this.guide.getContent();
    } catch (error) {
      throw new DslError("Failed to read the Janggi guide", error);
    }
  }

  async isPlayLinkForTheGame(): Promise<boolean> {
    try {
      return await this.guide.isPlayLinkForTheGame();
    } catch (error) {
      throw new DslError("Failed to check where the Janggi guide's play link leads", error);
    }
  }

  async isLanguageSwitchBesideTheTitle(): Promise<boolean> {
    try {
      return await this.guide.isLanguageSwitchBesideTheTitle();
    } catch (error) {
      throw new DslError("Failed to check that the guide's language switch sits beside its title", error);
    }
  }

  async isPlayButtonFullWidthBelowTheTitle(): Promise<boolean> {
    try {
      return await this.guide.isPlayButtonFullWidthBelowTheTitle();
    } catch (error) {
      throw new DslError("Failed to check that the guide's header play button spans the row below its title", error);
    }
  }

  async isPlayButtonBesideTheLanguageSwitch(): Promise<boolean> {
    try {
      return await this.guide.isPlayButtonBesideTheLanguageSwitch();
    } catch (error) {
      throw new DslError("Failed to check that the guide's header play button sits beside its language switch", error);
    }
  }

  async isInstallButtonShown(): Promise<boolean> {
    try {
      return await this.guide.isInstallButtonShown();
    } catch (error) {
      throw new DslError("Failed to check whether saving Janggi is offered", error);
    }
  }

  async isPieceOpen(type: PieceType): Promise<boolean> {
    try {
      return await this.guide.isPieceOpen(type);
    } catch (error) {
      throw new DslError(`Failed to check whether the ${type} movement example is open`, error);
    }
  }

  async getMovementDestinationCount(type: PieceType): Promise<number> {
    try {
      return await this.guide.getMovementDestinationCount(type);
    } catch (error) {
      throw new DslError(`Failed to count the ${type}'s shown destinations`, error);
    }
  }

  async getPieceMark(type: PieceType): Promise<string> {
    try {
      return await this.guide.getPieceMark(type);
    } catch (error) {
      throw new DslError(`Failed to read the ${type}'s mark`, error);
    }
  }

  async areGuideSourcesLinked(): Promise<boolean> {
    try {
      return await this.guide.areGuideSourcesLinked();
    } catch (error) {
      throw new DslError("Failed to check the guide's rule and computer-opponent sources", error);
    }
  }
}
