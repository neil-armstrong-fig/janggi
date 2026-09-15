import type {ReferenceSection} from "@src/react/pages/references/types/ReferenceSection";

/**
 * Reader-facing acknowledgements. The evidence and its limitations live in docs/rules.md,
 * docs/opening-setups.md and docs/bot.md; these summaries point back to that research.
 * Software licences are read from the installed packages, with sibling packages credited together.
 */
export const REFERENCE_SECTIONS: readonly ReferenceSection[] = [
  {
    id: "rules",
    title: "Rules & match formats",
    introduction:
      "Janggi has more than one tradition of play. In this app, Casual allows a called bikjang to end in a draw; Scored applies additional conditions and settles it on points. These formats are our reading of the sources below, whose accounts of bikjang, repetition and passing do not always agree.",
    references: [
      {
        id: "kja",
        name: "대한장기협회 · Korea Janggi Association",
        url: "http://www.kja.or.kr/business/business5.php",
        description:
          "The association’s match regulations informed scoring, repetition and the 30-point condition for bikjang, including the exception after a general captures a piece. In Korean.",
        related: [
          {
            id: "kja-movement",
            name: "Piece movement rules (archived)",
            url: "https://web.archive.org/web/2013/http://kja.or.kr/janggi_intro/c.php",
          },
          {
            id: "kja-regulations",
            name: "Match regulations (2013 archive)",
            url: "https://web.archive.org/web/20131005190526/http://kja.or.kr/janggi_intro/f.php",
          },
          {
            id: "kja-rules",
            name: "Match rules (2011 archive)",
            url: "https://web.archive.org/web/20111124010550/http://www.kja.or.kr:80/janggi_intro/e.php",
          },
        ],
      },
      {
        id: "kojf",
        name: "대한장기연맹 · Korean Janggi Federation",
        url: "https://kojf.net/bbs/board.php?bo_table=board_notice&wr_id=478",
        description:
          "A separate federation. Its 2020 revision abolished draws in its tournaments and supplied the points-based reading; the 2022 revision clarifies passing and settlement after two consecutive passes. In Korean.",
        related: [
          {
            id: "kojf-passing",
            name: "2022 rules revision",
            url: "http://kojf.net/bbs/board.php?bo_table=board_notice&wr_id=706",
          },
        ],
      },
      {
        id: "wikipedia",
        name: "Wikipedia contributors · Janggi / 장기",
        url: "https://en.wikipedia.org/wiki/Janggi",
        description:
          "English and Korean accounts helped cross-check the board, piece movements, values, Han’s 1.5-point allowance and casual play. Community explanations sometimes differ from federation regulations.",
        related: [{id: "wikipedia-korean", name: "장기 (Korean)", url: "https://ko.wikipedia.org/wiki/장기"}],
      },
      {
        id: "pychess",
        name: "PyChess Variants contributors",
        url: "https://www.pychess.org/variants/janggi",
        description:
          "A working janggi implementation and an accessible explanation of the game. Consulted for cannon movement along palace diagonals, adjudication and opening choices; its setup names require care when comparing board orientation.",
        related: [
          {
            id: "pychess-source",
            name: "Janggi documentation source",
            url: "https://github.com/gbtami/pychess-variants/blob/master/static/docs/janggi.md",
          },
          {
            id: "pychess-setups",
            name: "Opening setup interface source",
            url: "https://github.com/gbtami/pychess-variants/blob/master/client/roundCtrl.ts",
          },
        ],
      },
      {
        id: "rules-research",
        name: "How this app interprets the rules",
        url: "https://github.com/neil-armstrong-fig/janggi/blob/main/docs/rules.md",
        description:
          "Our research notes trace every piece’s moves and explain the decisions made where the sources disagree, including the distinction between Casual and Scored.",
      },
    ],
  },
  {
    id: "openings",
    title: "Opening arrangements & variants",
    introduction:
      "Names for horse and elephant arrangements can change with the writer’s viewpoint. We compared diagrams, move lists and Korean terminology to settle the app’s opening names and its descriptions of facing and crossed elephants.",
    references: [
      {
        id: "jang-hayoung",
        name: "장하영 · Jang Ha-young, writing in 서산시대",
        url: "http://www.sstimes.kr/news/articleView.html?idxno=21698",
        description:
          "A professional player’s columns supplied annotated games, formation statistics and discussion of 맞상. The move lists helped resolve which board orientation a description actually meant. Some naming differs even between the columns. In Korean.",
        related: [
          {
            id: "jang-formations",
            name: "Key ideas in representative formations",
            url: "http://www.sstimes.kr/news/articleView.html?idxno=24456",
          },
          {
            id: "jang-response",
            name: "A response to the double-horse formation",
            url: "http://www.sstimes.kr/news/articleView.html?idxno=21988",
          },
          {
            id: "jang-horses-elephants",
            name: "Horses and elephants in the opening",
            url: "https://www.sstimes.kr/news/articleView.html?idxno=24375",
          },
        ],
      },
      {
        id: "elephant-wikipedia",
        name: "Korean Wikipedia & Wikimedia Commons contributors",
        url: "https://ko.wikipedia.org/wiki/상_(장기)",
        description:
          "The elephant article and opening diagrams supplied explicit placements for 왼상차림. The English setup template also helped establish how Wikipedia draws the two armies.",
        related: [
          {
            id: "yang-sang",
            name: "Yang sang board diagram",
            url: "https://commons.wikimedia.org/wiki/File:Yang_sang.png",
          },
          {
            id: "setup-template",
            name: "English Janggi setup template",
            url: "https://en.wikipedia.org/wiki/Template:Janggi_setup",
          },
        ],
      },
      {
        id: "hangame",
        name: "한게임 · Hangame janggi glossary",
        url: "https://janggi.hangame.com/tip.nhn?id=1",
        description:
          "Korean names for the four arrangements, formation vocabulary and the distinction between an initial arrangement and a developed opening. Its orientation is not always explicit.",
      },
      {
        id: "braintv",
        name: "BrainTV · Opening formations and their strengths",
        url: "https://www.braintv.co.kr/web_basic/board/view.asp?pagen=142&sno=3189",
        description:
          "Descriptions of five formations and their tradeoffs helped connect starting arrangements with the openings they lead to. In Korean.",
      },
      {
        id: "community",
        name: "Supporting community sources · Namu Wiki",
        url: "https://namu.wiki/w/귀마%20포진",
        description:
          "Namu Wiki and the janggi discussion board helped compare everyday usage of 맞상 and 엇상. These were available only through search summaries during the research, so they support the comparison rather than settle a rule.",
        related: [
          {id: "namu-terms", name: "Namu Wiki terminology", url: "https://namu.wiki/w/장기/용어"},
          {
            id: "janggi-forum",
            name: "Janggi community discussion",
            url: "https://gall.dcinside.com/mgallery/board/view/?id=janggi&no=4912",
          },
        ],
      },
      {
        id: "chessvariants",
        name: "The Chess Variant Pages & Korean Wikibooks contributors",
        url: "https://www.chessvariants.com/oriental.dir/korean/changgi-opening.html",
        description:
          "Further background on setup order, the sixteen combinations and developed opening formations. The Chess Variant Pages article may require its archived copy.",
        related: [
          {
            id: "chessvariants-archive",
            name: "Opening setups (archive)",
            url: "https://web.archive.org/web/https://www.chessvariants.com/oriental.dir/korean/changgi-opening.html",
          },
          {
            id: "wikibooks",
            name: "Wikibooks: early formations (Korean)",
            url: "https://ko.wikibooks.org/wiki/장기/초반_포진법",
          },
        ],
      },
      {
        id: "openings-research",
        name: "How this app names the openings",
        url: "https://github.com/neil-armstrong-fig/janggi/blob/main/docs/opening-setups.md",
        description:
          "The full comparison, with diagrams, translated passages, decoded move lists and an assessment of each source’s evidence.",
      },
    ],
  },
  {
    id: "opponent",
    title: "The computer opponent",
    introduction:
      "Thank you to Fabian Fichter and the Fairy-Stockfish and Stockfish contributors for the engine behind the bot. This app checks every move against its own rules before playing it. The displayed bot strengths are nominal Elo, calibrated on chess rather than janggi.",
    references: [
      {
        id: "fairy-stockfish",
        name: "Fairy-Stockfish",
        url: "https://github.com/fairy-stockfish/Fairy-Stockfish",
        description:
          "The open source engine searches for the bot’s moves. Its built-in janggi variants differ from this app on bikjang and repetition, which is why our game engine remains the referee.",
        licence: "GPL-3.0",
        related: [
          {
            id: "engine-licence",
            name: "Licence shipped with the engine",
            url: `${import.meta.env.BASE_URL}engine/Copying.txt`,
          },
          {
            id: "engine-authors",
            name: "Fairy-Stockfish & Stockfish authors",
            url: `${import.meta.env.BASE_URL}engine/AUTHORS`,
          },
          {id: "stockfish", name: "Stockfish project", url: "https://stockfishchess.org/"},
        ],
      },
      {
        id: "fairy-wasm",
        name: "fairy-stockfish-nnue.wasm",
        url: "https://github.com/fairy-stockfish/fairy-stockfish.wasm",
        description:
          "The WebAssembly port lets the engine run on your device, inside the browser. Its published engine files are served unmodified with their licence and authors list.",
        licence: "GPL-3.0",
      },
      {
        id: "coi-serviceworker",
        name: "Guido Zuidhof & coi-serviceworker contributors",
        url: "https://github.com/gzuidhof/coi-serviceworker",
        description:
          "Credit for the service-worker technique that makes threaded WebAssembly possible on hosts such as GitHub Pages. This app implements that approach in its own service worker; it does not install this library.",
        licence: "MIT",
      },
      {
        id: "bot-research",
        name: "How the bot fits this app’s rules",
        url: "https://github.com/neil-armstrong-fig/janggi/blob/main/docs/bot.md",
        description:
          "Our notes on engine variants, move validation, nominal strength and running the engine in an installable web app.",
      },
    ],
  },
  {
    id: "tools",
    title: "Open source software & tools",
    introduction:
      "The app and its development tools are built on the work of these projects and their contributors. Related packages are credited together below, with links to their source and licence terms.",
    references: [
      {
        id: "react",
        name: "React & React DOM",
        url: "https://github.com/facebook/react",
        description:
          "Render the board, controls and this page. The React Hooks ESLint plugin checks how our hooks are used.",
        licence: "MIT",
      },
      {
        id: "redux-toolkit",
        name: "Redux Toolkit",
        url: "https://github.com/reduxjs/redux-toolkit",
        description: "Manages the game, preferences and results as predictable state changes.",
        licence: "MIT",
      },
      {
        id: "react-redux",
        name: "React Redux",
        url: "https://github.com/reduxjs/react-redux",
        description: "Connects the React interface to the game’s stored state.",
        licence: "MIT",
      },
      {
        id: "clsx",
        name: "clsx",
        url: "https://github.com/lukeed/clsx",
        description: "Assembles the class names used to show selections, moves and interface states.",
        licence: "MIT",
      },
      {
        id: "tailwind",
        name: "Tailwind CSS & its Vite plugin",
        url: "https://github.com/tailwindlabs/tailwindcss",
        description: "Provides the styling utilities for the board and the interface around it.",
        licence: "MIT",
      },
      {
        id: "vite",
        name: "Vite",
        url: "https://github.com/vitejs/vite",
        description: "Serves the app during development and builds the files deployed to GitHub Pages.",
        licence: "MIT",
        related: [{id: "vite-react", name: "React plugin (MIT)", url: "https://github.com/vitejs/vite-plugin-react"}],
      },
      {
        id: "vite-pwa",
        name: "Vite PWA",
        url: "https://github.com/vite-pwa/vite-plugin-pwa",
        description: "Builds and registers the service worker and generates the installable app manifest.",
        licence: "MIT",
      },
      {
        id: "workbox",
        name: "Workbox",
        url: "https://github.com/GoogleChrome/workbox",
        description: "Keeps the app available offline through its build, precaching, routing and window packages.",
        licence: "MIT",
      },
      {
        id: "typescript",
        name: "TypeScript",
        url: "https://github.com/microsoft/TypeScript",
        description: "Checks the types shared by the game, interface and tests.",
        licence: "Apache-2.0",
      },
      {
        id: "pnpm",
        name: "pnpm",
        url: "https://github.com/pnpm/pnpm",
        description: "Installs the pinned dependencies and runs the workspace’s commands.",
        licence: "MIT",
      },
      {
        id: "playwright",
        name: "Playwright",
        url: "https://github.com/microsoft/playwright",
        description: "Drives real browsers through the acceptance tests on desktop and mobile viewports.",
        licence: "Apache-2.0",
      },
      {
        id: "vitest",
        name: "Vitest",
        url: "https://github.com/vitest-dev/vitest",
        description: "Runs the unit tests, including the rules and the decisions behind the interface.",
        licence: "MIT",
      },
      {
        id: "testing-library",
        name: "Testing Library",
        url: "https://github.com/testing-library/react-testing-library",
        description:
          "React Testing Library, DOM Testing Library and jest-dom support the custom-hook tests and their assertions.",
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
        description:
          "Generates random games and positions to look for rule failures, then shrinks failures to smaller examples.",
        licence: "MIT",
      },
      {
        id: "jsdom",
        name: "jsdom",
        url: "https://github.com/jsdom/jsdom",
        description: "Provides a browser-like document for hook tests running under Node.",
        licence: "MIT",
      },
      {
        id: "eslint",
        name: "ESLint & @eslint/js",
        url: "https://github.com/eslint/eslint",
        description: "Checks code quality and enforces the boundaries between the workspace packages.",
        licence: "MIT",
      },
      {
        id: "typescript-eslint",
        name: "typescript-eslint",
        url: "https://github.com/typescript-eslint/typescript-eslint",
        description: "Lets ESLint understand TypeScript and check rules that depend on types.",
        licence: "MIT",
      },
      {
        id: "eslint-react",
        name: "ESLint React",
        url: "https://github.com/Rel1cx/eslint-react",
        description: "Checks the React components for correctness.",
        licence: "MIT",
      },
      {
        id: "globals",
        name: "globals",
        url: "https://github.com/sindresorhus/globals",
        description: "Tells the lint configuration which global names belong to browsers and Node.",
        licence: "MIT",
      },
      {
        id: "prettier",
        name: "Prettier",
        url: "https://github.com/prettier/prettier",
        description:
          "Formats the code consistently; eslint-config-prettier keeps formatting and lint rules from conflicting.",
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
        description: "Maintains the React, React DOM and Node type definitions used throughout the project.",
        licence: "MIT",
      },
    ],
  },
];
