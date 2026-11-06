import type {ReferenceSection} from "@src/react/pages/references/types/ReferenceSection";
import type {ReferencesMessages} from "@src/language/references/references-messages/ReferencesMessages";

/**
 * Reader-facing acknowledgements. The evidence and its limitations live in docs/rules.md,
 * docs/opening-setups.md and docs/bot.md; these summaries point back to that research.
 * Software licences are read from the installed packages, with sibling packages credited together.
 *
 * What other people wrote keeps the name they gave it, here in every language; what they are thanked for, and the
 * labels this project wrote, come from `words`.
 */
export function referenceSectionsOf(words: ReferencesMessages): readonly ReferenceSection[] {
  return [
    {
      id: "rules",
      title: words.sections.rules.title,
      introduction: words.sections.rules.introduction,
      references: [
        {
          id: "kja",
          name: "대한장기협회 · Korea Janggi Association",
          url: "http://www.kja.or.kr/business/business5.php",
          description: words.descriptions.kja,
          related: [
            {
              id: "kja-movement",
              name: words.linkNames.kjaMovement,
              url: "https://web.archive.org/web/2013/http://kja.or.kr/janggi_intro/c.php",
            },
            {
              id: "kja-regulations",
              name: words.linkNames.kjaRegulations,
              url: "https://web.archive.org/web/20131005190526/http://kja.or.kr/janggi_intro/f.php",
            },
            {
              id: "kja-rules",
              name: words.linkNames.kjaRules,
              url: "https://web.archive.org/web/20111124010550/http://www.kja.or.kr:80/janggi_intro/e.php",
            },
          ],
        },
        {
          id: "kojf",
          name: "대한장기연맹 · Korean Janggi Federation",
          url: "https://kojf.net/bbs/board.php?bo_table=board_notice&wr_id=478",
          description: words.descriptions.kojf,
          related: [
            {
              id: "kojf-passing",
              name: words.linkNames.kojfPassing,
              url: "http://kojf.net/bbs/board.php?bo_table=board_notice&wr_id=706",
            },
          ],
        },
        {
          id: "wikipedia",
          name: "Wikipedia contributors · Janggi / 장기",
          url: "https://en.wikipedia.org/wiki/Janggi",
          description: words.descriptions.wikipedia,
          related: [
            {id: "wikipedia-korean", name: words.linkNames.wikipediaKorean, url: "https://ko.wikipedia.org/wiki/장기"},
          ],
        },
        {
          id: "pychess",
          name: "PyChess Variants contributors",
          url: "https://www.pychess.org/variants/janggi",
          description: words.descriptions.pychess,
          related: [
            {
              id: "pychess-source",
              name: words.linkNames.pychessSource,
              url: "https://github.com/gbtami/pychess-variants/blob/master/static/docs/janggi.md",
            },
            {
              id: "pychess-setups",
              name: words.linkNames.pychessSetups,
              url: "https://github.com/gbtami/pychess-variants/blob/master/client/roundCtrl.ts",
            },
          ],
        },
        {
          id: "rules-research",
          name: words.linkNames.rulesResearch,
          url: "https://github.com/neil-armstrong-fig/janggi/blob/main/docs/rules.md",
          description: words.descriptions.rulesResearch,
        },
      ],
    },
    {
      id: "openings",
      title: words.sections.openings.title,
      introduction: words.sections.openings.introduction,
      references: [
        {
          id: "jang-hayoung",
          name: "장하영 · Jang Ha-young, writing in 서산시대",
          url: "http://www.sstimes.kr/news/articleView.html?idxno=21698",
          description: words.descriptions.jangHayoung,
          related: [
            {
              id: "jang-formations",
              name: words.linkNames.jangFormations,
              url: "http://www.sstimes.kr/news/articleView.html?idxno=24456",
            },
            {
              id: "jang-response",
              name: words.linkNames.jangResponse,
              url: "http://www.sstimes.kr/news/articleView.html?idxno=21988",
            },
            {
              id: "jang-horses-elephants",
              name: words.linkNames.jangHorsesElephants,
              url: "https://www.sstimes.kr/news/articleView.html?idxno=24375",
            },
          ],
        },
        {
          id: "elephant-wikipedia",
          name: "Korean Wikipedia & Wikimedia Commons contributors",
          url: "https://ko.wikipedia.org/wiki/상_(장기)",
          description: words.descriptions.elephantWikipedia,
          related: [
            {
              id: "yang-sang",
              name: words.linkNames.yangSang,
              url: "https://commons.wikimedia.org/wiki/File:Yang_sang.png",
            },
            {
              id: "setup-template",
              name: words.linkNames.setupTemplate,
              url: "https://en.wikipedia.org/wiki/Template:Janggi_setup",
            },
          ],
        },
        {
          id: "hangame",
          name: words.linkNames.hangame,
          url: "https://janggi.hangame.com/tip.nhn?id=1",
          description: words.descriptions.hangame,
        },
        {
          id: "braintv",
          name: words.linkNames.braintv,
          url: "https://www.braintv.co.kr/web_basic/board/view.asp?pagen=142&sno=3189",
          description: words.descriptions.braintv,
        },
        {
          id: "community",
          name: words.linkNames.community,
          url: "https://namu.wiki/w/귀마%20포진",
          description: words.descriptions.community,
          related: [
            {id: "namu-terms", name: words.linkNames.namuTerms, url: "https://namu.wiki/w/장기/용어"},
            {
              id: "janggi-forum",
              name: words.linkNames.janggiForum,
              url: "https://gall.dcinside.com/mgallery/board/view/?id=janggi&no=4912",
            },
          ],
        },
        {
          id: "chessvariants",
          name: "The Chess Variant Pages & Korean Wikibooks contributors",
          url: "https://www.chessvariants.com/oriental.dir/korean/changgi-opening.html",
          description: words.descriptions.chessvariants,
          related: [
            {
              id: "chessvariants-archive",
              name: words.linkNames.chessvariantsArchive,
              url: "https://web.archive.org/web/https://www.chessvariants.com/oriental.dir/korean/changgi-opening.html",
            },
            {
              id: "wikibooks",
              name: words.linkNames.wikibooks,
              url: "https://ko.wikibooks.org/wiki/장기/초반_포진법",
            },
          ],
        },
        {
          id: "openings-research",
          name: words.linkNames.openingsResearch,
          url: "https://github.com/neil-armstrong-fig/janggi/blob/main/docs/opening-setups.md",
          description: words.descriptions.openingsResearch,
        },
      ],
    },
    {
      id: "opponent",
      title: words.sections.opponent.title,
      introduction: words.sections.opponent.introduction,
      references: [
        {
          id: "fairy-stockfish",
          name: "Fairy-Stockfish",
          url: "https://github.com/fairy-stockfish/Fairy-Stockfish",
          description: words.descriptions.fairyStockfish,
          licence: "GPL-3.0",
          related: [
            {
              id: "engine-licence",
              name: words.linkNames.engineLicence,
              url: `${import.meta.env.BASE_URL}engine/Copying.txt`,
            },
            {
              id: "engine-authors",
              name: words.linkNames.engineAuthors,
              url: `${import.meta.env.BASE_URL}engine/AUTHORS`,
            },
            {id: "stockfish", name: words.linkNames.stockfish, url: "https://stockfishchess.org/"},
          ],
        },
        {
          id: "fairy-wasm",
          name: "fairy-stockfish-nnue.wasm",
          url: "https://github.com/fairy-stockfish/fairy-stockfish.wasm",
          description: words.descriptions.fairyWasm,
          licence: "GPL-3.0",
        },
        {
          id: "coi-serviceworker",
          name: "Guido Zuidhof & coi-serviceworker contributors",
          url: "https://github.com/gzuidhof/coi-serviceworker",
          description: words.descriptions.coiServiceworker,
          licence: "MIT",
        },
        {
          id: "bot-research",
          name: words.linkNames.botResearch,
          url: "https://github.com/neil-armstrong-fig/janggi/blob/main/docs/bot.md",
          description: words.descriptions.botResearch,
        },
      ],
    },
    {
      id: "tools",
      title: words.sections.tools.title,
      introduction: words.sections.tools.introduction,
      references: [
        {
          id: "react",
          name: "React & React DOM",
          url: "https://github.com/facebook/react",
          description: words.descriptions.react,
          licence: "MIT",
        },
        {
          id: "redux-toolkit",
          name: "Redux Toolkit",
          url: "https://github.com/reduxjs/redux-toolkit",
          description: words.descriptions.reduxToolkit,
          licence: "MIT",
        },
        {
          id: "react-redux",
          name: "React Redux",
          url: "https://github.com/reduxjs/react-redux",
          description: words.descriptions.reactRedux,
          licence: "MIT",
        },
        {
          id: "clsx",
          name: "clsx",
          url: "https://github.com/lukeed/clsx",
          description: words.descriptions.clsx,
          licence: "MIT",
        },
        {
          id: "tailwind",
          name: words.linkNames.tailwind,
          url: "https://github.com/tailwindlabs/tailwindcss",
          description: words.descriptions.tailwind,
          licence: "MIT",
        },
        {
          id: "vite",
          name: "Vite",
          url: "https://github.com/vitejs/vite",
          description: words.descriptions.vite,
          licence: "MIT",
          related: [
            {id: "vite-react", name: words.linkNames.viteReact, url: "https://github.com/vitejs/vite-plugin-react"},
          ],
        },
        {
          id: "vite-pwa",
          name: "Vite PWA",
          url: "https://github.com/vite-pwa/vite-plugin-pwa",
          description: words.descriptions.vitePwa,
          licence: "MIT",
        },
        {
          id: "workbox",
          name: "Workbox",
          url: "https://github.com/GoogleChrome/workbox",
          description: words.descriptions.workbox,
          licence: "MIT",
        },
        {
          id: "typescript",
          name: "TypeScript",
          url: "https://github.com/microsoft/TypeScript",
          description: words.descriptions.typescript,
          licence: "Apache-2.0",
        },
        {
          id: "pnpm",
          name: "pnpm",
          url: "https://github.com/pnpm/pnpm",
          description: words.descriptions.pnpm,
          licence: "MIT",
        },
        {
          id: "playwright",
          name: "Playwright",
          url: "https://github.com/microsoft/playwright",
          description: words.descriptions.playwright,
          licence: "Apache-2.0",
        },
        {
          id: "vitest",
          name: "Vitest",
          url: "https://github.com/vitest-dev/vitest",
          description: words.descriptions.vitest,
          licence: "MIT",
        },
        {
          id: "testing-library",
          name: "Testing Library",
          url: "https://github.com/testing-library/react-testing-library",
          description: words.descriptions.testingLibrary,
          licence: "MIT",
          related: [
            {
              id: "testing-library-dom",
              name: "DOM Testing Library",
              url: "https://github.com/testing-library/dom-testing-library",
            },
            {id: "testing-library-jest-dom", name: "jest-dom", url: "https://github.com/testing-library/jest-dom"},
          ],
        },
        {
          id: "fast-check",
          name: "fast-check",
          url: "https://github.com/dubzzz/fast-check",
          description: words.descriptions.fastCheck,
          licence: "MIT",
        },
        {
          id: "jsdom",
          name: "jsdom",
          url: "https://github.com/jsdom/jsdom",
          description: words.descriptions.jsdom,
          licence: "MIT",
        },
        {
          id: "eslint",
          name: "ESLint & @eslint/js",
          url: "https://github.com/eslint/eslint",
          description: words.descriptions.eslint,
          licence: "MIT",
        },
        {
          id: "typescript-eslint",
          name: "typescript-eslint",
          url: "https://github.com/typescript-eslint/typescript-eslint",
          description: words.descriptions.typescriptEslint,
          licence: "MIT",
        },
        {
          id: "eslint-react",
          name: "ESLint React",
          url: "https://github.com/Rel1cx/eslint-react",
          description: words.descriptions.eslintReact,
          licence: "MIT",
        },
        {
          id: "globals",
          name: "globals",
          url: "https://github.com/sindresorhus/globals",
          description: words.descriptions.globals,
          licence: "MIT",
        },
        {
          id: "prettier",
          name: "Prettier",
          url: "https://github.com/prettier/prettier",
          description: words.descriptions.prettier,
          licence: "MIT",
          related: [
            {
              id: "eslint-config-prettier",
              name: "eslint-config-prettier",
              url: "https://github.com/prettier/eslint-config-prettier",
            },
          ],
        },
        {
          id: "definitelytyped",
          name: "DefinitelyTyped contributors",
          url: "https://github.com/DefinitelyTyped/DefinitelyTyped",
          description: words.descriptions.definitelytyped,
          licence: "MIT",
        },
      ],
    },
  ];
}
