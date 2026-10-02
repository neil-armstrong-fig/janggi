import {DslError} from "@src/dsl/errors/DslError";
import {LegalPlaywright} from "@src/dsl/janggi/components/legal/playwright/LegalPlaywright";
import type {Page} from "@playwright/test";

/** The public privacy policy and terms, whether reached from sign-in or visited directly. */
export class LegalDsl {
  private readonly legal: LegalPlaywright;

  constructor(page: Page) {
    this.legal = new LegalPlaywright(page);
  }

  async visitPrivacyPolicy(): Promise<void> {
    try {
      await this.legal.visitPrivacyPolicy();
    } catch (error) {
      throw new DslError("Failed to visit the privacy policy", error);
    }
  }

  async visitTermsOfService(): Promise<void> {
    try {
      await this.legal.visitTermsOfService();
    } catch (error) {
      throw new DslError("Failed to visit the terms of service", error);
    }
  }

  async isEachPolicyLinkedFromSignIn(): Promise<boolean> {
    try {
      return await this.legal.isEachPolicyLinkedFromSignIn();
    } catch (error) {
      throw new DslError("Failed to check the legal links beside Google sign-in", error);
    }
  }

  async canPoliciesOpenSeparatelyFromTheGame(): Promise<boolean> {
    try {
      return await this.legal.canPoliciesOpenSeparatelyFromTheGame();
    } catch (error) {
      throw new DslError("Failed to check how the legal pages open", error);
    }
  }

  async getPageTitle(): Promise<string> {
    try {
      return await this.legal.getPageTitle();
    } catch (error) {
      throw new DslError("Failed to read the legal page title", error);
    }
  }

  async getCanonicalAddress(): Promise<string> {
    try {
      return await this.legal.getCanonicalAddress();
    } catch (error) {
      throw new DslError("Failed to read the legal page's canonical address", error);
    }
  }

  async getHeadings(): Promise<string[]> {
    try {
      return await this.legal.getHeadings();
    } catch (error) {
      throw new DslError("Failed to read the legal page sections", error);
    }
  }

  async getContent(): Promise<string> {
    try {
      return await this.legal.getContent();
    } catch (error) {
      throw new DslError("Failed to read the legal page", error);
    }
  }

  async isFullyOnScreen(): Promise<boolean> {
    try {
      return await this.legal.isFullyOnScreen();
    } catch (error) {
      throw new DslError("Failed to check that the legal page fits the window", error);
    }
  }

  async canScrollToTheEnd(): Promise<boolean> {
    try {
      return await this.legal.canScrollToTheEnd();
    } catch (error) {
      throw new DslError("Failed to scroll to the end of the legal page", error);
    }
  }
}
