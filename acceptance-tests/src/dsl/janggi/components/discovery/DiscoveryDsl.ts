import {DiscoveryPlaywright} from "@src/dsl/janggi/components/discovery/playwright/DiscoveryPlaywright";
import {DslError} from "@src/dsl/errors/DslError";
import type {LanguageAlternates} from "@src/dsl/janggi/components/discovery/types/LanguageAlternates";
import type {Page} from "@playwright/test";

/**
 * What the game tells search engines, crawlers and link previews about itself, reached as `janggi.discovery`: the page's
 * title, description, addresses and languages, the page as first served before any script runs, its structured data,
 * and the sitemap. Not a part of the screen, so not mirrored in the app's components; named for the specs in
 * `src/tests/discovery/` that ask it.
 */
export class DiscoveryDsl {
  private readonly discovery: DiscoveryPlaywright;

  constructor(page: Page) {
    this.discovery = new DiscoveryPlaywright(page);
  }

  async getPageTitle(): Promise<string> {
    try {
      return await this.discovery.getPageTitle();
    } catch (error) {
      throw new DslError("Failed to read the game's page title", error);
    }
  }

  async getPageDescription(): Promise<string> {
    try {
      return await this.discovery.getPageDescription();
    } catch (error) {
      throw new DslError("Failed to read the game's search description", error);
    }
  }

  async getCanonicalAddress(): Promise<string> {
    try {
      return await this.discovery.getCanonicalAddress();
    } catch (error) {
      throw new DslError("Failed to read the game's canonical address", error);
    }
  }

  async getLanguageAlternates(): Promise<LanguageAlternates> {
    try {
      return await this.discovery.getLanguageAlternates();
    } catch (error) {
      throw new DslError("Failed to read the page's language alternates", error);
    }
  }

  async getSitemapLanguageAlternatesOfTheKoreanGame(): Promise<LanguageAlternates> {
    try {
      return await this.discovery.getSitemapLanguageAlternatesOfTheKoreanGame();
    } catch (error) {
      throw new DslError("Failed to read the sitemap's language alternates for the Korean game", error);
    }
  }

  async getSitemapLanguageAlternatesOfTheKoreanGuide(): Promise<LanguageAlternates> {
    try {
      return await this.discovery.getSitemapLanguageAlternatesOfTheKoreanGuide();
    } catch (error) {
      throw new DslError("Failed to read the sitemap's language alternates for the Korean guide", error);
    }
  }

  async getSitemapLanguageAlternatesOfTheKoreanReferences(): Promise<LanguageAlternates> {
    try {
      return await this.discovery.getSitemapLanguageAlternatesOfTheKoreanReferences();
    } catch (error) {
      throw new DslError("Failed to read the sitemap's language alternates for the Korean references", error);
    }
  }

  async getReferencesAddressInPageServedToSearchEngines(): Promise<string> {
    try {
      return await this.discovery.getReferencesAddressInPageServedToSearchEngines();
    } catch (error) {
      throw new DslError("Failed to read where the references link goes in the page served to search engines", error);
    }
  }

  async getSocialImageAddress(): Promise<string> {
    try {
      return await this.discovery.getSocialImageAddress();
    } catch (error) {
      throw new DslError("Failed to read the game's social card address", error);
    }
  }

  async getGuideAddressInPageServedToSearchEngines(): Promise<string> {
    try {
      return await this.discovery.getGuideAddressInPageServedToSearchEngines();
    } catch (error) {
      throw new DslError("Failed to read where the guide link goes in the page served to search engines", error);
    }
  }

  async getOtherLanguageAddressInPageServedToSearchEngines(): Promise<string> {
    try {
      return await this.discovery.getOtherLanguageAddressInPageServedToSearchEngines();
    } catch (error) {
      throw new DslError(
        "Failed to read where the other-language link goes in the page served to search engines",
        error,
      );
    }
  }

  async getSearchDataLanguage(): Promise<unknown> {
    try {
      return await this.discovery.getSearchDataLanguage();
    } catch (error) {
      throw new DslError("Failed to read the language the game's search data declares", error);
    }
  }

  async getSearchDataName(): Promise<unknown> {
    try {
      return await this.discovery.getSearchDataName();
    } catch (error) {
      throw new DslError("Failed to read the name in the game's search data", error);
    }
  }

  async getMainHeadingServedToSearchEngines(): Promise<string> {
    try {
      return await this.discovery.getMainHeadingServedToSearchEngines();
    } catch (error) {
      throw new DslError("Failed to read the main heading in the page as served, before scripts run", error);
    }
  }

  async getTextServedToSearchEngines(): Promise<string> {
    try {
      return await this.discovery.getTextServedToSearchEngines();
    } catch (error) {
      throw new DslError("Failed to read the text in the page as served, before scripts run", error);
    }
  }

  async isGuideLinkedInPageServedToSearchEngines(): Promise<boolean> {
    try {
      return await this.discovery.isGuideLinkedInPageServedToSearchEngines();
    } catch (error) {
      throw new DslError("Failed to check for the guide link in the page as served, before scripts run", error);
    }
  }

  async isEachPolicyLinkedInPageServedToSearchEngines(): Promise<boolean> {
    try {
      return await this.discovery.isEachPolicyLinkedInPageServedToSearchEngines();
    } catch (error) {
      throw new DslError("Failed to check for the legal links in the page as served, before scripts run", error);
    }
  }

  async isIdentifiedAsAFreeWebGame(): Promise<boolean> {
    try {
      return await this.discovery.isIdentifiedAsAFreeWebGame();
    } catch (error) {
      throw new DslError("Failed to read the game's structured search data", error);
    }
  }

  async isSitemapAdvertisedToCrawlers(): Promise<boolean> {
    try {
      return await this.discovery.isSitemapAdvertisedToCrawlers();
    } catch (error) {
      throw new DslError("Failed to check that robots.txt allows crawlers and names the sitemap", error);
    }
  }

  async isListedInSitemap(): Promise<boolean> {
    try {
      return await this.discovery.isListedInSitemap();
    } catch (error) {
      throw new DslError("Failed to check whether the game and guide are listed in the sitemap", error);
    }
  }

  async isEachPolicyListedInSitemap(): Promise<boolean> {
    try {
      return await this.discovery.isEachPolicyListedInSitemap();
    } catch (error) {
      throw new DslError("Failed to check whether the legal pages are listed in the sitemap", error);
    }
  }

  async isEverySitemapEntryDated(): Promise<boolean> {
    try {
      return await this.discovery.isEverySitemapEntryDated();
    } catch (error) {
      throw new DslError("Failed to check whether each sitemap entry says when it last changed", error);
    }
  }
}
