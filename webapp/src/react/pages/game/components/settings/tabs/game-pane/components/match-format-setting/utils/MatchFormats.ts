import {MATCH_FORMATS} from "@janggi/shared/janggi/settings/MatchFormat";

/**
 * The two formats, as the picker offers them: mapped off the shared list, so one added to the
 * vocabulary appears in the picker without anyone remembering to add it here.
 *
 * The `{name}` is all `OptionPicker` asks of anything it lists, and a format has nothing else to
 * put beside it — so the mapped type is left inferred rather than named, which is what keeps
 * `option.name` a `MatchFormat` at the call site instead of a widened `string`.
 */
export const MATCH_FORMAT_OPTIONS = MATCH_FORMATS.map(name => ({name}));
