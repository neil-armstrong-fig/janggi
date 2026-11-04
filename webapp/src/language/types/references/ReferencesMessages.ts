import type {LanguageName} from "@janggi/shared/janggi/settings/LanguageName";
import type {MachineTranslationNoticeMessages} from "@src/language/types/MachineTranslationNoticeMessages";
import type {ReferenceDescriptionsMessages} from "@src/language/types/references/ReferenceDescriptionsMessages";
import type {ReferenceLinkNamesMessages} from "@src/language/types/references/ReferenceLinkNamesMessages";
import type {ReferencesHeaderMessages} from "@src/language/types/references/ReferencesHeaderMessages";
import type {ReferenceSectionsMessages} from "@src/language/types/references/ReferenceSectionsMessages";

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
