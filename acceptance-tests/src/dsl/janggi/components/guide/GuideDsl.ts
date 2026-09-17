import {DslError} from "@src/dsl/errors/DslError";
import {GuidePlaywright} from "@src/dsl/janggi/components/guide/playwright/GuidePlaywright";
import type {GuidePieceStyleName} from "@src/dsl/janggi/components/guide/types/GuidePieceStyleName";
import type {Page} from "@playwright/test";
import type {PieceType} from "@janggi/shared/janggi/pieces/PieceType";

export class GuideDsl {
  private readonly guide: GuidePlaywright;

  constructor(page: Page) {
    this.guide = new GuidePlaywright(page);
  }

  async visitGuide(): Promise<void> {
    try {
      await this.guide.visitGuide();
    } catch (error) {
      throw new DslError("Failed to visit the Janggi guide", error);
    }
  }

  async offerInstallation(): Promise<void> {
    try {
      await this.guide.offerInstallation();
    } catch (error) {
      throw new DslError("Failed to make installation available from the browser", error);
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

  async isInstallButtonShown(): Promise<boolean> {
    try {
      return await this.guide.isInstallButtonShown();
    } catch (error) {
      throw new DslError("Failed to check whether saving Janggi is offered", error);
    }
  }

  async wasInstallationPrompted(): Promise<boolean> {
    try {
      return await this.guide.wasInstallationPrompted();
    } catch (error) {
      throw new DslError("Failed to check whether the browser offered to save Janggi", error);
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
