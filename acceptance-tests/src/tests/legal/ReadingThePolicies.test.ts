import {beforeEach, expect, given, then, when} from "@src/acceptance-criteria-mapping/AcceptanceCriteriaMapping";

given("a player deciding whether to sign in with Google", () => {
  when("they read the account section in Settings", () => {
    then("the privacy policy and terms are linked beside sign-in", async ({janggi}) => {
      expect(await janggi.legal.isEachPolicyLinkedFromSignIn()).toBe(true);
      expect(await janggi.legal.canPoliciesOpenSeparatelyFromTheGame()).toBe(true);
    });

    then("search engines can discover both policies from the homepage and sitemap", async ({janggi}) => {
      expect(await janggi.isEachPolicyLinkedInPageServedToSearchEngines()).toBe(true);
      expect(await janggi.isEachPolicyListedInSitemap()).toBe(true);
    });
  });
});

given("someone visits the privacy policy", () => {
  beforeEach(async ({janggi}) => {
    await janggi.legal.visitPrivacyPolicy();
  });

  when("they read how Janggi handles their data", () => {
    then("the page identifies itself at its permanent public address", async ({janggi}) => {
      expect(await janggi.legal.getPageTitle()).toBe("Privacy Policy — Janggi");
      expect(await janggi.legal.getCanonicalAddress()).toBe("https://janggi.neilarmstrong.dev/privacy.html");
      expect(await janggi.legal.isFullyOnScreen()).toBe(true);
    });

    then("a reader can scroll down to the end of it", async ({janggi}) => {
      expect(await janggi.legal.canScrollToTheEnd()).toBe(true);
    });

    then("it explains Google sign-in, storage, deletion, providers and privacy rights", async ({janggi}) => {
      const headings = await janggi.legal.getHeadings();
      const content = await janggi.legal.getContent();

      expect(headings).toEqual([
        "What Janggi collects",
        "How Janggi uses information",
        "Cookies and local storage",
        "Who handles information",
        "How long information is kept",
        "Your choices and rights",
        "Children",
        "Changes to this policy",
        "Contact",
      ]);
      expect(content).toContain("stable Google account identifier");
      expect(content).toContain("never receives your Google email address, real name, profile or contacts");
      expect(content).toContain("Cloudflare");
      expect(content).toContain("GitHub Pages");
      expect(content).toContain("Delete my account");
      expect(content).toContain("Information Commissioner’s Office");
      expect(content).toContain("janggi@neilarmstrong.dev");
    });
  });
});

given("someone visits the terms of service", () => {
  beforeEach(async ({janggi}) => {
    await janggi.legal.visitTermsOfService();
  });

  when("they read the conditions for using Janggi", () => {
    then("the page identifies itself at its permanent public address", async ({janggi}) => {
      expect(await janggi.legal.getPageTitle()).toBe("Terms of Service — Janggi");
      expect(await janggi.legal.getCanonicalAddress()).toBe("https://janggi.neilarmstrong.dev/terms.html");
      expect(await janggi.legal.isFullyOnScreen()).toBe(true);
    });

    then("a reader can scroll down to the end of it", async ({janggi}) => {
      expect(await janggi.legal.canScrollToTheEnd()).toBe(true);
    });

    then("it explains accounts, acceptable use, availability and the governing law", async ({janggi}) => {
      const headings = await janggi.legal.getHeadings();
      const content = await janggi.legal.getContent();

      expect(headings).toEqual([
        "Using Janggi",
        "Accounts and sync",
        "Acceptable use",
        "Your content",
        "Intellectual property",
        "Availability",
        "Disclaimers and liability",
        "Ending use",
        "Changes to these terms",
        "Governing law",
        "Contact",
      ]);
      expect(content).toContain("Northern Ireland");
      expect(content).toContain("mandatory consumer rights");
      expect(content).toContain("Delete my account");
      expect(content).toContain("janggi@neilarmstrong.dev");
    });
  });
});
