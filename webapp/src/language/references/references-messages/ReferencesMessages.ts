import type {LanguageName} from "@janggi/shared/janggi/settings/LanguageName";
import type {MachineTranslationNoticeMessages} from "@src/language/types/MachineTranslationNoticeMessages";

/** Every word of the references page. Like the guide's, it is not part of `Messages`, which every game page carries. */
export interface ReferencesMessages {
  readonly translationNotice: MachineTranslationNoticeMessages | undefined;
  readonly header: ReferencesHeaderMessages;
  readonly navigationLabel: string;
  readonly languageLabel: string;
  readonly languageNames: Readonly<Record<LanguageName, string>>;
  readonly licenceOf: (licence: string) => string;
  readonly thanks: string;
  readonly sections: ReferenceSectionsMessages;
  readonly descriptions: ReferenceDescriptionsMessages;
  readonly linkNames: ReferenceLinkNamesMessages;
}

/** What each source contributed, in a sentence or two. */
interface ReferenceDescriptionsMessages {
  readonly kja: string;
  readonly kojf: string;
  readonly wikipedia: string;
  readonly pychess: string;
  readonly rulesResearch: string;
  readonly jangHayoung: string;
  readonly elephantWikipedia: string;
  readonly hangame: string;
  readonly braintv: string;
  readonly community: string;
  readonly chessvariants: string;
  readonly openingsResearch: string;
  readonly fairyStockfish: string;
  readonly fairyWasm: string;
  readonly coiServiceworker: string;
  readonly botResearch: string;
  readonly react: string;
  readonly reduxToolkit: string;
  readonly reactRedux: string;
  readonly clsx: string;
  readonly tailwind: string;
  readonly vite: string;
  readonly vitePwa: string;
  readonly workbox: string;
  readonly typescript: string;
  readonly pnpm: string;
  readonly playwright: string;
  readonly vitest: string;
  readonly testingLibrary: string;
  readonly fastCheck: string;
  readonly jsdom: string;
  readonly eslint: string;
  readonly typescriptEslint: string;
  readonly eslintReact: string;
  readonly globals: string;
  readonly prettier: string;
  readonly definitelytyped: string;
}

/** The links this project named for itself, as against the names other people gave their work. */
interface ReferenceLinkNamesMessages {
  readonly botResearch: string;
  readonly braintv: string;
  readonly chessvariantsArchive: string;
  readonly community: string;
  readonly engineAuthors: string;
  readonly engineLicence: string;
  readonly hangame: string;
  readonly jangFormations: string;
  readonly jangHorsesElephants: string;
  readonly jangResponse: string;
  readonly janggiForum: string;
  readonly kjaMovement: string;
  readonly kjaRegulations: string;
  readonly kjaRules: string;
  readonly kojfPassing: string;
  readonly namuTerms: string;
  readonly openingsResearch: string;
  readonly pychessSetups: string;
  readonly pychessSource: string;
  readonly rulesResearch: string;
  readonly setupTemplate: string;
  readonly stockfish: string;
  readonly tailwind: string;
  readonly viteReact: string;
  readonly wikibooks: string;
  readonly wikipediaKorean: string;
  readonly yangSang: string;
}

interface ReferenceSectionsMessages {
  readonly rules: ReferenceSectionMessages;
  readonly openings: ReferenceSectionMessages;
  readonly opponent: ReferenceSectionMessages;
  readonly tools: ReferenceSectionMessages;
}

interface ReferenceSectionMessages {
  readonly title: string;
  readonly introduction: string;
}

interface ReferencesHeaderMessages {
  readonly title: string;
  readonly introduction: string;
  readonly repository: string;
  /** Who made the game, up to the link to its licence. */
  readonly byline: string;
  readonly projectLicence: string;
}
