import type {ReferencesMessages} from "@src/language/types/references/ReferencesMessages";

/** Every word of the references page in English, the original the Korean page is translated from. */
export const ENGLISH_REFERENCES: ReferencesMessages = {
  translationNotice: undefined,
  header: {
    title: "References & credits",
    introduction:
      "A game with a long history, made possible here by a generous community. Thank you to the players, writers and open source contributors whose work helped us build it.",
    repository: "View the source on GitHub",
    byline: "Janggi by Neil Armstrong · ",
    projectLicence: "MIT licence",
  },
  navigationLabel: "On this page",
  languageLabel: "Language",
  languageNames: {en: "English", ko: "한국어"},
  licenceOf: licence => `${licence} licence`,
  thanks:
    "Thank you to everyone who shares their knowledge of janggi and makes their work available for others to build on.",
  sections: {
    rules: {
      title: "Rules & match formats",
      introduction:
        "Janggi has more than one tradition of play. In this app, Casual lets a called bikjang end in a draw. Scored adds conditions and settles it on points. These formats are our reading of the sources below, whose accounts of bikjang, repetition and passing do not always agree.",
    },
    openings: {
      title: "Opening arrangements & variants",
      introduction:
        "Names for horse and elephant arrangements can change with the writer’s viewpoint. We compared diagrams, move lists and Korean terminology to settle the app’s opening names and its descriptions of facing and crossed elephants.",
    },
    opponent: {
      title: "The computer opponent",
      introduction:
        "Thank you to Fabian Fichter and the Fairy-Stockfish and Stockfish contributors for the engine behind the bot. This app checks every move against its own rules before playing it. The displayed bot strengths are nominal Elo, calibrated on chess, not janggi.",
    },
    tools: {
      title: "Open source software & tools",
      introduction:
        "The app and its development tools are built on the work of these projects and their contributors. Related packages are credited together below, with links to their source and licence terms.",
    },
  },
  descriptions: {
    kja: "The association’s match regulations informed scoring, repetition and the 30-point condition for bikjang, including the exception after a general captures a piece. In Korean.",
    kojf: "A separate federation. Its 2020 revision abolished draws in its tournaments and supplied the points-based reading. Its 2022 revision clarifies passing and settlement after two consecutive passes. In Korean.",
    wikipedia:
      "English and Korean accounts helped cross-check the board, piece movements, values, Han’s 1.5-point allowance and casual play. Community explanations sometimes differ from federation regulations.",
    pychess:
      "A working janggi implementation and an accessible explanation of the game. Consulted for cannon movement along palace diagonals, adjudication and opening choices. Its setup names need care when comparing board orientation.",
    rulesResearch:
      "Our research notes trace every piece’s moves and explain the decisions made where the sources disagree, including the distinction between Casual and Scored.",
    jangHayoung:
      "A professional player’s columns supplied annotated games, formation statistics and discussion of 맞상. The move lists helped resolve which board orientation a description actually meant. Some naming differs even between the columns. In Korean.",
    elephantWikipedia:
      "The elephant article and opening diagrams supplied explicit placements for 왼상차림. The English setup template also helped establish how Wikipedia draws the two armies.",
    hangame:
      "Korean names for the four arrangements, formation vocabulary and the distinction between an initial arrangement and a developed opening. Its orientation is not always explicit.",
    braintv:
      "Descriptions of five formations and their tradeoffs helped connect starting arrangements with the openings they lead to. In Korean.",
    community:
      "Namu Wiki and the janggi discussion board helped compare everyday usage of 맞상 and 엇상. These were available only through search summaries during the research, so they back up the comparison but don't settle a rule.",
    chessvariants:
      "Further background on setup order, the sixteen combinations and developed opening formations. The Chess Variant Pages article may require its archived copy.",
    openingsResearch:
      "The full comparison, with diagrams, translated passages, decoded move lists and an assessment of each source’s evidence.",
    fairyStockfish:
      "The open source engine searches for the bot’s moves. Its built-in janggi variants differ from this app on bikjang and repetition, which is why our game engine remains the referee.",
    fairyWasm:
      "The WebAssembly port lets the engine run on your device, inside the browser. Its published engine files are served unmodified with their licence and authors list.",
    coiServiceworker:
      "Credit for the service-worker technique that makes threaded WebAssembly possible on hosts such as GitHub Pages. This app implements that approach in its own service worker and does not install this library.",
    botResearch:
      "Our notes on engine variants, move validation, nominal strength and running the engine in an installable web app.",
    react: "Render the board, controls and this page. The React Hooks ESLint plugin checks how our hooks are used.",
    reduxToolkit: "Manages the game, preferences and results as predictable state changes.",
    reactRedux: "Connects the React interface to the game’s stored state.",
    clsx: "Assembles the class names used to show selections, moves and interface states.",
    tailwind: "Provides the styling utilities for the board and the interface around it.",
    vite: "Serves the app during development and builds the files deployed to GitHub Pages.",
    vitePwa: "Builds and registers the service worker and generates the installable app manifest.",
    workbox: "Keeps the app available offline through its build, precaching, routing and window packages.",
    typescript: "Checks the types shared by the game, interface and tests.",
    pnpm: "Installs the pinned dependencies and runs the workspace’s commands.",
    playwright: "Drives real browsers through the acceptance tests on desktop and mobile viewports.",
    vitest: "Runs the unit tests, including the rules and the decisions behind the interface.",
    testingLibrary:
      "React Testing Library, DOM Testing Library and jest-dom support the custom-hook tests and their assertions.",
    fastCheck:
      "Generates random games and positions to look for rule failures, then shrinks failures to smaller examples.",
    jsdom: "Provides a browser-like document for hook tests running under Node.",
    eslint: "Checks code quality and enforces the boundaries between the workspace packages.",
    typescriptEslint: "Lets ESLint understand TypeScript and check rules that depend on types.",
    eslintReact: "Checks the React components for correctness.",
    globals: "Tells the lint configuration which global names belong to browsers and Node.",
    prettier: "Formats the code consistently. eslint-config-prettier stops formatting and lint rules from conflicting.",
    definitelytyped: "Maintains the React, React DOM and Node type definitions used throughout the project.",
  },
  linkNames: {
    botResearch: "How the bot fits this app’s rules",
    braintv: "BrainTV · Opening formations and their strengths",
    chessvariantsArchive: "Opening setups (archive)",
    community: "Supporting community sources · Namu Wiki",
    engineAuthors: "Fairy-Stockfish & Stockfish authors",
    engineLicence: "Licence shipped with the engine",
    hangame: "한게임 · Hangame janggi glossary",
    jangFormations: "Key ideas in representative formations",
    jangHorsesElephants: "Horses and elephants in the opening",
    jangResponse: "A response to the double-horse formation",
    janggiForum: "Janggi community discussion",
    kjaMovement: "Piece movement rules (archived)",
    kjaRegulations: "Match regulations (2013 archive)",
    kjaRules: "Match rules (2011 archive)",
    kojfPassing: "2022 rules revision",
    namuTerms: "Namu Wiki terminology",
    openingsResearch: "How this app names the openings",
    pychessSetups: "Opening setup interface source",
    pychessSource: "Janggi documentation source",
    rulesResearch: "How this app interprets the rules",
    setupTemplate: "English Janggi setup template",
    stockfish: "Stockfish project",
    tailwind: "Tailwind CSS & its Vite plugin",
    viteReact: "React plugin (MIT)",
    wikibooks: "Wikibooks: early formations (Korean)",
    wikipediaKorean: "장기 (Korean)",
    yangSang: "Yang sang board diagram",
  },
};
