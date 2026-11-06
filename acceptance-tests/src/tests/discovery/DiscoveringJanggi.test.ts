import {beforeEach, expect, given, then, when} from "@src/acceptance-criteria-mapping/AcceptanceCriteriaMapping";

given("someone searches for a way to play janggi", () => {
  when("they open the game", () => {
    then(
      "the page describes a free Janggi game to play online with a friend or against AI, and offline",
      async ({janggi}) => {
        expect(await janggi.discovery.getPageTitle()).toBe("Play Janggi (Korean Chess) Online with Friends or vs AI");
        expect(await janggi.discovery.getPageDescription()).toBe(
          "Play Janggi (Korean chess) online with a friend using a private code, or against eight AI levels. Install it and play offline. Free, and no account needed to play the AI.",
        );
        expect(await janggi.getMainHeading()).toBe("Janggi: Korean Chess");
      },
    );

    then("search engines are given one address and understand that the web game is free", async ({janggi}) => {
      expect(await janggi.discovery.getCanonicalAddress()).toBe("https://janggi.neilarmstrong.dev/");
      expect(await janggi.discovery.isIdentifiedAsAFreeWebGame()).toBe(true);
    });

    then("the game and guide are listed for search engines to discover", async ({janggi}) => {
      expect(await janggi.discovery.isListedInSitemap()).toBe(true);
    });

    then("the sitemap says when each page last changed, so a crawler knows what to revisit", async ({janggi}) => {
      expect(await janggi.discovery.isEverySitemapEntryDated()).toBe(true);
    });

    then("crawlers are allowed in and told where the sitemap is", async ({janggi}) => {
      expect(await janggi.discovery.isSitemapAdvertisedToCrawlers()).toBe(true);
    });

    then("search engines that don't run scripts still read what the game is and find the guide", async ({janggi}) => {
      expect(await janggi.discovery.getMainHeadingServedToSearchEngines()).toBe("Janggi: Korean Chess");
      expect(await janggi.discovery.getTextServedToSearchEngines()).toContain("private code");
      expect(await janggi.discovery.isGuideLinkedInPageServedToSearchEngines()).toBe(true);
    });

    then("the in-depth Janggi guide is linked from the game", async ({janggi}) => {
      expect(await janggi.settings.you.isGuideLinkedFromGame()).toBe(true);
    });

    then("the developer and the source are linked from App & help", async ({janggi}) => {
      expect(await janggi.settings.you.getDeveloperWebsiteDestination()).toBe("https://neilarmstrong.dev");
      expect(await janggi.settings.you.getRepositoryDestination()).toBe("https://github.com/neil-armstrong-fig/janggi");
      expect(await janggi.settings.you.doExternalAppHelpLinksOpenSeparately()).toBe(true);
    });
  });

  when("they visit the guide", () => {
    beforeEach(async ({janggi}) => {
      await janggi.guide.visitGuide();
    });

    then("it gives janggi a descriptive search result of its own", async ({janggi}) => {
      expect(await janggi.guide.getPageTitle()).toBe("Korean Chess (Janggi): How to Play, Rules & Free Game");
      expect(await janggi.guide.getCanonicalAddress()).toBe("https://janggi.neilarmstrong.dev/learn.html");
      expect(await janggi.guide.getMainHeading()).toBe("How to play Janggi (Korean chess)");
    });

    then("it explains the game from the objective through its distinctive rules", async ({janggi}) => {
      expect(await janggi.guide.getSectionHeadings()).toEqual([
        "What is Janggi?",
        "How to win",
        "How the pieces move",
        "Rules unique to Janggi",
        "Casual and scored Janggi",
        "Janggi questions",
      ]);

      const content = await janggi.guide.getContent();
      expect(content).toContain("장기");
      expect(content).toContain("9 × 10");
      expect(content).toContain("bikjang");
      expect(content).toContain("Repeating a position");
      expect(content).toContain("Fairy-Stockfish");
      expect(content).not.toContain("No download");
      expect(content).not.toContain("Install it as a web app");
    });

    then("it leads straight back to the playable game", async ({janggi}) => {
      expect(await janggi.guide.isPlayLinkForTheGame()).toBe(true);
    });

    then("it links the rules research and Fairy-Stockfish project it relies on", async ({janggi}) => {
      expect(await janggi.guide.areGuideSourcesLinked()).toBe(true);
    });
  });

  when("they open a piece's movement example", () => {
    beforeEach(async ({janggi}) => {
      await janggi.guide.visitGuide();
      await janggi.guide.openPiece("horse");
    });

    then("a small board shows each place the piece can move", async ({janggi}) => {
      expect(await janggi.guide.isPieceOpen("horse")).toBe(true);
      expect(await janggi.guide.getMovementDestinationCount("horse")).toBe(8);
      expect(await janggi.guide.getPieceMark("horse")).toBe("馬");
    });

    then("it shows pieces in the horse's way, each cutting off the two moves behind it", async ({janggi}) => {
      expect(await janggi.guide.getMovementBlockerCount("horse")).toBe(2);
      expect(await janggi.guide.getCutOffDestinationCount("horse")).toBe(4);
    });

    when("they choose the Hangul pieces", () => {
      beforeEach(async ({janggi}) => {
        await janggi.guide.setPieceStyleTo("Hangul");
      });

      then("the example uses the same Hangul piece as the game", async ({janggi}) => {
        expect(await janggi.guide.getPieceMark("horse")).toBe("마");
      });
    });

    when("they choose the modern pieces", () => {
      beforeEach(async ({janggi}) => {
        await janggi.guide.setPieceStyleTo("Modern");
      });

      then("the example uses the same picture piece as the game", async ({janggi}) => {
        expect(await janggi.guide.getPieceMark("horse")).toBe("drawing");
      });
    });
  });

  when("they open the elephant's movement example", () => {
    beforeEach(async ({janggi}) => {
      await janggi.guide.visitGuide();
      await janggi.guide.openPiece("elephant");
    });

    then("it shows that a piece on either point of its route stops it", async ({janggi}) => {
      expect(await janggi.guide.getMovementBlockerCount("elephant")).toBe(2);
      expect(await janggi.guide.getCutOffDestinationCount("elephant")).toBe(3);
    });
  });

  when("they open two pieces side by side on a wide screen, then close one", () => {
    beforeEach(async ({janggi}) => {
      await janggi.resizeWindowTo(1280, 900);
      await janggi.guide.visitGuide();
      await janggi.guide.openPiece("horse");
      await janggi.guide.openPiece("elephant");
      await janggi.guide.closePiece("horse");
    });

    then("the closed one folds back to its summary while the other stays open", async ({janggi}) => {
      expect(await janggi.guide.isPieceFolded("horse")).toBe(true);
      expect(await janggi.guide.isPieceOpen("elephant")).toBe(true);
    });
  });

  when("they open the guide on a phone that can save the game", () => {
    beforeEach(async ({janggi}) => {
      await janggi.resizeWindowTo(390, 844);
      await janggi.guide.visitGuide();
      await janggi.offerInstallation();
    });

    then("the guide offers to save Janggi to the device", async ({janggi}) => {
      expect(await janggi.guide.isInstallButtonShown()).toBe(true);
    });

    when("they choose to save it", () => {
      beforeEach(async ({janggi}) => {
        await janggi.guide.chooseInstall();
      });

      then("the browser's save process starts", async ({janggi}) => {
        expect(await janggi.wasInstallationPrompted()).toBe(true);
      });
    });
  });

  when("they open the guide on a wider screen", () => {
    beforeEach(async ({janggi}) => {
      await janggi.resizeWindowTo(1024, 900);
      await janggi.guide.visitGuide();
      await janggi.offerInstallation();
    });

    then("the phone save action stays out of the way", async ({janggi}) => {
      expect(await janggi.guide.isInstallButtonShown()).toBe(false);
    });
  });
});
