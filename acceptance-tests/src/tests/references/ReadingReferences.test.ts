import {beforeEach, expect, given, then, when} from "@src/acceptance-criteria-mapping/AcceptanceCriteriaMapping";

given("a player has moved a soldier", () => {
  beforeEach(async ({janggi}) => {
    await janggi.board.tap(1, 7);
    await janggi.board.tap(1, 6);
  });

  when("they open References & credits from Settings", () => {
    beforeEach(async ({janggi}) => {
      await janggi.references.openReferences();
    });

    then("the reading page opens separately and the game keeps its position", async ({janggi}) => {
      expect(await janggi.references.isSeparateFromGame()).toBe(true);
      expect(await janggi.board.getPieceAt(1, 6)).toEqual({side: "cho", type: "soldier"});
      expect(await janggi.board.getPieceAt(1, 7)).toBeUndefined();
    });

    then("the sources and software have their own readable sections", async ({janggi}) => {
      expect(await janggi.references.headings()).toEqual([
        "Rules & match formats",
        "Opening arrangements & variants",
        "The computer opponent",
        "Open source software & tools",
      ]);
      expect(await janggi.references.fitsWindow()).toBe(true);
    });

    then("the app, rule sources and engine link back to their creators", async ({janggi}) => {
      expect(await janggi.references.destinationOf("references-repository")).toBe(
        "https://github.com/neil-armstrong-fig/janggi",
      );
      expect(await janggi.references.destinationOf("reference-kja")).toBe(
        "http://www.kja.or.kr/business/business5.php",
      );
      expect(await janggi.references.destinationOf("reference-openings-research")).toBe(
        "https://github.com/neil-armstrong-fig/janggi/blob/main/docs/opening-setups.md",
      );
      expect(await janggi.references.destinationOf("reference-fairy-wasm")).toBe(
        "https://github.com/fairy-stockfish/fairy-stockfish.wasm",
      );
      expect(await janggi.references.destinationOf("reference-engine-licence")).toMatch(/\/engine\/Copying\.txt$/);
      expect(await janggi.references.destinationOf("reference-engine-authors")).toMatch(/\/engine\/AUTHORS$/);
    });

    then("the credits explain contributions and identify the software licences", async ({janggi}) => {
      const content = await janggi.references.content();
      expect(content).toContain("Casual");
      expect(content).toContain("Scored");
      expect(content).toContain("장하영");
      expect(content).toContain("React");
      expect(content).toContain("Playwright");
      expect(content).toContain("GPL-3.0");
      expect(content).toContain("MIT");
      expect(content).toContain("checks every move");
    });

    when("they use the keyboard to follow the tools section link", () => {
      beforeEach(async ({janggi}) => {
        await janggi.references.followToolsWithKeyboard();
      });

      then("the tools heading scrolls into view", async ({janggi}) => {
        expect(await janggi.references.isToolsHeadingOnScreen()).toBe(true);
      });
    });
  });
});

given("someone visits the references address directly", () => {
  beforeEach(async ({janggi}) => {
    await janggi.references.visitReferences();
  });

  when("they refresh the reading page", () => {
    beforeEach(async ({janggi}) => {
      await janggi.references.reload();
    });

    then("the references remain readable", async ({janggi}) => {
      expect(await janggi.references.content()).toContain("References & credits");
      expect(await janggi.references.destinationOf("references-repository")).toBe(
        "https://github.com/neil-armstrong-fig/janggi",
      );
    });
  });
});
