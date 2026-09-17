import {beforeEach, expect, given, then, when} from "@src/acceptance-criteria-mapping/AcceptanceCriteriaMapping";

given("someone searches for a way to play janggi", () => {
  when("they open the game", () => {
    then("the page describes a free Janggi game against AI", async ({janggi}) => {
      expect(await janggi.getPageTitle()).toBe("Play Janggi (Korean Chess) Online — Free vs AI");
      expect(await janggi.getPageDescription()).toBe(
        "Play Janggi (Korean chess) for free against a friend or eight AI levels. No account needed; save it to your device and play offline.",
      );
      expect(await janggi.getMainHeading()).toBe("Janggi — Korean Chess");
    });

    then("search engines are given one address and understand that the web game is free", async ({janggi}) => {
      expect(await janggi.getCanonicalAddress()).toBe("https://neil-armstrong-fig.github.io/janggi/");
      expect(await janggi.isIdentifiedAsAFreeWebGame()).toBe(true);
    });

    then("the game and guide are listed for search engines to discover", async ({janggi}) => {
      expect(await janggi.isListedInSitemap()).toBe(true);
    });

    then("the in-depth Janggi guide is linked from the game", async ({janggi}) => {
      expect(await janggi.settings.isGuideLinkedFromGame()).toBe(true);
    });
  });

  when("they visit the guide", () => {
    beforeEach(async ({janggi}) => {
      await janggi.guide.visitGuide();
    });

    then("it gives janggi a descriptive search result of its own", async ({janggi}) => {
      expect(await janggi.guide.getPageTitle()).toBe("How to Play Janggi (Korean Chess) — Rules & Free Game");
      expect(await janggi.guide.getCanonicalAddress()).toBe("https://neil-armstrong-fig.github.io/janggi/learn.html");
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
